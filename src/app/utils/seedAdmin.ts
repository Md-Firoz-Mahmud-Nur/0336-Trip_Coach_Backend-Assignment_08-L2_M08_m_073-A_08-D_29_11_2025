import bcryptjs from "bcryptjs";
import { envVariables } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await User.findOne({
      email: envVariables.ADMIN_EMAIL,
    });

    if (isAdminExist) {
      return;
    }

    const hashedPassword = await bcryptjs.hash(
      envVariables.ADMIN_PASSWORD,
      Number(envVariables.BCRYPT_SALT_ROUND)
    );

    const authProvider: IAuthProvider = {
      provider: "credentials",
      providerId: envVariables.ADMIN_EMAIL,
    };

    const payload: IUser = {
      name: "Admin",
      role: Role.ADMIN,
      email: envVariables.ADMIN_EMAIL,
      password: hashedPassword,
      isVerified: true,
      auths: [authProvider],
    };

    const Admin = await User.create(payload);
    console.log(Admin);
  } catch (error) {
    console.log(error);
  }
};
