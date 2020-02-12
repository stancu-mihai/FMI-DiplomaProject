import { Room } from "./Room";
import * as db from "../others/db";

export interface Subject extends db.DbObject {
    name: string;
    room: Room;
}