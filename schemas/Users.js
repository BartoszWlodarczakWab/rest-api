import mongoose from "mongoose";
import { Roles } from "../constants.js";

const schema = new mongoose.Schema({
    firstName: {
        type: String,
        required: false
    },
    lastName: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        min: [18, "User must be an adult."],
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        min: [3, "Password must be at least 3 characters long."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    role: {
        type: String,
        enum: [Roles.ADMIN, Roles.USER],
        default: Roles.USER
    }
});

export default schema;