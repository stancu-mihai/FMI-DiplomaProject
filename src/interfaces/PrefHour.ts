import * as db from "../others/db";

export interface PrefHour extends db.DbObject {
    professorId: db.DbObjectId;
    weekDay: number;
    startHour: number;
    endHour: number;
}