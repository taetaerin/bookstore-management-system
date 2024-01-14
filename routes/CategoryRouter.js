import express from "express";
import { allCategory } from "../controller/CategoryController.js";

const router = express.Router();
router.use(express.json());

router.get("/", allCategory);

export default router;
