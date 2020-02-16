## Requires:

- mongodb
- node.js

## Install:

- git clone https://github.com/stancu-mihai/FMI-DiplomaProject.git
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
- input groups (requires subjects and professors)
- add menu UI for rooms, subjects, professors, groups
- add algorithm
- add UI to visualize results https://fullcalendar.io/
- remove "contact" controller
- CICD
- up to Heroku
- proper readme
- Remove true/false workaround from RestController.add
- add schema validation to RestController
- make search work for multiple fields at once

## Description

License application. Subject: timetable optimization problem.
The list of rooms is provided. Each room has some features (no of seats, some have projector, some blackboard, etc.).
The list of subjects is provided. Each subject has some features (credits, no of hours per week) and needs (projector, blackboard).
The relations between subjects and professors is provided. It is n:n (many to many) relation.

## Database description

### User:
- email: string;
- password: string;
- passwordResetToken: string;
- passwordResetExpires: Date;
- profile/firstName: string;
- profile/lastName: string;
- profile/city: number;
- profile/phoneNo: string;
- role: number;

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

### Subject data:
- name: string;
- credits: number;
- timeDuration: number;
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

### ProfSubjRel data:
- professorId: User;
- subjectId: Subject;