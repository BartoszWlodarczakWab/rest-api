import express from "express";
import mongoose from "mongoose";

import UsersRouter from './routes/users.js';
import ItemsRouter from './routes/items.js';
import OrdersRouter from './routes/orders.js';
import { DATABASE_URL, PORT } from './constants.js';

const server = express();

server.use(express.json());

server.use('/users', UsersRouter);
server.use('/items', ItemsRouter);
server.use('/orders', OrdersRouter);

server.listen(PORT, async () => {
    console.log(`Server is listening on port ${PORT}`);
    try {
        await mongoose.connect(DATABASE_URL);
        console.log(`Database connected at URL ${DATABASE_URL}`);
    } catch (err) {
        console.log(err);
    }
});
