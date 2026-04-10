import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./modules/users/presentation/authRouter";
import sellersRouter from "./modules/users/presentation/sellersRouter";
import superRouter from "./modules/users/presentation/superRouter";
import companyRouter from "./modules/companies/presentation/companyRouter";
import inventoryRouter from "./modules/inventory/presentation/inventoryRouter";
import salesRouter from "./modules/sales/presentation/salesRouter";
import reportsRouter from "./modules/reports/presentation/reports.routes";

dotenv.config();

const app = express();

// Simplificamos la lógica del CORS
const corsOrigin = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: ["https://gestionventasfrontend.vercel.app", "http://localhost:5173"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/store-admin/sellers", sellersRouter);
app.use("/api/super", superRouter);
app.use("/companies", companyRouter);
app.use("/api", inventoryRouter);
app.use("/api/sales", salesRouter);
app.use("/api/reports", reportsRouter);
const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});   