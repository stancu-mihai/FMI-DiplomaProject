import { Needs } from "./Needs";
import * as db from "../others/db";

export interface Subject extends db.DbObjectId {
    name: string;
    needs: Needs;
}