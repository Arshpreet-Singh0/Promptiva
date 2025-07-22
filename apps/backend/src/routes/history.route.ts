import express, { Router } from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { getAllSessions, getSessionMessages } from "../controllers/history.controller";

const router : Router = express.Router();

router.route("/").get(isAuthenticated, getAllSessions);

router.route("/:sessionId").get(isAuthenticated, getSessionMessages);


export default router;