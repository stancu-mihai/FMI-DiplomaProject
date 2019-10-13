import { DbObjectId, Query, QueryBuilder } from "../others/db";
import { ObjectID } from "mongodb";
import { replaceRepoIdsWithMongoIds } from "../others/IdConversion";

export class MongoDBQueryBuilder implements QueryBuilder {
    all(): Query {
        return {
            build: (): any => {
                return null;
            }
        };
    }
    byId(id: string | DbObjectId): Query {
        return {
            build: (): any => {
                const filter: any = {};
                if (id instanceof DbObjectId) {
                    const dbId: DbObjectId = id;
                    filter["_id"] = new ObjectID(dbId.value);
                } else {
                    const strId: string = id;
                    filter["_id"] = new ObjectID(strId);
                }

                return filter;
            }
        };
    }
    byProperty(propName: string, propVal: string | number | boolean | Date | DbObjectId): Query {
        return {
            build: (): any => {
                const filter: any = {};
                if (propVal instanceof DbObjectId)
                    filter[propName] = new ObjectID(propVal.value);
                else
                    filter[propName] = propVal;

                return filter;
            }
        };
    }
    byProperties(dict: any): Query {
        return {
            build: (): any => {
                replaceRepoIdsWithMongoIds(dict);
                return dict;
            }
        };
    }
}