import { Query } from "./Query";
import { DbObjectId } from "../classes/DbObjectId";

export interface QueryBuilder {
    all(): Query;
    byId(id: string | DbObjectId): Query;
    byProperty(propName: string, propValue: string | number | boolean | Date | DbObjectId): Query;
    byProperties(dict: any): Query;
}