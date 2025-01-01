import express from "express";

import ItemsModel from "../models/Items.js";
import { Roles } from "../constants.js";
import verifyToken from "../middleware/isUserLogged.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allItems = await ItemsModel.find();
        res.send(allItems);
    } catch (err) {
        console.log(err);
        req.send(err.message);
    }
});

router.post('/', verifyToken, async (req, res) => {

    // Cannot add items if user is not logged.
    // Only administrator can add items.
    try {
        if (req.userRole !== Roles.ADMIN) {
            return res.status(200).send('Operation not allowed.');
        }
        const { name, price, available } = req.body;
        if (!req.body) {
            return res.status(400).send('No body provided.');
        }
        if (!name) {
            return res.status(400).send('No name provided.');
        }
        if (!price || price < 0) {
            return res.status(400).send('No price provided or price is negative.')
        }
        const newItem = await ItemsModel.create({ name, price, available });
        res.status(201).send(newItem);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.patch('/:id', verifyToken, async (req, res) => {

    // Cannot add items if user is not logged.
    // Only administrator can update items.
    const itemToUpdateId = req.params.id;
    const { price, name, available } = req.body;
    try {
        if (req.userRole !== Roles.ADMIN) {
            return res.status(200).send('Operation not allowed.');
        }
        const itemToUpdate = await ItemsModel.findById(itemToUpdateId);
        if (!itemToUpdate) {
            return res.status(404).send('Item to update not found.');
        }
        const updatedItem = await ItemsModel.findByIdAndUpdate(itemToUpdateId, { price, name, available }, { new: true });
        return res.status(200).send(updatedItem);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {

    // Cannot add items if user is not logged.
    // Only administrator can delete items.
    const itemToDeleteId = req.params.id;
    try {
        if (req.userRole !== Roles.ADMIN) {
            return res.status(403).send('Operation not allowed.');
        }
        const item = await ItemsModel.findById(itemToDeleteId);
        if (!item) {
            return res.status(404).send('Item not found.');
        }
        const deletedItem = await ItemsModel.findOneAndDelete({ _id: itemToDeleteId });
        return res.status(200).send(deletedItem);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.get('/price-lower-than=:price', async (req, res) => {
    const priceLimit = req.params.price;
    try {
        const itemsFound = await ItemsModel.find({ price: { $lt: priceLimit } });
        if (itemsFound.length == 0) {
            return res.status(404).send('No items found.');
        }
        res.send(itemsFound);
    } catch (err) {
        console.log(err);
        req.send(err.message);
    }
});

router.get('/available', async (req, res) => {
    try {
        const itemsFound = await ItemsModel.find({ available: true });
        if (itemsFound.length == 0) {
            return res.status(404).send('None of the items are available.');
        }
        res.send(itemsFound);
    } catch (err) {
        console.log(err);
        req.send(err.message);
    }
});

export default router;
