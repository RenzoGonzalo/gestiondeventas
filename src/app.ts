import express from "express";
import dotenv from "dotenv";
import authRouter from "./modules/users/presentation/authRouter";
import companyRouter from "./modules/companies/presentation/companyRouter";

dotenv.config();

const app = express();

app.use(express.json());
app.use("/auth", authRouter);
app.use("/companies", companyRouter);
const port = Number(process.env.PORT) || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});