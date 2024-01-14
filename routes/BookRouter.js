import express from "express";
import { allBooks, bookDetail } from "../controller/BookController.js";

const router = express.Router();
router.use(express.json());

router.get("/", allBooks);
router.get("/:id", bookDetail);

export default router;
