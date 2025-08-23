import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
const userSchema = new mongoose.Schema({
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
        type: Date,
    },
    passwordResetToken: {
        type: String,
    },
    passwordResetExpires: {
        type: Date,
    },
});
userSchema.pre("save", async function (next) {
    if (this.isModified("password") || this.isNew) {
        this.password = await bcrypt.hash(this.password, 12);
        // dodaj za passwordChangedAt
        this.passwordChangedAt = new Date(Date.now() - 2000);
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
userSchema.methods.correctPassword = async function (userPass, dbPass) {
    return await bcrypt.compare(userPass, dbPass);
};
userSchema.methods.didPasswordChange = function (JWTInitiatedAt) {
    // JWTInitatedAt je vreme u sekundama, znaci passwordChangedAt isto mora biti u sekundama
    // exp kod jwt-a radi u sekundama
    // JWTInitiatedAt je u sekundama a treba milisekunde
    const JWTInitiatedInMiliseconds = JWTInitiatedAt * 1000;
    const passwordChangedAtMiliseconds = new Date(this.passwordChangedAt).getTime();
    console.log("ZA JWT I passowrdChangedAt", JWTInitiatedInMiliseconds, passwordChangedAtMiliseconds);
    if (passwordChangedAtMiliseconds > JWTInitiatedInMiliseconds) {
        return true;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    // koristi se crypt build in biblioteka da se napravi hash i upise u bazu
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHashed = crypto.createHash("sha256").update(token).digest("hex");
    this.passwordResetToken = tokenHashed;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minuta
    return token;
};
const User = mongoose.model("User", userSchema);
export default User;
