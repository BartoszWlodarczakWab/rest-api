import mongoose from "mongoose";
import { Collections } from "../constants.js";
import OrderSchema from "../schemas/Orders.js";

const model = mongoose.model(Collections.ORDERS, OrderSchema);

export default model;