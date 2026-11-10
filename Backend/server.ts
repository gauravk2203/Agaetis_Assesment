import express from "express";
import { configDotenv } from "dotenv";
import employeeRoutes from "./routes/employee.route";
import cors from "cors";

configDotenv();

const PORT = Number(process.env.PORT) || 8000;

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));
app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({
    message: "Server is running successfully",
  });
});

app.use("/api/employees", employeeRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});