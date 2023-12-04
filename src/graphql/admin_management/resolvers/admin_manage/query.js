import { Admin } from "../../../../db/models/admin.js";
import ResponseError from "../../../../error_handlers/response-error.js";
import { catchAsync } from "../../../../utils/catchAsync.js";
const service = "ADMIN_MANAGEMENT";

const adminManageQueries = {
  getAllSubAdmins: catchAsync(
    async (_root, { limit, next }, { userId, authError, role }) => {
      let subAdmins;
      let endCursor;
      let hasMore;
      let count;
      const errorResponse = new ResponseError(
        true,
        400,
        "subadmins-not-fetched"
      );
      const successResponse = new ResponseError(false, 200);

      if (authError) {
        return { ...errorResponse, message: authError };
      }

      if (!userId) {
        return { ...errorResponse, message: "Please Login to get all admins" };
      }

      if (!role || role !== "admin")
        return {
          ...errorResponse,
          message: "Only Admin can fetch sub admins",
        };

      if (!next) {
        subAdmins = await Admin.find({ role: "sub-admin" }).limit(limit);
      } else {
        subAdmins = await Admin.find({
          _id: { $gt: next },
          role: "sub-admin",
        }).limit(limit);

        count = await Admin.find({
          _id: { $gt: next },
        }).count();
      }

      endCursor =
        subAdmins && subAdmins.length > 0
          ? subAdmins[subAdmins.length - 1]._id
          : null;

      hasMore = count <= limit ? false : true;

      return {
        ...successResponse,
        message: "List of admins",
        data: {
          edges: subAdmins,
          pageInfo: {
            endCursor,
            hasMore,
          },
        },
      };
    },
    service
  ),

  getAdminProfile: catchAsync(async (_root, _params, { userId, authError }) => {
    const errorResponse = new ResponseError(true, 400, "profile-not-fetched");
    const successResponse = new ResponseError(false, 200);

    if (authError) return { ...errorResponse, message: authError };

    if (!userId)
      return { ...errorResponse, message: "Please login to get profile info" };

    const admin = await Admin.findOne({ _id: userId });

    return {
      ...successResponse,
      admin,
      message: "Admin profile",
    };
  }, service),
};

export default adminManageQueries;
