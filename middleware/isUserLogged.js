import jwt from 'jsonwebtoken';

import { SECRET_KEY } from "../constants.js";
import UsersModel from "../models/Users.js";

export const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
        const verificationResult = jwt.verify(token, SECRET_KEY);
        if (!verificationResult) {
            return res.status(401).send('Invalid token.');
        }
        req.userId = verificationResult.id;
        const user = await UsersModel.findById(req.userId);
        if (!user) {
            return res.status(401).send('User not found.');
        }
        req.userRole = user.role;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).send('Invalid or expired token.');
    }
}

export default verifyToken;