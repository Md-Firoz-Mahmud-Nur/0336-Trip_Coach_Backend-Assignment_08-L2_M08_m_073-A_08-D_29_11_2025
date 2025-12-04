import { Router } from "express";

const router = Router();

router.get("/test", (req, res) => {
  res.send("User Route");
});

export const UserRoutes = router;
