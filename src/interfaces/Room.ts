import * as db from "../others/db";
import { Needs } from "./Needs";
import { TimeFrame } from "./TimeFrame";

export interface Room extends db.DbObjectId {
    name: string;
    needs: Needs;
    location: string;
    capacity: number;    
    booked: TimeFrame[];
}