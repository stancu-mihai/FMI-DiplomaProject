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
  studSubjBookings: boolean[] = [];
  users: User[] = [];
  series: Series[] = [];
  studentGroups: StudentGroup[] = [];
  rooms: Room[] = [];
  subjects: Subject[] = [];
  prefHours: PrefHour[] = [];
  studSubjRels: StudSubjRel[] = [];
  bookings: Booking[] = [];

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
    usersRes.forEach((user: User) => { this.users.push(user); });

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

    const studSubjRelRepo = db.repo<StudSubjRel>({ table: "StudSubjRel" });
    const studSubjRelsRes = await studSubjRelRepo.list(db.query().all());
    studSubjRelsRes.forEach((studSubjRel: StudSubjRel) => { this.studSubjRels.push(studSubjRel); });
  }

  tryToBook(index: number): boolean {
    const item = this.studSubjRels[index];
    const res = false;

    // A good reflex would be to capture the availability before this loop
    // But how to store the availability for a list of rooms?

    // For Monday to Friday
    for (let day = 0; day < 5; day++) {
      // For each hour
      for (let hour = 8; hour < 18; hour++) {
        // First we check if this day and this hour is within the preferences of the professor assigned to this item
        const reqProfessorId = item.professorId;
        const profAgreesInterval = this.prefHours.find(prefHour => 
          prefHour.professorId.value === reqProfessorId.value && // prof matches id
          // Next we check if the desired interval is within the preferred ones
          day == prefHour.weekDay && // same day of the week
          hour >= prefHour.startHour && // our start hour is >= pref start Hour
          hour <= prefHour.endHour &&   // our start hour is <= pref end Hour
          hour+item.weeklyHours >= prefHour.startHour && // our end hour is >= pref start Hour
          hour+item.weeklyHours <= prefHour.endHour);    // our end hour is <= pref end Hour
        if(!profAgreesInterval) 
          continue;

        // Secondly we check if the professor is already booked
        const profIsNotBooked = this.bookings.find(booking => 
          booking.professorId.value == reqProfessorId.value && // prof matches id
          // Next we check if the desired interval is NOT within the booked ones
          !
          (item.semester == booking.semester &&
          day == booking.weekDay && // same day of the week
          hour >= booking.startHour && // our start hour is >= booked start Hour
          hour <= booking.startHour + booking.duration &&   // our start hour is <= booked end Hour
          hour+item.weeklyHours >= booking.startHour && // our end hour is >= booked start Hour
          hour+item.weeklyHours <= booking.startHour + booking.duration));    // our end hour is <= booked end Hour
        if(profIsNotBooked) 
          continue;

        // Thirdly we check if the student group is already booked
        const reqGroupId = item.studentGroupId;
        const groupIsNotBooked = this.bookings.find(booking => 
          booking.studentGroupId.value == reqGroupId.value && // group matches id
          // Next we check if the desired interval is NOT within the booked ones
          !
          (item.semester == booking.semester &&
          day == booking.weekDay && // same day of the week
          hour >= booking.startHour && // our start hour is >= booked start Hour
          hour <= booking.startHour + booking.duration &&   // our start hour is <= booked end Hour
          hour+item.weeklyHours >= booking.startHour && // our end hour is >= booked start Hour
          hour+item.weeklyHours <= booking.startHour + booking.duration));    // our end hour is <= booked end Hour
        if(groupIsNotBooked) 
          continue;

        // We need the size of the group
        const groupSize = this.studentGroups.find(studentGroup => studentGroup._id.value == reqGroupId.value).count;
        
        // Now we get the list of suitable rooms
        const suitableRooms = this.rooms.filter(room => 
          // Return all rooms with at least the required features
          item.blackboard <= room.blackboard &&
          item.smartboard <= room.smartboard &&
          item.projector <= room.projector &&
          item.computers <= room.computers &&
          groupSize <= room.capacity);

        // Next we find check each room if is already booked
        suitableRooms.forEach(suitableRoom => {
          const roomIsNotBooked = this.bookings.find(booking => 
            booking.roomId.value == suitableRoom._id.value && // group matches id
            // Next we check if the desired interval is NOT within the booked ones
            !
            (item.semester == booking.semester &&
            day == booking.weekDay && // same day of the week
            hour >= booking.startHour && // our start hour is >= booked start Hour
            hour <= booking.startHour + booking.duration &&   // our start hour is <= booked end Hour
            hour+item.weeklyHours >= booking.startHour && // our end hour is >= booked start Hour
            hour+item.weeklyHours <= booking.startHour + booking.duration));    // our end hour is <= booked end Hour

            if(roomIsNotBooked) { // found available suitable room
              // book it, return true
              let booking: Booking;
              booking.professorId = new db.DbObjectId(item.professorId.value);
              booking.studentGroupId = new db.DbObjectId(item.professorId.value);
              booking.roomId = new db.DbObjectId(roomIsNotBooked._id.value);
              booking.duration = item.weeklyHours;
              booking.subjectId = new db.DbObjectId(item.subjectId.value);
              booking.startHour = hour;
              booking.weekDay = day;
              booking.semester = item.semester;
            }
        });

        return res;
      }
    }
  }

  generate(): boolean {
    // Find index of first unbooked studSubjBooking
    const index = this.studSubjBookings.findIndex(elem => elem === false);
    if (index != -1) {
      this.tryToBook(index);
    }
    else {// If all StudSubjRel's are booked, solution is found
      return true;
    }
  }

  async getGenerate() {
    await this.loadDbsInMemory();
    // Array to mark all studSubjRels as unbooked
    this.studSubjRels.forEach(() => this.studSubjBookings.push(false));
    // Generate the bookings for the timetable
    this.generate();
    // Bookings are only in memory, must be written to db
    const bookingRepo = db.repo<Booking>({ table: "Booking" });
    this.bookings.forEach(async booking => {
      await bookingRepo.add(booking);
    });
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
