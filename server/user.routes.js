import express from "express";
import getUserProfile from "./user.controller.js";

const router = express.Router();

// Route for fetching my profile with a cat qoute
router
  .route("/me")
  .get(getUserProfile) // read profile

// export the router
export default router;
