import { User } from "./User";
import { Subject } from "./Subject";
import { TimeFrame } from "./TimeFrame";

export interface StudentRep extends User {
    group: string;
    subjects: Subject[];
    booked: TimeFrame[];
}