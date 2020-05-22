import * as db from "../others/db";

export interface Booking extends db.DbObject {
    studentGroupId: db.DbObjectId;
    subjectId: db.DbObjectId;
    professorId: db.DbObjectId;
    roomId: db.DbObjectId;
    semester: number;
    weekDay: string;
    startHour: string;
    duration: number;
}