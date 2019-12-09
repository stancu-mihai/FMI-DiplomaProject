import { ExpressConfig } from "./config/express";
import { UserController } from "./controllers/user";
import { User } from "./interfaces/User";
import * as db from "./others/db";
import * as passportConfig from "./config/passport";
import express from "express";

// Create app
const app = express();
// Config app
new ExpressConfig(app);
// Create repositories
const userRepo = db.repo<User>({ table: "User" });
// Create controllers
new UserController(userRepo, app, passportConfig);
