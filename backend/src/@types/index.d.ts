import { UserInterface } from "../utils/interfaces"

declare global {
  namespace Express {
    interface User extends UserInterface {}
    interface Request {
        user?:User;
    }
  }
}
