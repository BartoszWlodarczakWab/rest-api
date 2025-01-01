import mongoose from "mongoose";
import { Collections } from "../constants.js";
import ItemSchema from "../schemas/Items.js";

const model = mongoose.model(Collections.ITEMS, ItemSchema);

export default model;