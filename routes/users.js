import express from "express";
import jwt from 'jsonwebtoken';

import UsersModel from "../models/Users.js";
import { areCredentialsPresent } from "../middleware/areCredentialsPresent.js";
import { SECRET_KEY, Roles } from "../constants.js";
import verifyToken from "../middleware/isUserLogged.js";

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const allUsers = await UsersModel.find();
        res.send(allUsers);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.post('/', areCredentialsPresent);
router.post('/', async (req, res) => {
    const { email, password, role } = req.body;
    if (!req.body) {
        return res.status(400).send("No body provided ");
    }

    if (password.length < 3) {
        return res.status(400).send("Password is too short.");
    }

    try {
        const existingUser = await UsersModel.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User with this email already exists.');
        }
        const newUser = await UsersModel.create({ email, password, role });
        res.status(201).send(newUser);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.post('/login', areCredentialsPresent);
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await UsersModel.findOne({ email, password });
        if (!existingUser) {
            return res.status(401).send('Invalid credentials or used does not exist.');
        }
        const token = jwt.sign({ id: existingUser._id, email }, SECRET_KEY, { expiresIn: '15m' });
        res.status(200).send(token);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.patch('/:id', verifyToken, async (req, res) => {
    const userToUpdateId = req.params.id;
    const { firstName, lastName, age, password, email } = req.body;
    try {
        if (userToUpdateId !== req.userId && req.userRole !== Roles.ADMIN) {
            return res.status(403).send('Not allowed to edit this user.');
        }
        const userToUpdate = await UsersModel.findById(userToUpdateId);
        if (!userToUpdate) {
            return res.status(404).send('User to update not found.');
        }
        const updatedUser = await UsersModel.findByIdAndUpdate(userToUpdateId, { firstName, lastName, age, password, email }, { new: true });
        return res.status(200).send(updatedUser);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    const userToDeleteId = req.params.id;
    try {
        const user = await UsersModel.findById(req.userId);
        if (!user) {
            return res.status(404).send('User not found.');
        }
        if (userToDeleteId !== req.userId && req.userRole !== Roles.ADMIN) {
            return res.status(403).send('Operation not allowed.');
        }
        const deletedUser = await UsersModel.findOneAndDelete({ _id: userToDeleteId });
        return res.status(200).send(deletedUser);
    } catch (err) {
        console.log(err);
        res.send(err.message);
    }
});

export default router;
