import * as db from "../others/db";

export interface Needs extends db.DbObjectId {
    amphitheater: boolean;
    laboratory: boolean;
    computers: boolean;
}