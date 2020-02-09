import * as db from "../others/db";
import { RoomConfig } from "./RoomConfig";
import { TimeFrame } from "./TimeFrame";

export interface Room extends db.DbObject {
    name: string;
    roomconfig: RoomConfig;
    location: string;
    capacity: number;    
    booked: TimeFrame[];
}