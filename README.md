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

- input room configs
- input rooms
- input groups
- input subjects (requires needs)
- input professors (requires subjects)
- remove "contact" controller
- CICD
- up to Heroku
- proper readme

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