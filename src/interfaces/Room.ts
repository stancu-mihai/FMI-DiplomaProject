import * as db from "../others/db";

export interface Room extends db.DbObject {
    name: string;
    location: string;
    capacity: number;    
    projector: number;
    blackboard: number; 
    smartboard: number; 
    videoSurveillance: number;
    physicsLab: number;
    chemistryLab: number;
    CSLab: number;
    biologyLab: number;
    basketball: number;
    football: number;
}