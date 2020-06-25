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
  bookingLog: string[] = [];
  verifyLog: string[] = [];
  constructor(repo: db.Repository<Booking>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["subjectId", "professorId", "studentGroupId"], ["studentGroupId", "subjectId", "professorId", "roomId"]);
    app.get("/bookings", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/booking", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/booking", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/booking", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/booking", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
    app.get("/generate", passportConfig.isAuthenticated, this.getGenerate.bind(this));
    app.get("/verify", passportConfig.isAuthenticated, this.getVerify.bind(this));
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/bookings", {
      title: "Bookings"
    });
  }
  
  // Load whole contents from all repos into class members
  async loadDbsInMemory(forVerification: boolean) {
    this.users = [];
    this.studentGroups = [];
    this.rooms = [];
    this.subjects = [];
    this.bookings = [];
    this.series = [];
    this.prefHours = [];
    this.courses = [];
    this.seminars = [];

    // Load whole contents from all repos into class members
    const userRepo = db.repo<User>({ table: "User" });
    const usersRes = await userRepo.list(db.query().all());
    usersRes.forEach((user: User) => { this.users.push(user); });

    const studentGroupRepo = db.repo<StudentGroup>({ table: "StudentGroup" });
    const studentGroupsRes = await studentGroupRepo.list(db.query().all());
    studentGroupsRes.forEach((group: StudentGroup) => { this.studentGroups.push(group); });

    const roomRepo = db.repo<Room>({ table: "Room" });
    const roomsRes = await roomRepo.list(db.query().all());
    roomsRes.forEach((room: Room) => { this.rooms.push(room); });

    const subjectRepo = db.repo<Subject>({ table: "Subject" });
    const subjectsRes = await subjectRepo.list(db.query().all());
    subjectsRes.forEach((subject: Subject) => { this.subjects.push(subject); });

    if (forVerification) {
      const bookingRepo = db.repo<Booking>({ table: "Booking" });
      const bookingRes = await bookingRepo.list(db.query().all());
      bookingRes.forEach((booking: Booking) => { this.bookings.push(booking); });
    }
    else {
      const seriesRepo = db.repo<Series>({ table: "Series" });
      const seriesRes = await seriesRepo.list(db.query().all());
      seriesRes.forEach((serie: Series) => { this.series.push(serie); });

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
  }

  async removeAllBookings() {
    await this.repo.remove(db.query().all());
  }

  markBookingStatus(index: number, isCourse: boolean, status: boolean) {
    if(isCourse)
      this.courseBookings[index] = status;
    else
      this.seminarBookings[index] = status;
  }

  book(semester: number, day: number, hour: number, duration: number, groupsToBook: StudentGroup[], 
    subjectId: string, professorId: string, roomId: string, index: number, isCourse: boolean) {
    // book it for each group, return true
    for (const groupToBook of groupsToBook) {
      const booking: Booking = {
        professorId: new db.DbObjectId(professorId),
        studentGroupId: new db.DbObjectId(groupToBook._id.value),
        roomId: new db.DbObjectId(roomId),
        subjectId: new db.DbObjectId(subjectId),
        duration: +duration,
        startHour: JSON.stringify(hour),
        weekDay: JSON.stringify(day),
        semester: +semester
      };
      this.bookings.push(booking);
      this.bookingLog.push("Rezervat pentru ziua " + day + " / ora " + hour + ":00 / " + groupToBook.name);
      // Mark it as booked
      this.markBookingStatus(index, isCourse, true);
    }
  }

  deleteBook(semester: number, day: number, hour: number, duration: number, groupsToBook: StudentGroup[], 
    subjectId: string, professorId: string, roomId: string, index: number, isCourse: boolean) {
    // book it for each group, return true
    for (const groupToBook of groupsToBook) {
      this.bookings = this.bookings.filter(booking =>
        booking.professorId.value == professorId &&
        booking.studentGroupId.value == groupToBook._id.value &&
        booking.roomId.value == roomId &&
        booking.duration == +duration &&
        booking.subjectId.value == subjectId &&
        booking.startHour == JSON.stringify(hour) &&
        booking.weekDay == JSON.stringify(day) &&
        booking.semester == +semester);

      this.bookingLog.push("Rezervare ȘTEARSĂ pentru semestrul " + semester + "ziua " + day + " / ora " + hour + ":00 / " + groupToBook.name);
      // Mark it as un-booked
      this.markBookingStatus(index, isCourse, false);
    }
  }

  canWeBook(semester: number, day: number, hour: number, duration: number, groupsToBook: StudentGroup[], 
    professorId: string, room: Room,  
    blackboard: boolean, smartboard: boolean, projector: boolean, computers: boolean, capacity: number): boolean {
      let logEntry = "Semestru " + semester + " ziua " + day + "  ora " + (hour>9 ? hour: "0" + hour) + ":00 ";
      // First we check if this day and this hour is within the preferences of the professor assigned to this item
      const profAgreesInterval = this.prefHours.find(prefHour =>
        prefHour.professorId.value === professorId && // prof matches id
        // Next we check if the desired interval is within the preferred ones
        +day === +prefHour.weekDay && // same day of the week
        +hour >= +prefHour.startHour && // our start hour is >= pref start Hour
        +hour <= +prefHour.endHour &&   // our start hour is <= pref end Hour
        +hour + +duration >= +prefHour.startHour && // our end hour is >= pref start Hour
        +hour + +duration <= +prefHour.endHour);    // our end hour is <= pref end Hour
      if (!profAgreesInterval) {
        logEntry+=(" X");
        this.bookingLog.push(logEntry);
        return false;
      }
      else 
        logEntry+=(" V");

      // Secondly we check if the professor is already booked
      const profIsBooked = this.bookings.find(booking =>
        booking.professorId.value == professorId && // prof matches id
        +semester === +booking.semester && // same semester
        +day === +booking.weekDay && // same day of the week
        // Count overlapping hours. If overlap, booking already exists.
        Math.min(+hour + +duration - +booking.startHour, +booking.startHour + +booking.duration - +hour) >0 );
      if (profIsBooked) {
        logEntry+=(" X");
        this.bookingLog.push(logEntry);
        return false;
      }
      else
        logEntry+=(" V");

      let atLeastOneGroupBooked = false;
      // Thirdly we check if the student group(s) is (are) already booked
      for (const groupToBook of groupsToBook) {
        const groupIsBooked = this.bookings.find(booking =>
          booking.studentGroupId.value == groupToBook._id.value && // group matches id
          +semester === +booking.semester && // same semester
          +day === +booking.weekDay && // same day of the week
          // Count overlapping hours. If overlap, booking already exists.
          Math.min(+hour + +duration - +booking.startHour, +booking.startHour + +booking.duration - +hour) >0 );
        if (groupIsBooked) {
          logEntry+=(" X");
          atLeastOneGroupBooked = true;
          this.bookingLog.push(logEntry);
          return false;
        }
      }
      if (!atLeastOneGroupBooked)
        logEntry+=(" V");

      // Next we check if the room has required features or more
      if (blackboard <= room.blackboard &&
        smartboard <= room.smartboard &&
        projector <= room.projector &&
        computers <= room.computers &&
        capacity <= +room.capacity) {
          logEntry+=(" V");
        }
      else {
        logEntry+=(" X");
        this.bookingLog.push(logEntry);
        return false;
      }

      // Next we check if the room is already booked
      const roomIsBooked = this.bookings.find(booking =>
        booking.roomId.value === room._id.value && // group matches id
        +semester == +booking.semester && // same semester
        +day === +booking.weekDay && // same day of the week
        // Count overlapping hours. If overlap, booking already exists.
        Math.min(+hour + +duration - +booking.startHour, +booking.startHour + +booking.duration - +hour) >0 );

      if (!roomIsBooked) { 
        logEntry+=(" V");
      }
      else{
        logEntry+=(" X");
        this.bookingLog.push(logEntry);
        return false;
      }

      this.bookingLog.push(logEntry);
      return true;
  }

  solve(isCourse: boolean): boolean {
    let index = -1;
    
    // If a seminar or course is not booked and get its index
    if (isCourse) {
      for (let i = 0; i < this.courseBookings.length; i++) {
        if (!this.courseBookings[i]) {
          index = i;
          break;
        }
      }
    }
    else {
      for (let i = 0; i < this.seminarBookings.length; i++) {
        if (!this.seminarBookings[i]) {
          index = i;
          break;
        }
      }
    }

    if(index == -1) {
      this.bookingLog.push("Toate intrările sunt rezervate deja!");
      return true;
    }

    const courseToBook = this.courses[index];
    const seminarToBook = this.seminars[index];
    const item = isCourse ? courseToBook : seminarToBook;

    // Find the list with the groups that we are trying to book for this item
    let groupsToBook: StudentGroup[] = [];
    if (isCourse)
      groupsToBook = this.studentGroups.filter(studentGroup => studentGroup.seriesId.value == courseToBook.seriesId.value);
    else
      groupsToBook.push(this.studentGroups.find(studentGroup => studentGroup._id.value == seminarToBook.studentGroupId.value));

    // Find the required capacity for the room (size of group for semester or size of series for course)
    let capacity = 0;
    for (const groupToBook of groupsToBook)
      capacity += +groupToBook.count;

    // We have all booking data except day, hour and room... so we try all combinations of them
    // For each room
    for (const room of this.rooms) {

      this.bookingLog.push("   Încercare rezervare: " + 
      this.subjects.find(subj => subj._id.value === item.subjectId.value).name
      + " / " + 
      this.users.find(user => user._id.value === item.professorId.value).email
      + " / Grad " + item.grade
      + " / Sala: " + this.rooms.find(searchRoom => searchRoom._id.value === room._id.value).name);

      // For Monday to Friday
      for (let day = 0; day < 5; day++) {
        // For each hour
        for (let hour = 8; hour < 18; hour++) {
          // If we can book
          if(this.canWeBook(item.semester, day, hour, item.weeklyHours, groupsToBook, item.professorId.value, room, 
            item.blackboard, item.smartboard, item.projector, item.computers, capacity)) {
            // Then we book
            this.book(item.semester, day, hour, item.weeklyHours, groupsToBook, item.subjectId.value, item.professorId.value, room._id.value, index, isCourse);
            if(this.solve(isCourse)) { //backtrack
              return true;
            }
            else {
              // Delete booking
              this.deleteBook(item.semester, day, hour, item.weeklyHours, groupsToBook, item.subjectId.value, item.professorId.value, room._id.value, index, isCourse);
            }
          }
        }
      }
    }
    return false; 
  }

  async getGenerate(req: Request, res: Response) {
    // Load relevant dbs to memory
    await this.loadDbsInMemory(false);
    // Remove all existing bookings
    await this.removeAllBookings();
    // Array to mark all courses as unbooked
    this.courseBookings = [];
    this.courses.forEach(() => this.courseBookings.push(false));
    // Array to mark all seminars as unbooked
    this.seminarBookings = [];
    this.seminars.forEach(() => this.seminarBookings.push(false));
    // Generate the bookings for the timetable
    const result1 = this.solve(true);
    const result2 = this.solve(false);
    // Bookings are only in memory, must be written to db
    this.bookings.forEach(async booking => {
      await this.repo.add(booking);
    });
    res.render("controllers/generate", {
      title: "Generate",
      result: result1 && result2,
      log: this.bookingLog
    });
  }

  async getVerify(req: Request, res: Response) {
    await this.loadDbsInMemory(true);

    let result = true;

    for (const booking of this.bookings) {
       // Does this booking's professor conflict with other booking?
       const professorConflict = this.bookings.filter(otherBooking =>
        booking.professorId.value == otherBooking.professorId.value && // prof matches id
        +booking.semester === +otherBooking.semester && // same semester
        +booking.weekDay === +otherBooking.weekDay && // same day of the week
        (booking.roomId.value !== otherBooking.roomId.value ||        // is only conflict if rooms or subjects are different 
         booking.subjectId.value !== otherBooking.subjectId.value) && //(same professor can use same room for multiple groups, for courses)
        // Count overlapping hours. 
        Math.min(+otherBooking.startHour + +otherBooking.duration - +booking.startHour, +booking.startHour + +booking.duration - +otherBooking.startHour) >0 );
        if (professorConflict.length > 0 ) {
          result = false;
          this.verifyLog.push("Profesori cu rezervări suprapuse:");
          professorConflict.forEach( conflict => {
            const profEmail = this.users.find(user => user._id.value === conflict.professorId.value).email;
            const subjName = this.subjects.find(subj => subj._id.value === conflict.subjectId.value).name;
            const roomName = this.rooms.find(room => room._id.value === conflict.roomId.value).name;
            const groupName = this.studentGroups.find(group => group._id.value ===  conflict.studentGroupId.value).name;
            this.verifyLog.push(profEmail + " / " + subjName + " / " + roomName + " / " + groupName + " / sem " + conflict.semester + 
            " / ziua " + conflict.weekDay + " / " + conflict.startHour + ":00 - " + (+conflict.startHour + +conflict.duration + ":00"));
          });
        }

      // Does this booking's group conflict with other booking?
       const groupConflict = this.bookings.filter(otherBooking =>
        booking.studentGroupId.value == otherBooking.studentGroupId.value && // group matches id
        +booking.semester === +otherBooking.semester && // same semester
        +booking.weekDay === +otherBooking.weekDay && // same day of the week
        (booking.roomId.value != otherBooking.roomId.value ||        // is only conflict if rooms or subjects or professors are different 
          booking.subjectId.value != otherBooking.subjectId.value ||
          booking.professorId.value != otherBooking.professorId.value) && 
        // Count overlapping hours. 
        Math.min(+otherBooking.startHour + +otherBooking.duration - +booking.startHour, +booking.startHour + +booking.duration - +otherBooking.startHour) >0 );
        if (groupConflict.length > 0 ) {
          result = false;
          this.verifyLog.push("Grupe cu rezervări suprapuse:");
          groupConflict.forEach( conflict => {
            const profEmail = this.users.find(user => user._id.value === conflict.professorId.value).email;
            const subjName = this.subjects.find(subj => subj._id.value === conflict.subjectId.value).name;
            const roomName = this.rooms.find(room => room._id.value === conflict.roomId.value).name;
            const groupName = this.studentGroups.find(group => group._id.value ===  conflict.studentGroupId.value).name;
            this.verifyLog.push(profEmail + " / " + subjName + " / " + roomName + " / " + groupName + " / sem " + conflict.semester + 
            " / ziua " + conflict.weekDay + " / " + conflict.startHour + ":00 - " + (+conflict.startHour + +conflict.duration + ":00"));
          });
        }

      // Does this booking's room conflict with other booking?
      const roomConflict = this.bookings.filter(otherBooking =>
        booking.roomId.value == otherBooking.roomId.value && // room matches id
        +booking.semester === +otherBooking.semester && // same semester
        +booking.weekDay === +otherBooking.weekDay && // same day of the week
        (booking.professorId.value !== otherBooking.professorId.value ||  // is only conflict if professors or subjects are different 
         booking.subjectId.value !== otherBooking.subjectId.value) &&     //(same professor can use same room for multiple groups, for courses)
        // Count overlapping hours. 
        Math.min(+otherBooking.startHour + +otherBooking.duration - +booking.startHour, +booking.startHour + +booking.duration - +otherBooking.startHour) >0 );
        if (roomConflict.length > 0 ) {
          result = false;
          this.verifyLog.push("Săli cu rezervări suprapuse:");
          roomConflict.forEach( conflict => {
            const profEmail = this.users.find(user => user._id.value === conflict.professorId.value).email;
            const subjName = this.subjects.find(subj => subj._id.value === conflict.subjectId.value).name;
            const roomName = this.rooms.find(room => room._id.value === conflict.roomId.value).name;
            const groupName = this.studentGroups.find(group => group._id.value ===  conflict.studentGroupId.value).name;
            this.verifyLog.push(profEmail + " / " + subjName + " / " + roomName + " / " + groupName + " / sem " + conflict.semester + 
            " / ziua " + conflict.weekDay + " / " + conflict.startHour + ":00 - " + (+conflict.startHour + +conflict.duration + ":00"));
          });
        }
    }

    res.render("controllers/verify", {
      title: "Verify",
      result: result,
      log: this.verifyLog
    });
  }
}

