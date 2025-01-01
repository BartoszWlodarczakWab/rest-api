import mongoose from "mongoose";

const schema = new mongoose.Schema({
    price: {
        type: Number,
        min: [0, "Items cannot have negative price."],
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    available: {
        type: Boolean,
        default: false
    }
});

export default schema;