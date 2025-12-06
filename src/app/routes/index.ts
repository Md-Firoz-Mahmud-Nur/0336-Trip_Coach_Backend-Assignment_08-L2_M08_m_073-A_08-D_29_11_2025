import { Router } from "express";
import { authRoutes } from "../modules/auth/auth.route";
import { packageRoutes } from "../modules/package/package.route";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/package",
    route: packageRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
