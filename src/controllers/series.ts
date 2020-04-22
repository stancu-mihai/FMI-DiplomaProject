import { Request, Response } from "express";
import "../config/passport";
import { RESTController } from "../classes/RESTController";
import { Series } from "../interfaces/Series";
import * as db from "../others/db";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class SeriesController extends RESTController<Series> {
  constructor(repo: db.Repository<Series>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["name"], []);
    app.get("/series", passportConfig.isAuthenticatedSecretary, this.getRoute);
    app.get("/api/series", passportConfig.isAuthenticated, this.get.bind(this));
    app.post("/api/series", passportConfig.isAuthenticatedSecretary, this.add.bind(this));
    app.put("/api/series", passportConfig.isAuthenticatedSecretary, this.update.bind(this));
    app.delete("/api/series", passportConfig.isAuthenticatedSecretary, this.del.bind(this)); 
  }

  getRoute (req: Request, res: Response) {
    res.render("controllers/series", {
      title: "Series"
    });
  }
}

