import bcrypt from "bcrypt-nodejs";
import passport from "passport";
import passportLocal from "passport-local";
import * as db from "../others/db";
import { Request, Response, NextFunction } from "express";
import { User } from "../interfaces/User";

interface UserRequest extends Request {
    user: User;
}

export class PassportConfig
{
  private userRepo: db.Repository<User>;
  constructor (userRepo: db.Repository<User>) {
    this.userRepo = userRepo;
    this.configApp();
    return;
  }

  private configApp(){
    const LocalStrategy = passportLocal.Strategy;

    passport.serializeUser<any, any>((user, done) => {
      done(undefined, user);
    });

    passport.deserializeUser((obj, done) => {
      done(undefined, obj);
    });

    /**
     * Sign in using Email and Password.
     */
    passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
      // Find user by property
      const query: db.Query = db.query().byProperty("email", email.toLowerCase());
      const usersWithExactEmail = await this.userRepo.list(query);
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
  }

  public isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login");
  };

  public isAuthenticatedSecretary = async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const query: db.Query = db.query().byProperty("email", req.user.email);
      const result = await this.userRepo.list(query);
      if ((result.length == 1) && (result[0].role == 3)) {
        return next();
      }
    }
    res.redirect("/");
  };

  public isAuthenticatedStudentRep = async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const query: db.Query = db.query().byProperty("email", req.user.email);
      const result = await this.userRepo.list(query);
      if ((result.length == 1) && (result[0].role == 1)) {
        return next();
      }
    }
    res.redirect("/");
  };

  public isAuthenticatedProfessor = async (req: UserRequest, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      const query: db.Query = db.query().byProperty("email", req.user.email);
      const result = await this.userRepo.list(query);
      if ((result.length == 1) && (result[0].role == 2)) {
        return next();
      }
    }
    res.redirect("/");
  };
}