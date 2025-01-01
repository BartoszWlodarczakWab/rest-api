import mongoose from "mongoose";
import { Collections } from "../constants.js";
import UserSchema from "../schemas/Users.js";

const model = mongoose.model(Collections.USERS, UserSchema);

export default model;