import express from "express";
import { allBooks, bookDetail } from "../controller/BookController.js";
import { query } from "express-validator";
const router = express.Router();
router.use(express.json());

router.get("/", 
    [
        query("limit").exists().notEmpty(), 
        query("currentPage").exists().notEmpty()
    ]
    , allBooks
);

router.get("/:id", bookDetail);

export default router;
