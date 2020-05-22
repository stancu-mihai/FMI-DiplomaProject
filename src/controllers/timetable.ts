import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Booking } from "../interfaces/Booking";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";
import { User } from "../interfaces/User";
import { Room } from "../interfaces/Room";
import { Subject } from "../interfaces/Subject";
import { StudentGroup } from "../interfaces/StudentGroup";
import { Series } from "../interfaces/Series";
import { PrefHour } from "../interfaces/PrefHour";
import { StudSubjRel } from "../interfaces/StudSubjRel";

interface Block {
  duration: number;
  subject: string;
  professor: string;
  room: string;
}
interface WeekDay {
  [key: number]: Block;
}
interface StartHour {
  [key: number]: WeekDay;
}
interface Semester {
  [key: number]: StartHour;
}
interface Group {
  [key: string]: Semester;
}

export class TimetableController extends RESTController<Booking> {
  constructor(repo: db.Repository<Booking>, app: Application, passportConfig: PassportConfig) {
    super(repo, [], []);
    app.get("/timetable", passportConfig.isAuthenticated, this.getTimetable.bind(this));
  }


  async getTimetable(req: Request, res: Response) {
    const bookings: Booking[] = await this.repo.list(db.query().all());

    // Load whole contents from all other repos
    const userRepo = db.repo<User>({ table: "User" });
    const users = await userRepo.list(db.query().all());
    const roomRepo = db.repo<Room>({ table: "Room" });
    const rooms = await roomRepo.list(db.query().all());
    const subjectRepo = db.repo<Subject>({ table: "Subject" });
    const subjects = await subjectRepo.list(db.query().all());
    const studentGroupRepo = db.repo<StudentGroup>({ table: "StudentGroup" });
    const studentGroupRels = await studentGroupRepo.list(db.query().all());

    // For each student group
    const groupDict: Group = {};
    studentGroupRels.forEach((studentGroup: StudentGroup) => {
      const groupName = studentGroup.name;
      // For each semester save to dict
      const semesterDict: Semester = {};
      for (let semester = 1; semester < 3; semester++) {
        // For each starting hour save to dict
        const startHourDict: StartHour = {};
        for (let startHour = 8; startHour < 21; startHour++) {
          // For each day of the week save to dict
          const weekDayDict: WeekDay = {};
          for (let weekDay = 0; weekDay < 7; weekDay++) {
            // Get bookings for group, semester, startHour, weekDay
            const tempBooking = bookings.find(item =>
              item.studentGroupId.value === studentGroup._id.value &&
              +item.semester === semester &&
              +item.startHour === startHour &&
              +item.weekDay === weekDay);
            if (tempBooking) {
              const prof = users.find(item => item._id.value === tempBooking.professorId.value);
              weekDayDict[weekDay] = {
                duration: +tempBooking.duration,
                subject: subjects.find(item => item._id.value === tempBooking.subjectId.value).name,
                professor: prof.profile.firstName + " " + prof.profile.lastName,
                room: rooms.find(item => item._id.value === tempBooking.roomId.value).name
              };
              startHourDict[startHour] = weekDayDict;
              semesterDict[semester] = startHourDict;
              groupDict[groupName] = semesterDict;
            }
          }
        }
      }
    });

    res.render("controllers/timetable", {
      title: "Timetable",
      timetable: groupDict
    });
  }
}
