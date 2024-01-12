import userRouter from "./routes/users.js";
import bookRouter from "./routes/books.js";
import cartRouter from "./routes/carts.js";
import likeRouter from "./routes/likes.js";
import orderRouter from "./routes/orders.js";
import categoryRouter from "./routes/category.js";
import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/carts", cartRouter);
app.use("/likes", likeRouter);
app.use("/orders", orderRouter);
app.use("/category", categoryRouter);

app.listen(process.env.PORT);
