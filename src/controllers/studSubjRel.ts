import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { StudSubjRel } from "../interfaces/StudSubjRel";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class StudSubjRelController extends RESTController<StudSubjRel> {
  constructor(repo: db.Repository<StudSubjRel>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["semester"], ["studentGroupId", "subjectId", "professorId"]);
    app.get("/studsubjrels", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/studsubjrel", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/studsubjrel", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/studsubjrel", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/studsubjrel", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/studsubjrels", {
      title: "Student groups and subjects"
    });
  }
}

