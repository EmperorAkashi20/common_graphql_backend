import mongoose from "mongoose";
const { Schema, model } = mongoose;

const blogSchema = new Schema(
  {
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    video: {
      type: String,
    },

    image: {
      type: String,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);
export { Blog };
