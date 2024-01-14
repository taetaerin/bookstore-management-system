import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js"

dotenv.config();
const app = express();

app.use(routes)

app.listen(process.env.PORT);