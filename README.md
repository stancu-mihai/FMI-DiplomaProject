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
- prioritize professors by grade
- verification endpoint
- add algorithm (find less intersected timeframe, propose from available professors)
- switch to romanian
- make homescreen more friendly

- Bugfix: Update an item in JQuery, then delete it => Crash due to .value.value
- rename title
- Add more cities
## Todo long term:
- add schema validation to RestController
- make search work for multiple fields at once

## Description

License application. Subject: timetable optimization problem.
- The series and groups of students are provided. Each group has subjects assigned. Each series contains several groups.
- The list of rooms is provided. Each room has some features (no of seats, some have projector, some blackboard, etc.).
- The list of subjects is provided. 
- For each group, for each semester, a list of subjects are provided as input. Each subject has a professor assigned and some features (duration, no of hours per week) and needs (projector, blackboard).
- The professors have favorite times for their courses.
- Generate menu will populate the list of Bookings
- Timetable will show the list of bookings in a more user-friendly way.

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
- computers: boolean;

### Subject data:
- name: string;

### Series data:
- name: string;

### StudentGroup data:
- name: string;
- seriesId: Series;
- count: number;

### Course data:
- seriesId: StudentGroup;
- subjectId: Subject;
- semester: number;
- professorId: User;
- weeklyHours: number;
- projector: boolean;
- blackboard: boolean; 
- smartboard: boolean; 
- computers: boolean;

### Seminar data:
- studentGroupId: StudentGroup;
- subjectId: Subject;
- semester: number;
- professorId: User;
- weeklyHours: number;
- projector: boolean;
- blackboard: boolean; 
- smartboard: boolean; 
- computers: boolean;

### PrefHours data:
- professorId: User;
- weekDay: number;
- startHour: number;
- endHour: number;

### Booking data:
- studentGroupId: StudentGroup;
- subjectId: Subject;
- professorId: User;
- roomId: Room;
- semester: number;
- weekDay: number;
- startHour: number;
- duration: number;


## Limitations
- Can't use fractions of an hour (14:30 or 14:15 are unavailable for both start and end times)