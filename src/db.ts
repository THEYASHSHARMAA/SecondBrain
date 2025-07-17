// import { Schema } from './../node_modules/mongoose/types/index.d';
import mongoose from "mongoose";
import Mongoose, { Model, model, Schema } from "mongoose";
Mongoose.connect("mongodb://localhost:27017/brainly");
const userSchema = new Schema({
  username: { type: String, unique: true },
  password: { type: String, unique: true },
});
// const UserModel = new Model(userSchema, "user");

// with previous one it didnt give the the tpe in index.ts so we have to use this
const UserModel = model("User", userSchema);

const ContentSchema = new Schema({
  type: String,
  link: String,
  tag: { type: mongoose.Types.ObjectId, ref: "Tag" },
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});
const ContentModel = model("Content", ContentSchema);

export { UserModel, ContentModel };
