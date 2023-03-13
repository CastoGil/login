import express from "express";
import {
  realTimeAddProduct,
  realTimeDeleteProduct,
  realTimeProduct,
  viewProduct,
} from "../Dao/controllerDb/viewsManager.js";
const router = express.Router();

//Ruta principal vista de los productos
router.get("/", viewProduct);
//Ruta websocket
router.get("/realtimeproducts", realTimeProduct);
router.post("/realtimeproducts", realTimeAddProduct);
router.delete("/realtimeproducts/:pid", realTimeDeleteProduct);

export default router;
