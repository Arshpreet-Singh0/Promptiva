import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { handleServicePrompt } from "../controllers/service.controller";

const router : Router = express.Router();

router.route("/parse").post(isAuthenticated, handleServicePrompt);


export default router;