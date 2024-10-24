import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import industryRoutes from "./routes/industry.routes.js";
import { authenticateJWT } from "./middleware/auth.js";
import { configurePassport } from "./config/passport.js";
import passport from "passport";
import knex from "knex";

const app = express();

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:";

app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.static("public"));
app.use(express.json());

const configuredPassport = configurePassport(knex);
app.use(passport.initialize());

app.get("/", (_req, res) => {
  res.send("Welcome to Wrkflw's Server");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", authenticateJWT, userRoutes);
app.use("/api/companies", authenticateJWT, companyRoutes);
app.use("/api/industries", industryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${BACKEND_URL}${PORT}`);
});
