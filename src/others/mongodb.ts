import { DbObject, QueryBuilder, Repository } from "./db";
import { ModuleFactory } from "../interfaces/ModuleFactory";
import { MongoDBQueryBuilder } from "../classes/MongoDBQueryBuilder";
import { MongoDBRepository } from "../classes/MongoDBRepository";

export class MongoDbModuleFactory implements ModuleFactory {

    public createRepository<T extends DbObject>(opts: any): Repository<T> {
        return new MongoDBRepository<T>(opts.table);
    }
    public createQueryBuilder(opts: any): QueryBuilder {
        return new MongoDBQueryBuilder();
    }
}

export const init = () => new MongoDbModuleFactory();