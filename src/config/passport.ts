import bcrypt from "bcrypt-nodejs";
import passport from "passport";
import passportLocal from "passport-local";
import * as db from "../others/db";
import * as mongoDbRepo from "../others/mongodb";
import { User } from "../interfaces/User";
import { Request, Response, NextFunction } from "express";

interface UserRequest extends Request {
    user: User;
}

db.use(mongoDbRepo.init());
const userRepo = db.repo<User>({ table: "User" });
const secretaryRepo = db.repo<User>({ table: "Secretary" });
const studentRepRepo = db.repo<User>({ table: "StudentRep" });
const professorRepo = db.repo<User>({ table: "Professor" });
const LocalStrategy = passportLocal.Strategy;

passport.serializeUser<any, any>((user, done) => {
  done(undefined, user);
});

passport.deserializeUser((obj, done) => {
// TODO: Compare with the Microsoft Typescript Starter template
  done(undefined, obj);
});

/**
 * Sign in using Email and Password.
 */
passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
  // Find user by property
  const query: db.Query = db.query().byProperty("email", email.toLowerCase());
  const usersWithExactEmail = await userRepo.list(query);
  const user = usersWithExactEmail[0];
  try {
    if (!user) {
      return done(undefined, false, { message: `Email ${email} not found.` });
    }

    bcrypt.compare(password, user.password, function(err, res) {
      if (res) {
        // Passwords match
        return done(undefined, user);
      } else {
        // Password don't match
        done(undefined, false, { message: "Invalid email or password." });
      }
    });
  }
  catch (error) {
    return done(error);
  }
}));

/**
 * Login Required middleware.
 */
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

export const isAuthenticatedSecretary = async (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const query: db.Query = db.query().byProperty("email", req.user.email);
    const result = await secretaryRepo.list(query);
    if ((result.length == 1) && (result[1].role == 3)) {
      return next();
    }
  }
  res.redirect("/");
};

export const isAuthenticatedStudentRep = async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const query: db.Query = db.query().byProperty("email", req.user.email);
      const result = await studentRepRepo.list(query);
      if ((result.length == 1) && (result[1].role == 1)) {
        return next();
      }
    }
    res.redirect("/");
  };

export const isAuthenticatedProfessor = async (req: UserRequest, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    const query: db.Query = db.query().byProperty("email", req.user.email);
    const result = await professorRepo.list(query);
    if ((result.length == 1) && (result[1].role == 2)) {
      return next();
    }
  }
  res.redirect("/");
};
