import express from "express";
import {
    join,
    login,
    PasswordResetRequest,
    passwordReset,
} from "../controller/UserController.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
router.use(express.json());

router.post("/join", join);
router.post("/login", login);
router.post("/reset", PasswordResetRequest);
router.put("/reset", passwordReset);

export default router;
