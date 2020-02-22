import { DbObject } from "../others/db";

type comparePasswordFunction = (candidatePassword: string, cb: (err: any, isMatch: any) => {}) => void;
export type AuthToken = {
  accessToken: string;
  kind: string;
};

export interface User extends DbObject {
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  profile: {
    firstName: string;
    lastName: string;
    city: number;
    phoneNo: string;
  };
  role: number;
  grade: number;
  worksSS: boolean;
  worksMtoF: boolean;
  prefStartHour: number;

  comparePassword: comparePasswordFunction;
}