import { StatusCodes } from "http-status-codes";
import { comparePassword } from "../utils/bcryptUtils.js";
import {
    createUser,
    getUserEmail,
    updateUserPassword,
} from "../services/UserService.js";
import dotenv from "dotenv";
import { generateToken } from "../utils/jwtUtils.js";

dotenv.config();

const join = async (req, res) => {
    const { email, password } = req.body;

    try {
        const results = await createUser(email, password);
        return res.status(StatusCodes.CREATED).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const results = await getUserEmail(email);
        const loginUser = results[0];
        const passwordMatch =
            loginUser && comparePassword(password, loginUser.password);

        if (passwordMatch) {
            const token = generateToken(loginUser);

            res.cookie("token", token, {
                httpOnly: true,
            });
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const PasswordResetRequest = async (req, res) => {
    const { email } = req.body;

    try {
        const results = await getUserEmail(email);
        const user = results[0];

        if (user) {
            return res.status(StatusCodes.OK).json({
                email: email,
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const passwordReset = (req, res) => {
    const { email, password } = req.body;
    try {
        const results = updateUserPassword(email, password);
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

export { join, login, PasswordResetRequest, passwordReset };
