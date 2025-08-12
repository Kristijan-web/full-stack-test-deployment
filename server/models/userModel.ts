import mongoose, { InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

interface IUser extends mongoose.Document {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string | undefined;
  role: string;
  passwordChangedAt: number;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  didPasswordChange(val: number): boolean;
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  fullName: {
    type: String,
    required: [true, "Full name is required"],
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
  passwordChangedAt: {
    type: Number,
  },
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password") || this.isNew) {
    this.password = await bcrypt.hash(this.password, 12);
    // dodaj za passwordChangedAt
    this.passwordChangedAt = Date.now() / 1000 - 2;
    this.confirmPassword = undefined;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  // this pokazuje na query objekat
  if (this instanceof mongoose.Query) {
    this.select("-__v");
  }
  next();
});

userSchema.methods.correctPassword = async function (
  userPass: string,
  dbPass: string
): Promise<boolean> {
  return await bcrypt.compare(userPass, dbPass);
};

userSchema.methods.didPasswordChange = function (JWTInitiatedAt: number) {
  // JWTInitatedAt je vreme u sekundama, znaci passwordChangedAt isto mora biti u sekundama
  if (this.passwordChangedAt > JWTInitiatedAt) {
    return true;
  }
  return false;
};

type UserType = InferSchemaType<typeof userSchema>;

const User = mongoose.model("users", userSchema);

export default User;

export { UserType };
