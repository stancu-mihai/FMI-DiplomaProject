import request from "supertest";
import { expect } from "chai";

import express from "express";
import { ExpressConfig } from "../src/config/express";
import * as db from "../src/others/db";
import { User } from "../src/interfaces/User";
import { UserController } from "../src/controllers/user";
import * as mockDbRepo from "../src/others/mockdb";

const app = express();
new ExpressConfig(app);
db.use(mockDbRepo.init());
const userRepo = db.repo<User>({ table: "User" });
import { PassportConfig } from "../src/config/passport";
const passportConfig = new PassportConfig(userRepo);
new UserController(userRepo, app, passportConfig);

describe("GET /login", () => {
    it("should return 200 OK", () => {
        return request(app).get("/login")
            .expect(200);
    });
});


describe("GET /signup", () => {
    it("should return 200 OK", () => {
        return request(app).get("/signup")
            .expect(200);
    });
});

describe("POST /login", () => {
    it("should return some defined error message with valid parameters", (done) => {
        return request(app).post("/login")
            .field("email", "john@me.com")
            .field("password", "Hunter2")
            .expect(302)
            .end(function(err, res) {
                expect(res.error).not.to.be.undefined;
                done();
            });
    });
});
