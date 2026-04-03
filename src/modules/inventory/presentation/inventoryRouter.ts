import { Router } from "express";
import categoriesRouter from "./categoriesRouter";
import productsRouter from "./productsRouter";
import variantsRouter from "./variantsRouter";
import sellerRouter from "./sellerRouter";

const router = Router();

router.use("/categories", categoriesRouter);
router.use("/products", productsRouter);
router.use("/variants", variantsRouter);
router.use("/seller", sellerRouter);

export default router;
