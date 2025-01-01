import express from "express";
import mongoose from 'mongoose';

import OrdersModel from "../models/Orders.js";
import ItemsModel from "../models/Items.js";
import UsersModel from "../models/Users.js";
import { Roles, Status } from "../constants.js";
import verifyToken from "../middleware/isUserLogged.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allOrders = await OrdersModel.find();
        res.send(allOrders);
    } catch (err) {
        console.log(err);
        req.send(err.message);
    }
});

router.post('/', verifyToken, async (req, res) => {

    // Cannot make an order if user is not logged.
    // Normal users can make orders.
    const userId = req.userId;
    const { title, items } = req.body;
    try {
        if (!req.body) {
            return res.status(400).send('No body provided.');
        }
        let amount = 0;
        if (items) {
            if (items.length == 0) {
                return res.status(400).send('Order must have items.');
            }
            for (const item of items) {
                if (item.length != 2) {
                    return res.status(400).send('Incorrect length for item array.');
                }
                const itemQuantity = item[0];
                if (!Number.isInteger(itemQuantity)) {
                    return res.status(400).send('Item amount must be an integer.');
                }
                if (itemQuantity <= 0) {
                    return res.status(400).send('Item amount must be a positive integer.');
                }
                if (!mongoose.isValidObjectId(item[1])) {
                    return res.status(400).send('Incorrect item ID.');
                }
                const itemToFind = await ItemsModel.findById([item[1]]);
                if (!itemToFind) {
                    return res.status(400).send('Incorrect item ID.');
                }
                if (!itemToFind.available) {
                    return res.status(400).send('At least one item is unavailable.');
                }
                amount += (itemToFind.price * itemQuantity);
            }
        }
        else {
            return res.status(400).send('No items provided.');
        }
        const newOrder = await OrdersModel.create({ amount, title, userId, items });
        res.status(201).send(newOrder);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.patch('/:id', verifyToken, async (req, res) => {

    // Cannot add items if user is not logged.
    // Only administrator can update items.
    const orderToUpdateId = req.params.id;
    const { title, userId, status, items } = req.body;
    try {
        if (req.userRole !== Roles.ADMIN) {
            return res.status(200).send('Operation not allowed.');
        }
        const orderToUpdate = await OrdersModel.findById(orderToUpdateId);
        if (!orderToUpdate) {
            return res.status(400).send('Order to update not found.');
        }
        if (userId) {
            if (!mongoose.isValidObjectId(userId)) {
                return res.status(400).send('Incorrect user ID.');
            }
            const userToFind = await UsersModel.findById(userId);
            if (!userToFind) {
                return res.status(404).send('Could not find the user.');
            }
        }
        if (status) {
            const isInConstants = Object.values(Status).includes(status)
            if (!isInConstants) {
                return res.status(400).send('Incorrect status.');
            }
        }
        let amount = orderToUpdate.amount;
        if (items) {

            // If items are given in PATCH, the amount is calculated from zero
            amount = 0;
            if (items.length == 0) {
                return res.status(400).send('Order must have items.');
            }
            for (const item of items) {
                if (item.length != 2) {
                    return res.status(400).send('Incorrect length for item array.');
                }
                const itemQuantity = item[0];
                if (!Number.isInteger(itemQuantity)) {
                    return res.status(400).send('Item amount must be an integer.');
                }
                if (itemQuantity <= 0) {
                    return res.status(400).send('Item amount must be a positive integer.');
                }
                if (!mongoose.isValidObjectId(item[1])) {
                    return res.status(400).send('Incorrect item ID.');
                }
                const itemToFind = await ItemsModel.findById([item[1]]);
                if (!itemToFind) {
                    return res.status(400).send('Incorrect item ID.');
                }
                if (!itemToFind.available) {
                    return res.status(400).send('At least one item is unavailable.');
                }
                amount += (itemToFind.price * itemQuantity);
            }
        }
        const updatedOrder = await OrdersModel.findByIdAndUpdate(orderToUpdateId, { amount, title, userId, status, items }, { new: true });
        return res.status(200).send(updatedOrder);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {

    // Only administrator can delete orders.
    const orderToDeleteId = req.params.id;
    try {
        if (req.userRole !== Roles.ADMIN) {
            return res.status(200).send('Operation not allowed.');
        }
        const order = await OrdersModel.findById(orderToDeleteId);
        if (!order) {
            return res.status(404).send('Order not found.');
        }
        const deletedOrder = await OrdersModel.findOneAndDelete({ _id: orderToDeleteId });
        return res.status(200).send(deletedOrder);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.get('/orders-by-user=:userId', async (req, res) => {
    const chosenUserId = req.params.userId;
    try {
        const ordersFound = await OrdersModel.find({ userId: chosenUserId });
        if (ordersFound == 0) {
            return res.status(404).send('No orders found.');
        }
        res.send(ordersFound);
    } catch (err) {
        console.log(err);
        req.send(err.message);
    }
});

export default router;