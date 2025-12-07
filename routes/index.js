import express from "express";
import authRouter from "./authRoutes.js";
import chatRouter from "./chatRoutes.js";
import { PrismaClient } from "@prisma/client";

const rootRouter = express.Router();

rootRouter.use("/auth",authRouter)
rootRouter.use("/chat",chatRouter)

export const prismaClient = new PrismaClient({
    log:['query']
});

export default rootRouter;