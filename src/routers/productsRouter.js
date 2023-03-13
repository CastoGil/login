import express from "express";
const router = express.Router()
import {
  addProduct,
  allProducts,
  productId,
  updatedProduct,
  deleteProduct,
} from "../Dao/controllerDb/productsManager.js";



//Rutas de Productos//
router.get("/", allProducts);
router.get("/:pid", productId);
router.post("/", addProduct);
router.put("/:pid", updatedProduct);
router.delete("/:pid", deleteProduct);

export default router;
