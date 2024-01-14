import userRouter from "./UserRouter.js";
import bookRouter from "./BookRouter.js";
import cartRouter from "./CartRouter.js";
import likeRouter from "./LikeRouter.js";
import orderRouter from "./OrderRouter.js";
import categoryRouter from "./CategoryRouter.js";
import express from "express";

const router = express.Router();

router.use("/users", userRouter);
router.use("/books", bookRouter);
router.use("/carts", cartRouter);
router.use("/likes", likeRouter);
router.use("/orders", orderRouter);
router.use("/category", categoryRouter);

export default router;