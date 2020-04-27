import * as db from "../others/db";

export interface Booking extends db.DbObject {
    studentGroupId: string;
    subjectId: string;
    professorId: string;
    roomId: string;
    semester: number;
    weekDay: string;
    startHour: string;
    duration: number;
}