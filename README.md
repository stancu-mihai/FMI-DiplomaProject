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
  -  SESSION_SECRET=...
- npm run start

## Todo:
- add algorithm (find less intersected timeframe, propose from available professors)
- Subjects: move duration to StudSubjRel, delete all other fields but not name
- Student groups: remove student rep, semesters and only weekend
- ProfSubjRel - REMOVE IT!
- StudentSubj - Add professor, features from rooms, add duration

- DB Change: each student group should be able to have a different professor
- DB Change: add series that contains student groups (courses are held with series aka with all groups)
- switch to romanian
- should be able to manually edit resulting bookings
- Bugfix: Update an item in JQuery, then delete it => Crash due to .value.value
- rename title
- remove "contact" controller
- Add more cities
## Todo long term:
- add schema validation to RestController
- make search work for multiple fields at once

## Description

License application. Subject: timetable optimization problem.
- The list of rooms is provided. Each room has some features (no of seats, some have projector, some blackboard, etc.).
- The list of subjects is provided. Each subject has some features (credits, no of hours per week) and needs (projector, blackboard).
- The relations between subjects and professors is provided. It is n:n (many to many) relation.
- The groups of students are provided. Each group has subjects assigned.
- The relations between subjects and student groups is provided. It is 1:n (one to many) relation.
- The timetable itself will be a list of bookings. Some bookings are external to this application (professors or rooms are unavailable in certain timeframes)

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

### StudentGroup data:
- name: string;
- semesters: number;
- studentRep: User;

### StudentGroup data:
- studentGroupId: StudentGroup;
- subjectId: Subject;
- semester: number;

### Booking data:
- studentGroupId: StudentGroup;
- subjectId: Subject;
- professorId: User;
- roomId: Room;
- semester: number;
- weekDay: number;
- startHour: number;
- duration: number;
- isExternal: boolean;

## Limitations
- Can't use fractions of an hour (14:30 or 14:15 are unavailable for both start and end times)