import { RoomConfig } from "./RoomConfig";
import * as db from "../others/db";

export interface Subject extends db.DbObject {
    name: string;
    roomconfig: RoomConfig;
}