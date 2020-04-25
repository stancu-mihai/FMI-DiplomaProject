import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Room } from "../interfaces/Room";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class RoomController extends RESTController<Room> {
  constructor(repo: db.Repository<Room>, app: Application, passportConfig: PassportConfig) {
    super(repo, [
      "name",
      "location",
      "capacity",
      "projector",
      "blackboard",
      "smartboard",
      "computers"], []);
    app.get("/rooms", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/room", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/room", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/room", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/room", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/rooms", {
      title: "List of rooms"
    });
  }
}

