import mongoose from 'mongoose';
import { Status } from '../constants.js';

const schema = new mongoose.Schema({
    amount: {
        type: Number,
        required: false
    },
    title: {
        type: String,
        required: false,
        default: "blank"
    },
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: [Status.CANCELLED, Status.DELIVERED, Status.IN_PROGRESS, Status.NEW],
        required: false,
        default: Status.NEW
    },
    items: {
        type: [[mongoose.Schema.Types.Mixed]],
        required: true
    }
});

export default schema;