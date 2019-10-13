import * as db from "../others/db";

export interface StudentRep extends db.DbObject {
    email: string;
}