import * as db from "../others/db";

export interface Room extends db.DbObject {
    name: string;
    location: string;
    capacity: number;    
    projector: boolean;
    blackboard: boolean; 
    smartboard: boolean; 
    videoSurveillance: boolean;
    physicsLab: boolean;
    chemistryLab: boolean;
    CSLab: boolean;
    biologyLab: boolean;
    basketball: boolean;
    football: boolean;
}