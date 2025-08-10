import { UserDocument } from "../../models/userModel"; // prilagodi path

declare global {
  namespace Express {
    interface Request {
      user?: UserDocument; // ili ako koristiš mongoose.Document, može biti User | null
    }
  }
}

export {};
