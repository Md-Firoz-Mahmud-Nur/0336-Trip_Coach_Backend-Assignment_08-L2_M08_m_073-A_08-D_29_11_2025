import { Router } from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserControllers } from "./user.controller";
import { Role } from "./user.interface";
import { createZodSchema, updateUserZodSchema } from "./userValidation";

const router = Router();

router.post(
  "/register",
  validateRequest(createZodSchema),
  UserControllers.createUser
);

router.get("/all-users", checkAuth(Role.ADMIN), UserControllers.getAllUsers);

router.get("/me", checkAuth(...Object.values(Role)), UserControllers.getMe);
router.get(
  "/all-tourist",
  checkAuth(Role.ADMIN),
  UserControllers.getAllTourist
);

router.get(
  "/all-guide",
  checkAuth(Role.ADMIN, Role.TOURIST),
  UserControllers.getAllGuide
);

router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.TOURIST, Role.GUIDE),
  UserControllers.getSingleUser
);

router.patch(
  "/:id",
  validateRequest(updateUserZodSchema),
  checkAuth(...Object.values(Role)),
  UserControllers.updateUser
);

export const UserRoutes = router;
