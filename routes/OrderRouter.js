import express from "express";
import { body } from "express-validator";
import {
    order,
    getOrders,
    getOrderDetail,
} from "../controller/OrderController.js";

const router = express.Router();
router.use(express.json());

router.post(
    "/", 
    [
        body("items").exists().notEmpty(),
        body("delivery").exists().notEmpty(),
        body("totalQuantity").exists().notEmpty(),
        body("totalPrice").exists().notEmpty(),
        body("firstBookTitle").exists().notEmpty()
    ]
    ,order);
router.get("/", getOrders);
router.get("/:id", getOrderDetail);

export default router;
