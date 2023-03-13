import express from "express";
import {
  processLoginForm,
  showRegisterForm,
  showLoginForm,
  processRegisterForm,
  closeSession

} from "../Dao/controllerDb/userManager.js";
const router = express.Router();


router.get("/register", showRegisterForm);
router.post("/register", processRegisterForm);

//ruta de login
router.get("/login", showLoginForm);
router.post("/login",  processLoginForm);
router.get("/logout", closeSession)
export default router;