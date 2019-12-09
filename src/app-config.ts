import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import path from "path";
import mongoose from "mongoose";
import passport from "passport";
import bluebird from "bluebird";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import errorHandler from "errorhandler";
import express from "express";
import mongo from "connect-mongo";
import {Application} from "express";

const MongoStore = mongo(session);

export class AppConfig
{  
    private app: Application;
    constructor (app: Application) {
        this.app = app;
        this.configApp();
        this.startApp();
        return;
    }

    configApp() {
        // Connect to MongoDB
        const mongoUrl = MONGODB_URI;
        mongoose.Promise = bluebird;

        mongoose.connect(mongoUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true } ).then(
            () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
        ).catch(err => {
            console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
            // process.exit();
        });

        // Express configuration
        this.app.set("port", process.env.PORT || 3000);
        this.app.set("views", path.join(__dirname, "../views"));
        this.app.set("view engine", "pug");
        this.app.use(compression());
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: SESSION_SECRET,
            store: new MongoStore({
                url: mongoUrl,
                autoReconnect: true
            })
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());
        this.app.use(lusca.xframe("SAMEORIGIN"));
        this.app.use(lusca.xssProtection(true));
        this.app.use((req, res, next) => {
            res.locals.user = req.user;
            next();
        });
        this.app.use((req, res, next) => {
            // After successful login, redirect back to the intended page
            if (!req.user &&
            req.path !== "/login" &&
            req.path !== "/signup" &&
            !req.path.match(/^\/auth/) &&
            !req.path.match(/\./)) {
                req.session.returnTo = req.path;
            } else if (req.user &&
            req.path == "/account") {
                req.session.returnTo = req.path;
            }
            next();
        });

        this.app.use(
            express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
        );

        // Error Handler. Provides full stack - remove for production
        this.app.use(errorHandler());
    }

    startApp() {
        // Start Express server.
        this.app.listen(this.app.get("port"), () => {
            console.log(
                "  App is running at http://localhost:%d in %s mode",
                this.app.get("port"),
                this.app.get("env")
            );
            console.log("  Press CTRL-C to stop\n");
        });
    }
}