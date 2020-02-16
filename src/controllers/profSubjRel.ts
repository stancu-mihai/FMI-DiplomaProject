import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { ProfSubjRel } from "../interfaces/ProfSubjRel";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class ProfSubjRelController extends RESTController<ProfSubjRel> {
  constructor(repo: db.Repository<ProfSubjRel>, app: Application, passportConfig: PassportConfig) {
    super(repo, [], ["professorId", "canTeachId"]);
    app.get("/profsubjrels", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/profsubjrel", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/profsubjrel", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/profsubjrel", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/profsubjrel", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/profsubjrels", {
      title: "Professors and subjects"
    });
  }
}

