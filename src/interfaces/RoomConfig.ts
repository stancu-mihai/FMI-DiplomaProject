import * as db from "../others/db";

export interface RoomConfig extends db.DbObject {
    amphitheater: boolean;
    blackboard: boolean; 
    computers: boolean;
    laboratory: boolean;
    projector: boolean;
}