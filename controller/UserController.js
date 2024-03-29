import { StatusCodes } from "http-status-codes";
import bcryptUtils from "../utils/bcryptUtils.js";
import UserService from "../services/UserService.js";
import authUtils from "../utils/authUtils.js";
import { validationResult } from "express-validator";

const join = async (req, res) => {
    const { email, password } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

    try {
        const results = await UserService.insertUserInfo(email, password);
        return res.status(StatusCodes.CREATED).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

    try {
        const [loginUser] = await UserService.getUserEmail(email);
        const passwordMatch = loginUser && bcryptUtils.comparePassword(password, loginUser.password);

        if (!passwordMatch) {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }

        const token = authUtils.generateToken(loginUser);

        res.cookie("token", token, { httpOnly: true });
        return res.status(StatusCodes.OK).json({loginUser, token: token});
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const passwordResetRequest = async (req, res) => {
    const { email } = req.body;
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

    try {
        const [user] = await UserService.getUserEmail(email);

        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }

        return res.status(StatusCodes.OK).json({ email: email });
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const passwordReset = async (req, res) => {
    const { email, password } = req.body;
    const result = validationResult(req);
    
    if (!result.isEmpty()) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }

    try {
        const results = await UserService.updateUserPassword(email, password);

        if (results.affectedRows == 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

export { join, login, passwordResetRequest, passwordReset };
