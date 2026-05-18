import cors from "cors";
import express from "express";
import helmet from "helmet";
import { allowedOrigins } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { authRouter } from "./routes/auth.routes";
import { leadRouter } from "./routes/lead.routes";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "GigFlow API is healthy"
  });
});

app.use("/api/auth", authRouter);
app.use("/api/leads", leadRouter);

app.use(notFound);
app.use(errorHandler);
