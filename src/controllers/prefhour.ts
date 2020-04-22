import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { PrefHour } from "../interfaces/PrefHour";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class PrefHourController extends RESTController<PrefHour> {
  constructor(repo: db.Repository<PrefHour>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["professorId"], ["professorId"]);
    app.get("/prefhours", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/prefhour", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/prefhour", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/prefhour", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/prefhour", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/prefhours", {
      title: "Preferred Hours"
    });
  }
}

