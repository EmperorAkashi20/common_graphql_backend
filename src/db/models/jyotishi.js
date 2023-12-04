import mongoose from "mongoose";
const { Schema, model } = mongoose;

const jyotishiSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
});

const Jyotishi = model("Jyotishi", jyotishiSchema);

export { Jyotishi };
