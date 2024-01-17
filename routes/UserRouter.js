import express from "express";
import { join, login, passwordResetRequest, passwordReset } from "../controller/UserController.js";
import dotenv from "dotenv";
import { body } from "express-validator";

dotenv.config();

const router = express.Router();
router.use(express.json());

const validateEmailAndPassword = [
    body("email").exists().notEmpty(),
    body("password").exists().notEmpty(),
];

router.post("/join", validateEmailAndPassword, join);
router.post("/login", validateEmailAndPassword, login);
router.post("/reset", [body("email").exists().notEmpty()], passwordResetRequest);
router.put("/reset", validateEmailAndPassword, passwordReset);

export default router;
