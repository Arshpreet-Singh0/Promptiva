import express, { Router } from "express";
import { register, login, logout, verifyUser } from "../controllers/auth.controller";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { rateLimit } from 'express-rate-limit'

const router : Router = express.Router();


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	limit: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
    message: {
        success: false,
        message: "Too many requests, please try again later."
    }
})


router.route('/register').post(register);

router.route('/login').post(limiter, login);

router.route('/verify').get(isAuthenticated, verifyUser);

router.route('/logout').post(isAuthenticated, logout);

export default router;