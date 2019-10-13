import { DbObject } from "./DbObject";
import { Query } from "./Query";

export interface Repository<T extends DbObject> {
    add(object: T): Promise<void>;
    remove(query: Query): Promise<number>;
    list(query: Query): Promise<T[]>;
    update(object: T): Promise<number>;
}