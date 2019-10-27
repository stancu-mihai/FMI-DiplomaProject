import { User } from "./User";
import { Subject } from "./Subject";
import { TimeFrame } from "./TimeFrame";

export interface Professor extends User {
    worksWeekends: boolean;
    canTeach: Subject[];
    booked: TimeFrame[];
}