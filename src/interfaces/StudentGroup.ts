import * as db from "../others/db";

export interface StudentGroup extends db.DbObject {
    name: string;
    semesters: number;
    studentRep: db.DbObjectId;
}