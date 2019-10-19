import * as db from "../others/db";

export interface Needs extends db.DbObjectId {
    amphitheater: boolean;
    blackboard: boolean; 
    computers: boolean;
    laboratory: boolean;
    projector: boolean;
}