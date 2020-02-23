import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Booking } from "../interfaces/Booking";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class BookingController extends RESTController<Booking> {
  constructor(repo: db.Repository<Booking>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["subjectId", "professorId", "studentGroupId", "isExternal"], ["studentGroupId", "subjectId", "professorId", "roomId"]);
    app.get("/bookings", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/booking", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/booking", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/booking", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/booking", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/bookings", {
      title: "Bookings"
    });
  }
}

