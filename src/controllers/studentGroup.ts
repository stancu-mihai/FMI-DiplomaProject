import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { StudentGroup } from "../interfaces/StudentGroup";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class StudentGroupController extends RESTController<StudentGroup> {
  constructor(repo: db.Repository<StudentGroup>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["name", "semesters"], ["studentRep", "seriesId"]);
    app.get("/studentgroups", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/studentgroup", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/studentgroup", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/studentgroup", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/studentgroup", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/studentgroups", {
      title: "List of student groups"
    });
  }
}

