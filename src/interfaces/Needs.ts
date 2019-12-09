import * as db from "../others/db";

export interface Needs extends db.DbObject {
    amphitheater: boolean;
    blackboard: boolean; 
    computers: boolean;
    laboratory: boolean;
    projector: boolean;
}