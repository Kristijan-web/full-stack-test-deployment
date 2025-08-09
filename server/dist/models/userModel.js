import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
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
            validator: function (value) {
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
    if (this.isModified(this.password) || this.isNew) {
        this.password = await bcrypt.hash(this.password, 12);
        this.confirmPassword = undefined;
    }
    next();
});
userSchema.methods.correctPassword = async function (userPass, dbPass) {
    return await bcrypt.compare(userPass, dbPass);
};
userSchema.methods.didPasswordChange = function (JWTInitiatedAt) {
    // JWTInitatedAt je vreme u sekundama, znaci passwordChangedAt isto mora biti u sekundama
    if (this.passwordChangedAt > JWTInitiatedAt) {
        return true;
    }
    return false;
};
userSchema.pre(/^find/, function (next) {
    // this pokazuje na query objekat
    if (this instanceof mongoose.Query) {
        this.select("-__v");
    }
    next();
    next();
});
const User = mongoose.model("users", userSchema);
export default User;
