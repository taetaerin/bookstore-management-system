import express from "express";
import {
    addToCart,
    getCartItems,
    removeCartItem,
} from "../controller/CartController.js";

const router = express.Router();
router.use(express.json());

router.post("/", addToCart);
router.get("/", getCartItems);
router.delete("/:id", removeCartItem);

export default router;
