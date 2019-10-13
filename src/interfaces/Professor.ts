import * as db from "../others/db";

export interface Professor extends db.DbObject {
    email: string;
}