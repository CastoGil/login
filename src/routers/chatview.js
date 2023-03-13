import express from "express";
const router = express.Router();
router.get("/chat", async (req, res) => {
  res.render("chats", {});
});
export default router;
