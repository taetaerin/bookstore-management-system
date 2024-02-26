import express from "express";
import dotenv from "dotenv";
import routes from "./routes/index.js"
import cors from 'cors';

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(routes)

app.listen(process.env.PORT);