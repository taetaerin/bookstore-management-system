import express from "express";
import { addLike, removeLike } from "../controller/LikeController.js";

const router = express.Router();
router.use(express.json());

router.post("/:id", addLike);
router.delete("/:id", removeLike);

export default router;
