const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      },
      message: "Email not in right format",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  confirmPassword: {
    type: String,
    validate: {
      validator: function (value) {
        return this.password === value;
      },
    },
  },
});

// koristim pre-save document middleware, sto znaci da ce se izvrsiti pre nego sto se commit-uje u bazu
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    // ovde ce upasti kada se sifra azurira i pri sign up-u usera
    this.password = await bcrypt.hash(this.password, 12);
  }
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model("user", userSchema);

module.exports = User;
