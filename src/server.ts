import { ExpressConfig } from "./config/express";
import { UserController } from "./controllers/user";
import { RoomController } from "./controllers/room";
import { SubjectController } from "./controllers/subject";
import { ProfSubjRelController } from "./controllers/profSubjRel";
import { StudentGroupController } from "./controllers/studentGroup";
import { StudSubjRelController } from "./controllers/studSubjRel";
import { BookingController } from "./controllers/booking";
import { User } from "./interfaces/User";
import { Room } from "./interfaces/Room";
import { Subject } from "./interfaces/Subject";
import { ProfSubjRel } from "./interfaces/ProfSubjRel";
import { StudentGroup } from "./interfaces/StudentGroup";
import { StudSubjRel } from "./interfaces/StudSubjRel";
import { Booking } from "./interfaces/Booking";
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
const profSubjRelRepo = db.repo<ProfSubjRel>({ table: "ProfSubjRel" });
const studentGroupRepo = db.repo<StudentGroup>({ table: "StudentGroup" });
const studSubjRelRepo = db.repo<StudSubjRel>({ table: "StudSubjRel" });
const bookingRepo = db.repo<Booking>({ table: "Booking" });
// Config Passport
const passportConfig = new PassportConfig(userRepo);
// Create controllers
new UserController(userRepo, app, passportConfig);
new RoomController(roomRepo, app, passportConfig);
new SubjectController(subjectRepo, app, passportConfig);
new ProfSubjRelController(profSubjRelRepo, app, passportConfig);
new StudentGroupController(studentGroupRepo, app, passportConfig);
new StudSubjRelController(studSubjRelRepo, app, passportConfig);
new BookingController(bookingRepo, app, passportConfig);
