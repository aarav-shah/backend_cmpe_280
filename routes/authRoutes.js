import express from "express";
import { getUserController, loginController, registerController, otpLoginController, otpVerifyController } from "../controllers/authController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { rateLimiter } from "../middlewares/rateLimiter.js";
import { errorHandler } from "../error-handler.js";

const authRouter = express.Router();

authRouter.post('/register', rateLimiter, errorHandler(registerController))
authRouter.post('/login', rateLimiter, errorHandler(loginController))

authRouter.post('/otp-login', rateLimiter, errorHandler(otpLoginController))
authRouter.post('/verify-otp', rateLimiter, errorHandler(otpVerifyController))

authRouter.get('/get-user', rateLimiter, authMiddleware, errorHandler(getUserController))

export default authRouter;