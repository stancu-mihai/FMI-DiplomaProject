import * as db from "../others/db";

export interface TimeFrame extends db.DbObjectId {
    start: Date;
    end: Date;
    isWithin(time: Date): boolean;
}