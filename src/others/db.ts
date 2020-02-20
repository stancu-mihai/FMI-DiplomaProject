import { DbObjectId } from "../classes/DbObjectId";
import { DbObject } from "../interfaces/DbObject";
import { Query } from "../interfaces/Query";
import { QueryBuilder } from "../interfaces/QueryBuilder";
import { Repository } from "../interfaces/Repository";
import { ModuleFactory } from "../interfaces/ModuleFactory";

let factory: ModuleFactory;

export const use = (factoryImpl: ModuleFactory) => {
    factory = factoryImpl;
};
export const repo = <T extends DbObject>(opts: any): Repository<T> => {
    if (!factory) {
        throw new Error("no implementation found");
    }
    return factory.createRepository(opts);
};
export const query = (opts?: any): QueryBuilder => {
    if (!factory) {
        throw new Error("no implementation found");
    }
    return factory.createQueryBuilder(opts);
};

export { DbObjectId, Repository, Query, DbObject, QueryBuilder };