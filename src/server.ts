import { ExpressConfig } from "./config/express";
import { UserController } from "./controllers/user";
import { RoomController } from "./controllers/room";
import { User } from "./interfaces/User";
import { Room } from "./interfaces/Room";
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
// Config Passport
const passportConfig = new PassportConfig(userRepo);
// Create controllers
new UserController(userRepo, app, passportConfig);
new RoomController(roomRepo, app, passportConfig);
