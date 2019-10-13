import * as db from "../others/db";

export interface Secretary extends db.DbObject {
    email: string;
}