import { Admin } from "../../../../db/models/admin.js";
import ResponseError from "../../../../error_handlers/response-error.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../../../utils/helper.js";
import Jwt from "jsonwebtoken";
const service = "ADMIN_MANAGEMENT";

const adminManageMutations = {
  testMut: () => "Test mutation",

  createAdmin: catchAsync(
    async (_root, { userName, email, password, profilePicture }) => {
      const errorResponse = new ResponseError(
        true,
        400,
        "error-creating-admin"
      );
      const successResponse = new ResponseError(false, 200);
      const admin = await Admin.create({
        userName,
        email,
        password: await bcrypt.hash(password, 12),
        role: "admin",
        permissionOne: true,
        permissionTwo: true,
        permissionThree: true,
        profilePicture,
      });

      if (!admin) return { ...errorResponse, message: "Error Creating admin" };

      return {
        ...successResponse,
        message: "Successfully created Admin",
        userID: admin._id,
      };
    },
    service
  ),
  adminLogin: catchAsync(async (_root, { userName, password }) => {
    const errorResponse = new ResponseError(true, 400, "token-not-generated");
    const successResponse = new ResponseError(false, 200);

    const admin = await Admin.findOne({ userName });

    if (!admin) return { ...errorResponse, message: "No admin found" };

    if (!admin.correctPassword(password, admin.password)) {
      return { ...errorResponse, message: "No admin found" };
    }

    const data = { userId: admin._id, role: admin.role };

    const accessToken = Jwt.sign(data, process.env.JWT_SECRET);

    return {
      ...successResponse,
      message: "Login successfull",
      userID: admin._id,
      accessToken,
    };
  }, service),

  registerSubAdmin: catchAsync(
    async (
      _root,
      {
        userName,
        email,
        password,
        permissionOne,
        permissionTwo,
        permissionThree,
        profilePicture,
      },
      { userId, authError, role }
    ) => {
      const errorResponse = new ResponseError(
        true,
        400,
        "subadmin-not-created"
      );
      const successResponse = new ResponseError(false, 200);

      if (authError) {
        return { ...errorResponse, message: authError };
      }

      if (!userId)
        return { ...errorResponse, message: "Please Login to change password" };

      if (!role || role !== "admin")
        return {
          ...errorResponse,
          message: "Only Admin can create sub admins",
        };

      let subAdmin;

      subAdmin = await Admin.findOne({ userName });

      if (subAdmin)
        return {
          ...errorResponse,
          message: "Username already taken!",
        };

      subAdmin = await Admin.create({
        userName,
        email,
        password: await bcrypt.hash(password, 12),
        permissionOne,
        permissionTwo,
        permissionThree,
        profilePicture,
      });

      if (!subAdmin) {
        return {
          ...errorResponse,
          message: "Error Creating Sub admin",
        };
      }

      return {
        ...successResponse,
        message: "Successfully created sub admin",
        userID: subAdmin._id,
      };
    },
    service
  ),

  updateSubAdmin: catchAsync(
    async (
      _root,
      {
        subadminId,
        name,
        email,
        permissionOne,
        permissionTwo,
        permissionThree,
        profilePicture,
      },
      { userId, authError, role }
    ) => {
      const errorResponse = new ResponseError(
        true,
        500,
        "sub-admin-not-updated"
      );
      const successResponse = new ResponseError(false, 200);

      const subAdmin = await Admin.findOne({ _id: subadminId });

      if (authError) {
        return { ...errorResponse, message: authError };
      }

      if (!userId)
        return { ...errorResponse, message: "Please Login to edit admin" };

      if (!role || role !== "admin")
        return {
          ...errorResponse,
          message: "Only Admin can update sub admins",
        };

      if (!subAdmin)
        return {
          ...errorResponse,
          message: "No Subadmin found with that id",
        };

      const editedSubadmin = await Admin.findByIdAndUpdate(subadminId, {
        name,
        email,
        permissionOne,
        permissionTwo,
        permissionThree,
        profilePicture,
      });

      return {
        ...successResponse,
        message: "Admin edited",
        userID: editedSubadmin._id,
      };
    },
    service
  ),

  deleteSubAdmin: catchAsync(
    async (_root, { subAdminId }, { authError, role, userId }) => {
      const errorResponse = new ResponseError(
        true,
        500,
        "sub-admin-not-deleted"
      );
      const successResponse = new ResponseError(false, 200);

      if (authError) {
        return { ...errorResponse, message: authError };
      }

      if (!userId)
        return { ...errorResponse, message: "Please Login to delte admin" };

      if (!role || role !== "admin")
        return {
          ...errorResponse,
          message: "Only Admin can delete sub admins",
        };

      Admin.findOneAndDelete({ _id: subAdminId });

      return {
        ...successResponse,
        message: "Sub admin deleted",
      };
    },
    service
  ),

  updatePassword: catchAsync(
    async (_root, { newPassword, subAdminId }, { authError, role, userId }) => {
      const errorResponse = new ResponseError(
        true,
        500,
        "password-not-changed"
      );
      const successResponse = new ResponseError(false, 200);

      if (authError) {
        return { ...errorResponse, message: authError };
      }

      if (!userId)
        return { ...errorResponse, message: "Please Login to delte admin" };

      if (!role || role !== "admin")
        return {
          ...errorResponse,
          message: "Only Admin can change password",
        };

      const subAdmin = Admin.findOne({ _id: subAdminId });

      if (!subAdmin) return { ...errorResponse, message: "No admin found" };

      subAdmin.password = bcrypt.hash(newPassword, 12);
      await subAdmin.save();

      return {
        ...successResponse,
        message: "password changed!",
        userID: subAdmin._id,
      };
    },
    service
  ),
};

export default adminManageMutations;
