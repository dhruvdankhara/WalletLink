import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import errorHandler from "./middlewares/error.middleware.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

import userRoute from "./routes/user.routes.js";
import accountRoute from "./routes/account.routes.js";
import colorRoute from "./routes/colors.routes.js";
import iconRoute from "./routes/icons.routes.js";
import memberRoute from "./routes/members.routes.js";
import categoriesRoute from "./routes/category.routes.js";
import transactionRoute from "./routes/transactions.routes.js";
import dashboardRoute from "./routes/dashboard.routes.js";

app.use("/api/v1/users", userRoute);
app.use("/api/v1/accounts", accountRoute);
app.use("/api/v1/colors", colorRoute);
app.use("/api/v1/icons", iconRoute);
app.use("/api/v1/members", memberRoute);
app.use("/api/v1/categories", categoriesRoute);
app.use("/api/v1/transactions", transactionRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.use(errorHandler);

export default app;
