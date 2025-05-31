import { UserInterface } from "./userType";

declare global {
  namespace Express {
    interface User extends UserInterface {}
    interface Request {
        user?:User;
    }
  }
}
