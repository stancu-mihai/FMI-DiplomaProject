## Requires:

- mongodb
- node.js

## Install:

- git clone ...
- npm install
- npm run build
- .env file with:
  -  NODE_ENV=
  -  MONGODB_URI=
  -  MONGODB_PATH=
  -  MONGODB_URI_LOCAL=
  -  SESSION_SECRET=...
- npm run start

## Todo:
- input professors (requires subjects)
- input groups
- add menu UI for rooms, subjects, professors, groups
- add algorithm
- handle UI bug where subjects are empty and want to add one
- remove "contact" controller
- CICD
- up to Heroku
- proper readme
- Remove true/false workaround from RestController.add
- add schema validation to RestController

## Description

License application. Subject: timetable optimization problem.

### Room data:
- name: string;
- location: string;
- capacity: number;    
- projector: boolean;
- blackboard: boolean; 
- smartboard: boolean; 
- videoSurveillance: boolean;
- physicsLab: boolean;
- chemistryLab: boolean;
- CSLab: boolean;
- biologyLab: boolean;
- basketball: boolean;
- football: boolean;