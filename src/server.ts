import { ExpressConfig } from "./config/express";
import { UserController } from "./controllers/user";
import { RoomController } from "./controllers/room";
import { SubjectController } from "./controllers/subject";
import { StudentGroupController } from "./controllers/studentGroup";
import { CourseController } from "./controllers/course";
import { SeminarController } from "./controllers/seminar";
import { BookingController } from "./controllers/booking";
import { TimetableController } from "./controllers/timetable";
import { PrefHourController } from "./controllers/prefhour";
import { SeriesController } from "./controllers/series";
import { User } from "./interfaces/User";
import { Room } from "./interfaces/Room";
import { Subject } from "./interfaces/Subject";
import { StudentGroup } from "./interfaces/StudentGroup";
import { Course } from "./interfaces/Course";
import { Seminar } from "./interfaces/Seminar";
import { Booking } from "./interfaces/Booking";
import { PrefHour } from "./interfaces/PrefHour";
import { Series } from "./interfaces/Series";
import * as db from "./others/db";
import { PassportConfig } from "./config/passport";
import express from "express";
import * as mongoDbRepo from "./others/mongodb";

// Create app
const app = express();
// Config Express
new ExpressConfig(app);
// Choose db solution
db.use(mongoDbRepo.init());
// Create repositories
const userRepo = db.repo<User>({ table: "User" });
const roomRepo = db.repo<Room>({ table: "Room" });
const subjectRepo = db.repo<Subject>({ table: "Subject" });
const studentGroupRepo = db.repo<StudentGroup>({ table: "StudentGroup" });
const courseRepo = db.repo<Course>({ table: "Course" });
const seminarRepo = db.repo<Seminar>({ table: "Seminar" });
const bookingRepo = db.repo<Booking>({ table: "Booking" });
const prefHourRepo = db.repo<PrefHour>({ table: "PrefHour" });
const seriesRepo = db.repo<Series>({ table: "Series" });
// Config Passport
const passportConfig = new PassportConfig(userRepo);
// Create controllers
new UserController(userRepo, app, passportConfig);
new RoomController(roomRepo, app, passportConfig);
new SubjectController(subjectRepo, app, passportConfig);
new StudentGroupController(studentGroupRepo, app, passportConfig);
new CourseController(courseRepo, app, passportConfig);
new SeminarController(seminarRepo, app, passportConfig);
new BookingController(bookingRepo, app, passportConfig);
new TimetableController(bookingRepo, app, passportConfig);
new PrefHourController(prefHourRepo, app, passportConfig);
new SeriesController(seriesRepo, app, passportConfig);