import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Seminar } from "../interfaces/Seminar";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class SeminarController extends RESTController<Seminar> {
  constructor(repo: db.Repository<Seminar>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["semester"], ["studentGroupId", "subjectId", "professorId"]);
    app.get("/seminars", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/seminar", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/seminar", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/seminar", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/seminar", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/seminars", {
      title: "Education plan - Seminars"
    });
  }
}

