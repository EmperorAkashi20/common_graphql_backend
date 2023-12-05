import { User } from "../../../../db/models/user.js";
import ResponseError from "../../../../error_handlers/response-error.js";
import { catchAsync } from "../../../../utils/catchAsync.js";

const service = "USER_MANAGEMENT";

const authQueries = {};

export { authQueries };
