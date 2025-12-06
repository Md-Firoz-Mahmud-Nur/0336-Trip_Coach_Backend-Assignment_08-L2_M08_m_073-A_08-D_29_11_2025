import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../user/user.interface";
import { PackageController } from "./package.controller";
import {
  createPackageZodSchema,
  updatePackageZodSchema,
} from "./package.validation";

const router = express.Router();

router.get("/types", PackageController.getAllPackageTypes);

router.post(
  "/types",
  checkAuth(Role.ADMIN),
  PackageController.createPackageType
);

router.get("/all", PackageController.getAllPackages);

router.post(
  "/create",
  checkAuth(Role.ADMIN),
  validateRequest(createPackageZodSchema),
  PackageController.createPackage
);

router.get("/stats", checkAuth(Role.ADMIN), PackageController.getPackageStats);

router.get("/:id", PackageController.getSinglePackage);

router.patch(
  "/:id",
  checkAuth(Role.ADMIN),
  validateRequest(updatePackageZodSchema),
  PackageController.updatePackage
);

router.delete("/:id", checkAuth(Role.ADMIN), PackageController.deletePackage);

export const packageRoutes = router;
