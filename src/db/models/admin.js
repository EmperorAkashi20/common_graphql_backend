import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema, model } = mongoose;

const AdminSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["admin", "sub-admin"],
      default: "sub-admin",
    },
    profilePicture: {
      type: String,
    },
    permissionOne: {
      type: Boolean,
      default: false,
    },
    permissionTwo: {
      type: Boolean,
      default: false,
    },
    permissionThree: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

AdminSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Admin = model("Admin", AdminSchema);
export { Admin };
