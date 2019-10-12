import { DbObject } from "./DBObject";
import { Repository } from "./Repository";
import { QueryBuilder } from "./QueryBuilder";

export interface ModuleFactory {
    createRepository: <T extends DbObject>(opts: any) => Repository<T>;
    createQueryBuilder: (opts: any) => QueryBuilder;
}