import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Course } from "../interfaces/Course";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class CourseController extends RESTController<Course> {
  constructor(repo: db.Repository<Course>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["semester"], ["seriesId", "subjectId", "professorId"]);
    app.get("/courses", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/course", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/course", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/course", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/course", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/courses", {
      title: "Education plan - courses"
    });
  }
}

