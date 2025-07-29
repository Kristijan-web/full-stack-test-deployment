import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    email: {
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
            validator: function (value) {
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
