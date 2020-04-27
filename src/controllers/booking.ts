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
import { StudSubjRel } from "../interfaces/StudSubjRel";

export class BookingController extends RESTController<Booking> {
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

    const studSubjRelRepo = db.repo<StudSubjRel>({ table: "StudSubjRel" });
    const studSubjRelsRes = await studSubjRelRepo.list(db.query().all());
    studSubjRelsRes.forEach((studSubjRel: StudSubjRel) => { this.studSubjRels.push(studSubjRel); });
  }

  async removeAllBookings() {
    await this.repo.remove(db.query().all());
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
        let exit = false;
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
          booking.professorId == reqProfessorId.value && // prof matches id
          // Next we check if the desired interval is NOT within the booked ones
          !
          (item.semester == +booking.semester &&
          day == +booking.weekDay && // same day of the week
          hour >= +booking.startHour && // our start hour is >= booked start Hour
          hour <= +booking.startHour + +booking.duration &&   // our start hour is <= booked end Hour
          hour+item.weeklyHours >= +booking.startHour && // our end hour is >= booked start Hour
          hour+item.weeklyHours <= +booking.startHour + +booking.duration));    // our end hour is <= booked end Hour
        if(profIsNotBooked) 
          continue;

        // Thirdly we check if the student group is already booked
        const reqGroupId = item.studentGroupId;
        const groupIsNotBooked = this.bookings.find(booking => 
          booking.studentGroupId == reqGroupId.value && // group matches id
          // Next we check if the desired interval is NOT within the booked ones
          !
          (item.semester == +booking.semester &&
          day == +booking.weekDay && // same day of the week
          hour >= +booking.startHour && // our start hour is >= booked start Hour
          hour <= +booking.startHour + +booking.duration &&   // our start hour is <= booked end Hour
          hour+item.weeklyHours >= +booking.startHour && // our end hour is >= booked start Hour
          hour+item.weeklyHours <= +booking.startHour + +booking.duration));    // our end hour is <= booked end Hour
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
        for (const suitableRoom of suitableRooms) {
          const roomIsNotBooked = this.bookings.find(booking => 
            booking.roomId == suitableRoom._id.value && // group matches id
            // Next we check if the desired interval is NOT within the booked ones
            !
            (item.semester == +booking.semester &&
            day == +booking.weekDay && // same day of the week
            hour >= +booking.startHour && // our start hour is >= booked start Hour
            hour <= +booking.startHour + +booking.duration &&   // our start hour is <= booked end Hour
            hour+item.weeklyHours >= +booking.startHour && // our end hour is >= booked start Hour
            hour+item.weeklyHours <= +booking.startHour + +booking.duration));    // our end hour is <= booked end Hour

            if(!roomIsNotBooked) { // found available suitable room
              // book it, return true
              const booking: Booking = {
                professorId: item.professorId.value,
                studentGroupId: item.studentGroupId.value,
                roomId: suitableRoom._id.value,
                duration: item.weeklyHours,
                subjectId: item.subjectId.value,
                startHour: JSON.stringify(hour),
                weekDay: JSON.stringify(day),
                semester: item.semester
              };
              this.bookings.push(booking);

              exit = true;
            }
            if(exit)
              break; // exit suitableRoom foreach
          }
          if(exit)
            return true;

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
    // Load relevant dbs to memory
    await this.loadDbsInMemory();
    // Remove all existing bookings
    await this.removeAllBookings();
    // Array to mark all studSubjRels as unbooked
    this.studSubjRels.forEach(() => this.studSubjBookings.push(false));
    // Generate the bookings for the timetable
    this.generate();
    // Bookings are only in memory, must be written to db
    this.bookings.forEach(async booking => {
      await this.repo.add(this.jsonToObject(booking));
    });
  }
}

