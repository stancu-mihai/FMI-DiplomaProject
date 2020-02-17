import { ExpressConfig } from "./config/express";
import { UserController } from "./controllers/user";
import { RoomController } from "./controllers/room";
import { SubjectController } from "./controllers/subject";
import { ProfSubjRelController } from "./controllers/profSubjRel";
import { StudentGroupController } from "./controllers/StudentGroup";
import { User } from "./interfaces/User";
import { Room } from "./interfaces/Room";
import { Subject } from "./interfaces/Subject";
import { ProfSubjRel } from "./interfaces/ProfSubjRel";
import { StudentGroup } from "./interfaces/StudentGroup";
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
// Config Passport
const passportConfig = new PassportConfig(userRepo);
// Create controllers
new UserController(userRepo, app, passportConfig);
new RoomController(roomRepo, app, passportConfig);
new SubjectController(subjectRepo, app, passportConfig);
new ProfSubjRelController(profSubjRelRepo, app, passportConfig);
new StudentGroupController(studentGroupRepo, app, passportConfig);
