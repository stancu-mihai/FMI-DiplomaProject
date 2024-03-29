import * as db from "../others/db";

export interface StudentGroup extends db.DbObject {
    name: string;
    seriesId: db.DbObjectId;
    count: number;
}