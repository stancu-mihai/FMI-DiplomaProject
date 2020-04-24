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
import { ProfSubjRel } from "../interfaces/ProfSubjRel";
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
  userBookings: number[][];
  groupBookings: number[][];
  roomBookings: number[][];

  users: User[];
  series: Series[];
  studentGroups: StudentGroup[];
  rooms: Room[];
  subjects: Subject[];
  prefHours: PrefHour[];
  profSubjRels: ProfSubjRel[];
  studSubjRels: StudSubjRel[];
  constructor(repo: db.Repository<Booking>, app: Application, passportConfig: PassportConfig) {
    super(repo, [], []);
    app.get("/timetable", passportConfig.isAuthenticated, this.getTimetable.bind(this));
    app.get("/generate", passportConfig.isAuthenticated, this.getGenerate.bind(this));
  }

  // Load whole contents from all repos into class members
  async loadDbsInMemory() {
    // Load whole contents from all repos into class members
    const userRepo = db.repo<User>({ table: "User" });
    const usersRes = await userRepo.list(db.query().all());
    usersRes.forEach((user: User) => { this.users.push(user);  });

    const seriesRepo = db.repo<Series>({ table: "Series" });
    const seriesRes = await seriesRepo.list(db.query().all());
    seriesRes.forEach((serie: Series) => { this.series.push(serie); });

    const studentGroupRepo = db.repo<StudentGroup>({ table: "StudentGroup" });
    const studentGroupsRes = await studentGroupRepo.list(db.query().all());
    studentGroupsRes.forEach((group: StudentGroup) => { this.studentGroups.push(group); });

    const roomRepo = db.repo<Room>({ table: "Room" });
    const roomsRes = await roomRepo.list(db.query().all());
    roomsRes.forEach((room: Room) => { this.rooms.push(room); });

    const subjectRepo = db.repo<Subject>({ table: "Subject" });
    const subjectsRes = await subjectRepo.list(db.query().all());
    subjectsRes.forEach((subject: Subject) => { this.subjects.push(subject); });

    const prefHourRepo = db.repo<PrefHour>({ table: "PrefHour" });
    const prefHoursRes = await prefHourRepo.list(db.query().all());
    prefHoursRes.forEach((prefHour: PrefHour) => { this.prefHours.push(prefHour); });

    const profSubjRelRepo = db.repo<ProfSubjRel>({ table: "ProfSubjRel" });
    const profSubjRelsRes = await profSubjRelRepo.list(db.query().all());
    profSubjRelsRes.forEach((profSubjRel: ProfSubjRel) => { this.profSubjRels.push(profSubjRel); });

    const studSubjRelRepo = db.repo<StudSubjRel>({ table: "StudSubjRel" });
    const studSubjRelsRes = await studSubjRelRepo.list(db.query().all());
    studSubjRelsRes.forEach((studSubjRel: StudSubjRel) => { this.studSubjRels.push(studSubjRel); });
  }

  initEmptyMatrix() {
    // create an empty 7x24 boolean matrix containing indexes of db entries
    // this will be used for booking rooms/professors/groups
    const emptyMatrix: number[][] = [];
    for (let weekDay = 0; weekDay < 7; weekDay++) {
      const day = [];
      for (let hour = 0; hour < 24; hour++) {
        // initially nothing is booked
        day.push(-1);
      }
      emptyMatrix.push(day);
    }
    return emptyMatrix;
  }

  generate(userBookings: number[][], groupBookings: number[][], roomBookings: number[][]) {
    userBookings[0][0]=0;
    groupBookings[0][0]=0;
    roomBookings[0][0]=0;
  }

  async getGenerate() {
    await this.loadDbsInMemory();
    const emptyMatrix = this.initEmptyMatrix();
    this.generate(emptyMatrix, emptyMatrix, emptyMatrix);
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
      // Find number of semesters for the group given
      const semesters = +studentGroup.semesters;
      // For each semester save to dict
      const semesterDict: Semester = {};
      for (let semester = 1; semester < semesters + 1; semester++) {
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
