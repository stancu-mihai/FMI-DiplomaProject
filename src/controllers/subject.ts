import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Subject } from "../interfaces/Subject";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class SubjectController extends RESTController<Subject> {
  constructor(repo: db.Repository<Subject>, app: Application, passportConfig: PassportConfig) {
    super(repo, [
      "name",
      "credits",
      "timeDuration",
      "location",
      "capacity",
      "projector",
      "blackboard",
      "smartboard",
      "videoSurveillance",
      "physicsLab",
      "chemistryLab",
      "CSLab",
      "biologyLab",
      "basketball",
      "football"], []);
    app.get("/subjects", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/subject", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/subject", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/subject", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/subject", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/subjects", {
      title: "List of subjects"
    });
  }
}

