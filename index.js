import express from "express"
import cors from "cors";
import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import { globalErrorHandler } from "./error-handler.js";

dotenv.config();

const app = express();

// CORS configuration - allow requests from frontend
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "auth-token", "Authorization"]
}));

app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
    res.send("Backend is running");
});

app.set('trust proxy', true); // trust first proxy if behind a proxy like nginx or heroku

app.use('/api',rootRouter);

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});