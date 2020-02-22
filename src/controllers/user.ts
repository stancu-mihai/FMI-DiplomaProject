import { Request, Response, NextFunction } from "express";
import { check, sanitize, validationResult } from "express-validator";
import "../config/passport";
import { RESTController } from "../classes/RESTController"; 
import { User } from "../interfaces/User";
import * as db from "../others/db";
import passport from "passport";
import { IVerifyOptions } from "passport-local";
import bcrypt from "bcrypt-nodejs";
import { UserRequest } from "../interfaces/UserRequest";
import { Application } from "express";
import { PassportConfig } from "../config/passport";

export class UserController extends RESTController<User> {
  constructor(repo: db.Repository<User>, app: Application, passportConfig: PassportConfig) {
    super(repo, ["role"], []);
    this.registerRoutes(app, passportConfig);
  }

  private registerRoutes(app: Application, passportConfig: PassportConfig) {
    app.get("/", this.getRootRoute);
    app.get("/login", this.getLogin);
    app.post("/login", this.postLogin);
    app.get("/logout", this.logout);
    app.get("/signup", this.getSignup);
    app.post("/signup", this.postSignup);
    app.get("/account", passportConfig.isAuthenticated, this.getAccount);
    app.post("/account/profile", passportConfig.isAuthenticated, this.postUpdateProfile);
    app.post("/account/password", passportConfig.isAuthenticated, this.postUpdatePassword);
    app.post("/account/delete", passportConfig.isAuthenticated, this.postDeleteAccount);
    app.get("/api/user", passportConfig.isAuthenticatedSecretary, this.get.bind(this));
  }

  public getRootRoute = (req: Request, res: Response) => {
    res.render("home", {
      title: "Home"
    });
  };

  public getLogin = (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("account/login", {
      title: "Login"
    });
  };

  public postLogin = (req: Request, res: Response, next: NextFunction) => {
    check("email", "Email is not valid").isEmail();
    check("password", "Password cannot be blank").not().isEmpty();
    // eslint-disable-next-line @typescript-eslint/camelcase
    sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/login");
    }

    passport.authenticate("local", (err: Error, user: User, info: IVerifyOptions) => {
      if (err) { return next(err); }
      if (!user) {
        req.flash("errors", { msg: info.message });
        return res.redirect("/login");
      }
      req.logIn(user, (err) => {
        if (err) { return next(err); }
        req.flash("success", { msg: "Success! You are logged in." });
        res.redirect(req.session.returnTo || "/");
      });
    })(req, res, next);
  };

  public logout = (req: Request, res: Response) => {
    req.logout();
    res.redirect("/");
  };

  public getSignup = (req: Request, res: Response) => {
    if (req.user) {
      return res.redirect("/");
    }
    res.render("account/signup", {
      title: "Create Account"
    });
  };

  public postSignup = async (req: Request, res: Response, next: NextFunction) => {
    check("email", "Email is not valid").isEmail();
    check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
    check("confirmPassword", "Passwords do not match").equals(req.body.password);
    // eslint-disable-next-line @typescript-eslint/camelcase
    sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/signup");
    }

    // Find user by property
    const query: db.Query = db.query().byProperty("email", req.body.email);
    const usersWithExactEmail = await this.repo.list(query);

    if (usersWithExactEmail.length > 0) {
      req.flash("errors", { msg: "Account with that email address already exists." });
      return res.redirect("/signup");
    }

    const newUser: User = {
      profile: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        city: +req.body.city,
        phoneNo: req.body.phoneNo,
      },
      role: req.body.role,
      grade: req.body.grade,
      worksSS: req.body.worksSS == "on"? true: false,
      worksMtoF: req.body.worksMtoF == "on"? true: false,
      prefStartHour: req.body.prefStartHour,

      password: req.body.password,
      email: req.body.email,
      passwordResetToken: undefined,
      passwordResetExpires: undefined,
      comparePassword: undefined
    };

    await this.updatePassword(undefined, newUser);
    await this.repo.add(newUser);

    req.logIn(newUser, (err) => {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  };

  public getAccount = (req: Request, res: Response) => {
    res.render("account/profile", {
      title: "Account Management"
    });
  };

  public postUpdateProfile = async (req: UserRequest, res: Response, next: NextFunction) => {
    check("email", "Please enter a valid email address.").isEmail();
    // eslint-disable-next-line @typescript-eslint/camelcase
    sanitize("email").normalizeEmail({ gmail_remove_dots: false });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/account");
    }

    // Find user by id
    const query: db.Query = db.query().byId(new db.DbObjectId(req.user._id.value));
    const users = await this.repo.list(query);
    const oldUser = users[0];
    // Clone user
    const newUser: User =  Object.assign({}, oldUser);

    newUser.profile.firstName = req.body.firstName;
    newUser.profile.lastName = req.body.lastName;
    newUser.profile.city = req.body.city;
    newUser.role = req.body.role;
    newUser.email = req.body.email;
    newUser.profile.phoneNo = req.body.phoneNo;
    newUser.grade = req.body.grade,
    newUser.worksMtoF = req.body.worksMtoF == "on"? true: false,
    newUser.worksSS = req.body.worksSS == "on"? true: false,
    newUser.prefStartHour = req.body.prefStartHour,

    await this.repo.update(newUser);

    req.flash("success", { msg: "Profile information has been updated." });
    res.redirect("/account");
  };

  public postUpdatePassword = async (req: UserRequest, res: Response, next: NextFunction) => {
    check("password", "Password must be at least 4 characters long").isLength({ min: 4 });
    check("confirmPassword", "Passwords do not match").equals(req.body.password);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      return res.redirect("/account");
    }

    // Find user by id
    const query: db.Query = db.query().byId(new db.DbObjectId(req.user._id.value));
    const users = await this.repo.list(query);
    const oldUser = users[0];
    const newUser = Object.create(oldUser);

    newUser.password = req.body.password;

    await this.updatePassword(oldUser, newUser);
    await this.repo.update(newUser);

    req.flash("success", { msg: "Password has been changed." });
    res.redirect("/account");
  };

  public postDeleteAccount = async (req: UserRequest, res: Response, next: NextFunction) => {
    // Delete user by id
    const query: db.Query = db.query().byId(new db.DbObjectId(req.user._id.value));
    await this.repo.remove(query);

    req.logout();
    req.flash("info", { msg: "Your account has been deleted." });
    res.redirect("/");
  }

  public updatePassword(oldUser: User, newUser: User): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Check if password is unchanged
      if (oldUser && (oldUser.password == newUser.password)) {
        return resolve();
      }
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return reject(err);
        }

        bcrypt.hash(newUser.password, salt, undefined, (err: Error, hash) => {
          if (err) {
            return reject(err);
          }
          newUser.password = hash;
          resolve();
        });
      });
    });
  }
}
