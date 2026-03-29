import express from "express";
const router = express.Router();

let orders = []; // mock DB

router.post("/", (req, res) => {
  const { items, total } = req.body;

  const newOrder = {
    id: Date.now(),
    items,
    total,
    status: "paid"
  };

  orders.push(newOrder);

  res.json(newOrder);
});

router.get("/", (req, res) => {
  res.json(orders);
});

export default router;