import * as db from "../others/db";

export interface Booking extends db.DbObject {
    subjectId: db.DbObjectId;
    professorId: db.DbObjectId;
    studentGroupId: db.DbObjectId;
    semester: number;
    date: Date;
    startHour: number;
    endHour: number;
    isExternal: boolean;
}