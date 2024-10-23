import express from "express";
import cors from "cors";
import "dotenv/config";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import companyRoutes from "./routes/company.routes.js";
import industryRoutes from "./routes/industry.routes.js";
import { authenticateJWT } from "./middleware/auth.js";

const app = express();

const PORT = process.env.PORT || 8080;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:";

app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome to Wrkflw's Server");
});

app.use("/auth", authRoutes);
app.use("/users", authenticateJWT, userRoutes);
app.use("/companies", authenticateJWT, companyRoutes);
app.use("/industries", authenticateJWT, industryRoutes);

app.listen(PORT, () => {
  console.log(`Server running on ${BACKEND_URL}${PORT}`);
});
