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
            validator: function (value) {
                return value === this.password;
            },
        },
    },
});
export default userSchema;
