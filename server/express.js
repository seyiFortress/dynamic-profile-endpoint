import express from "express";
import cors from "cors";
import userRoutes from "./user.routes.js";
import "dotenv/config";

const app = express();

// ** Middleware **
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ** Routes **
app.use("/api", userRoutes); // Mount user routes

// ** export configured App **
export default app;
