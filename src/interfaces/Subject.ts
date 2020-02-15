import * as db from "../others/db";

export interface Subject extends db.DbObject {
    name: string;
    credits: number;
    timeDuration: number;
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