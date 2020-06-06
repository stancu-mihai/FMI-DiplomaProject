import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Booking } from "../interfaces/Booking";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";
import { User } from "../interfaces/User";
import { Series } from "../interfaces/Series";
import { StudentGroup } from "../interfaces/StudentGroup";
import { Room } from "../interfaces/Room";
import { Subject } from "../interfaces/Subject";
import { PrefHour } from "../interfaces/PrefHour";
import { Course } from "../interfaces/Course";
import { Seminar } from "../interfaces/Seminar";

interface ExtendedCourse extends Course {
  grade?: number;
}

interface ExtendedSeminar extends Seminar {
  grade?: number;
}

export class BookingController extends RESTController<Booking> {
  courseBookings: boolean[] = [];
  seminarBookings: boolean[] = [];
  users: User[] = [];
  series: Series[] = [];
  studentGroups: StudentGroup[] = [];
  rooms: Room[] = [];
  subjects: Subject[] = [];
  prefHours: PrefHour[] = [];
  courses: ExtendedCourse[] = [];
  seminars: ExtendedSeminar[] = [];
  bookings: Booking[] = [];
  log: string[] = [];
  constructor(repo: db.Repository<Booking>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["subjectId", "professorId", "studentGroupId"], ["studentGroupId", "subjectId", "professorId", "roomId"]);
    app.get("/bookings", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/booking", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/booking", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/booking", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/booking", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
    app.get("/generate", passportConfig.isAuthenticated, this.getGenerate.bind(this));
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/bookings", {
      title: "Bookings"
    });
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

    const courseRepo = db.repo<Course>({ table: "Course" });
    const courseRes = await courseRepo.list(db.query().all());
    courseRes.forEach((course: Course) => { 
      const extCourse: ExtendedCourse = course;
      extCourse.grade = +this.users.find(user => user._id.value == course.professorId.value).grade;
      this.courses.push(extCourse); 
    });
    // Sorts courses by grade, descending
    this.courses.sort((a,b) => {return b.grade - a.grade;});

    const seminarRepo = db.repo<Seminar>({ table: "Seminar" });
    const seminarRes = await seminarRepo.list(db.query().all());
    seminarRes.forEach((seminar: Seminar) => { 
      const extCourse: ExtendedSeminar = seminar;
      extCourse.grade = +this.users.find(user => user._id.value == seminar.professorId.value).grade;
      this.seminars.push(extCourse); 
    });
    // Sorts seminars by grade, descending
    this.seminars.sort((a,b) => {return b.grade - a.grade;});
  }

  async removeAllBookings() {
    await this.repo.remove(db.query().all());
  }

  tryToBook(index: number, isCourse: boolean): boolean {
    const courseToBook = this.courses[index];
    const seminarToBook = this.seminars[index];
    const item = isCourse ? courseToBook : seminarToBook;
    const res = false;

    // A good reflex would be to capture the availability before this loop
    // But how to store the availability for a list of rooms?

    // For Monday to Friday
    for (let day = 0; day < 5; day++) {
      // For each hour
      for (let hour = 8; hour < 18; hour++) {
        this.log.push("   Trying to book " + 
        JSON.stringify(this.subjects.find(subj => subj._id.value === item.subjectId.value).name)
        + " prof " + 
        JSON.stringify(this.users.find(user => user._id.value === item.professorId.value).email)
        + " grade " + item.grade
        + " for day " + day + " and hour " + hour);
        let exit = false;
        // First we check if this day and this hour is within the preferences of the professor assigned to this item
        const reqProfessorId = item.professorId;
        const profAgreesInterval = this.prefHours.find(prefHour =>
          prefHour.professorId.value === reqProfessorId.value && // prof matches id
          // Next we check if the desired interval is within the preferred ones
          +day === +prefHour.weekDay && // same day of the week
          +hour >= +prefHour.startHour && // our start hour is >= pref start Hour
          +hour <= +prefHour.endHour &&   // our start hour is <= pref end Hour
          +hour +  +item.weeklyHours >= +prefHour.startHour && // our end hour is >= pref start Hour
          +hour +  +item.weeklyHours <= +prefHour.endHour);    // our end hour is <= pref end Hour
        if (!profAgreesInterval)
        {
          this.log.push("X  Professor does not favor this interval");
          continue;
        }
        else 
          this.log.push("   Professor favors this interval");

        // Secondly we check if the professor is already booked
        const profIsBooked = this.bookings.find(booking =>
          booking.professorId.value == reqProfessorId.value && // prof matches id
          +item.semester === +booking.semester && // same semester
          +day === +booking.weekDay && // same day of the week
          // Count overlapping hours. If overlap, booking already exists.
          Math.min(+hour + +item.weeklyHours - +booking.startHour, +booking.startHour + +booking.duration - +hour) >0 );
        if (profIsBooked)
        {
          this.log.push("X  Professor is already booked");
          continue;
        }
        else
          this.log.push("   Professor is not booked");

        // Find the list with the groups that we are trying to book for this item
        let groupsToBook: StudentGroup[] = [];
        if (isCourse)
          groupsToBook = this.studentGroups.filter(studentGroup => studentGroup.seriesId.value == courseToBook.seriesId.value);
        else
          groupsToBook.push(this.studentGroups.find(studentGroup => studentGroup._id.value == seminarToBook.studentGroupId.value));

        let atLeastOneGroupBooked = false;
        // Thirdly we check if the student group(s) is (are) already booked
        for (const groupToBook of groupsToBook)
        {
          const groupIsBooked = this.bookings.find(booking =>
            booking.studentGroupId.value == groupToBook._id.value && // group matches id
            +item.semester === +booking.semester && // same semester
            +day === +booking.weekDay && // same day of the week
            // Count overlapping hours. If overlap, booking already exists.
            Math.min(+hour + +item.weeklyHours - +booking.startHour, +booking.startHour + +booking.duration - +hour) >0 );
          if (groupIsBooked)
          {
            this.log.push("X  Group " + groupToBook.name + " is already booked");
            atLeastOneGroupBooked = true;
            break;
          }
          else
            this.log.push("   Group " + groupToBook.name + " is not booked");
        }
        if(atLeastOneGroupBooked)
          continue;

        // Find the required capacity for the room (size of group for semester or size of series for course)
        let reqCapacity = 0;
        for (const groupToBook of groupsToBook)
          reqCapacity += +groupToBook.count;

        // Now we get the list of suitable rooms
        const suitableRooms = this.rooms.filter(room =>
          // Return all rooms with at least the required features
          item.blackboard <= room.blackboard &&
          item.smartboard <= room.smartboard &&
          item.projector <= room.projector &&
          item.computers <= room.computers &&
          reqCapacity <= +room.capacity);
        
        if (suitableRooms.length == 0)
          this.log.push("X  No suitable rooms!");

        // Next we find check each room if is already booked
        for (const suitableRoom of suitableRooms) {
          const roomIsBooked = this.bookings.find(booking =>
            booking.roomId.value === suitableRoom._id.value && // group matches id
            +item.semester == +booking.semester && // same semester
            +day === +booking.weekDay && // same day of the week
            // Count overlapping hours. If overlap, booking already exists.
            Math.min(+hour + +item.weeklyHours - +booking.startHour, +booking.startHour + +booking.duration - +hour) >0 );

          if (!roomIsBooked) { // found available suitable room
            this.log.push("   Room " + suitableRoom.name + " suitable and available");
            // book it for each group, return true
            for (const groupToBook of groupsToBook) {
              const booking: Booking = {
                professorId: new db.DbObjectId(item.professorId.value),
                studentGroupId: new db.DbObjectId(groupToBook._id.value),
                roomId: new db.DbObjectId(suitableRoom._id.value),
                duration: item.weeklyHours,
                subjectId: new db.DbObjectId(item.subjectId.value),
                startHour: JSON.stringify(hour),
                weekDay: JSON.stringify(day),
                semester: item.semester
              };
              this.bookings.push(booking);
              this.log.push("Booked for day " + day + " and hour " + hour + " and group " + groupToBook.name);
            }
            exit = true;
          }
          else
          {
            this.log.push("X  Room " + suitableRoom.name + " suitable but unavailable");
          }
          if (exit)
            break; // exit suitableRoom foreach
        }
        if (exit) {
          // Mark this index booked
          if(isCourse)
            this.courseBookings[index] = true;
          else
            this.seminarBookings[index] = true;
          return true;
        }
      }
    }
    return res;
  }

  generate(): boolean {
    let result = true;
    for (let i = 0; i < this.courseBookings.length; i++) {
      // Find index of first unbooked course
      const index = this.courseBookings.findIndex(elem => elem === false);
      if (index != -1) 
        result = result && this.tryToBook(index, true);
    }
    for (let i = 0; i < this.seminarBookings.length; i++) {
      // Find index of first unbooked seminar
      const index = this.seminarBookings.findIndex(elem => elem === false);
      if (index != -1) {
        result = result && this.tryToBook(index, false);
      }
      else {// If all seminars are booked, solution is found
        return true;
      }
    }
    return result;
  }

  async getGenerate(req: Request, res: Response) {
    // Load relevant dbs to memory
    await this.loadDbsInMemory();
    // Remove all existing bookings
    await this.removeAllBookings();
    // Array to mark all courses as unbooked
    if(this.courseBookings.length == 0)
    this.courses.forEach(() => this.courseBookings.push(false));
    // Array to mark all seminars as unbooked
    if(this.seminarBookings.length == 0)
      this.seminars.forEach(() => this.seminarBookings.push(false));
    // Generate the bookings for the timetable
    const result = this.generate();
    // Bookings are only in memory, must be written to db
    this.bookings.forEach(async booking => {
      await this.repo.add(this.jsonToObject(booking));
    });
    res.render("controllers/generate", {
      title: "Generate",
      result: result,
      log: this.log
    });
  }
}

