import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import { calculateAge } from "../../utils/helper.js";

const { Schema, model } = mongoose; // Destructure Schema and model from mongoose

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A name is required"],
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please Provide a valid email"],
      required: [true, "A valid email address is required"],
    },
    password: {
      type: String,

      required: [true, "User must provide a password"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      validate: [
        validator.isMobilePhone,
        "Please Provide a valid phone number",
      ],
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },

    dateOfBirth: {
      type: Date,
      required: [true, "User must have DOB"],
      default: Date.now(),
    },
    timeOfBirth: {
      type: String,
    },
    age: {
      type: Number,
    },

    is2FaEnabled: {
      type: Boolean,
      default: true,
    },
    isMobileVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", function (next) {
  this.age = calculateAge(this.dateOfBirth);
  next();
});

UserSchema.pre(/^find/, function (next) {
  this.age = calculateAge(this.dateOfBirth);
  next();
});

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

UserSchema.index({ email: 1 });

const User = model("User", UserSchema);

export { User };
