import * as db from "../others/db";

export interface StudentGroup extends db.DbObject {
    name: string;
    count: number;
    semesters: number;
    studentRep: db.DbObjectId;
    weekendOnly: boolean;
}