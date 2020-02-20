import * as db from "../others/db";
import { Request, Response, NextFunction } from "express";

export class RESTController<T extends db.DbObject> {
    repo: db.Repository<T>;
    allowedKeys: string[];
    relations: string[];

    public constructor(repo: db.Repository<T>, allowedKeys: string[], relations: string[]) {
        this.repo = repo;
        this.allowedKeys = allowedKeys;
        this.relations = relations;
    }

    public jsonToObject(jsonObject: any): T {
        const retObj: T = Object.assign({}, jsonObject);
        if (jsonObject._id && !jsonObject._id.value)
            retObj._id = new db.DbObjectId(jsonObject._id);
        this.handleBoolean(retObj);
        this.relations.forEach(relation => {
            if (jsonObject[relation] && !jsonObject[relation].value) {
                const value = new db.DbObjectId(jsonObject[relation]);
                const obj: any = { [relation]: value };
                Object.assign(retObj, obj);
            }
        });
        return retObj;
    }
    public objectToJson(object: T): any {
        const retObj: any = Object.assign({}, object);
        this.handleBoolean(retObj);
        if (object._id)
            retObj._id = object._id.value;
        this.relations.forEach(relation => {
            const relationId = (object as any)[relation];
            if (relationId)
                retObj[relation] = relationId.value;
        });
        return retObj;
    }

    public handleBoolean(object: T): any {
        // BugFix: "JSGrid checkboxes always checked"
        for (const [key, value] of Object.entries(object)) {
            if(value === "true")
                (object as any)[key] = true;
            if(value === "false")
                (object as any)[key] = false;
        }
    }

    public filterQuery(req: Request): db.Query {
        const newQuery = new Map<string, string>();
        const oldQueryKeys = Object.keys(req.query);
        oldQueryKeys.forEach( (key: string) => {
            if (this.allowedKeys.includes(key) && req.query[key]) {
            newQuery.set(key, req.query[key]);
            }
        });
        const query: db.Query = newQuery.entries ? db.query().byProperties(newQuery) : db.query().all();
        return query;
    }

    public async get(req: Request, res: Response) {
        try {
            const query = this.filterQuery(req);
            const result: T[] = await this.repo.list(query);
            if (result.length === 0) {
                res.statusCode = 404;
                res.end();
            } else {
                res.statusCode = 200;
                const resArr = result.map(this.objectToJson.bind(this));
                res.json(resArr);
            }
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
    }

    public async update(req: Request, res: Response) {
        try {
            const obj: T = this.jsonToObject(req.body);
            const result: number = await this.repo.update(obj);
            if (result === 0) {
                res.statusCode = 304;
                res.end();
            } else {
                res.statusCode = 200;
                res.json(obj);
            }
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
    }

    public async add(req: Request, res: Response) {
        try {
            const obj: T = this.jsonToObject(req.body);
            await this.repo.add(obj);
            res.statusCode = 201;
            res.json(this.objectToJson(obj));
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
    }

    public async del(req: Request, res: Response) {
        try {
            const id = req.body._id;
            const dbId = new db.DbObjectId(id);
            const query: db.Query = id === "all" ? db.query().all() : db.query().byId(dbId);
            const result: number = await this.repo.remove(query);
            if (result === 0) {
                res.statusCode = 404;
                res.end();
            } else {
                res.statusCode = 200;
                res.json(result);
            }
        } catch (err) {
            console.error(err);
            res.status(500).end();
        }
    }
}