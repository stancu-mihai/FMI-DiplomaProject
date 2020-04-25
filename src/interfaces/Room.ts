import * as db from "../others/db";

export interface Room extends db.DbObject {
    name: string;
    location: string;
    capacity: number;    
    projector: boolean;
    blackboard: boolean; 
    smartboard: boolean; 
    computers: boolean;
}