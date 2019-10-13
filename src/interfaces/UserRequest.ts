import { User } from "./User";
import { Request } from "express";
export interface UserRequest extends Request {
  user: User;
}