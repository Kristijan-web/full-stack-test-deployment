import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
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
});

const User = mongoose.model("users", userSchema);

export default User;
