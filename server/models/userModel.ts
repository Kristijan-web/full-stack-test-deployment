import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends mongoose.Document {
  email: string;
  password: string;
  confirmPassword: string | undefined;
  role: string;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  confirmPassword: {
    type: String,
    required: [true, "ConfirmPassword is required"],
    validate: {
      validator: function (this: any, value: string) {
        return value === this.password;
      },
    },
  },
  role: {
    type: String,
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified(this.password) || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
  }
  next();
});

const User = mongoose.model("users", userSchema);

export default User;
