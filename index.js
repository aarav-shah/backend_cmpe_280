import express from "express"
import dotenv from "dotenv";
import rootRouter from "./routes/index.js";
import { globalErrorHandler } from "./error-handler.js";

dotenv.config();

const app = express();
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