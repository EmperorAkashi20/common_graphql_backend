import jwt from "jsonwebtoken";
import { secret } from "../../../../config/environment/index.js";
import bcrypt from "bcrypt";
import ResponseError from "../../../../error_handlers/response-error.js";
import { User } from "../../../../db/models/user.js";
import {
  emailValidator,
  generateToken,
  phoneValidator,
} from "../../../../utils/helper.js";
import { sendOtp, verifyOtp } from "../../../../services/twilio.service.js";
import { catchAsync } from "../../../../utils/catchAsync.js";

const service = "USER_MANAGEMENT";

const authMutation = {
  registerUser: catchAsync(async (_root, { email, password, phoneNumber }) => {
    const errorResponse = new ResponseError(true, 400, "otp-not-sent");
    const successResponse = new ResponseError(false, 200);

    if (!phoneValidator(phoneNumber)) {
      return {
        ...errorResponse,
        message: "Please enter a valid number",
        otpSent: false,
      };
    }

    if (!emailValidator(email)) {
      return {
        ...errorResponse,
        message: "Please enter a valid email",
        otpSent: false,
      };
    }

    let user = await User.findOne({ phoneNumber });

    if (user && user.isMobileVerified) {
      return {
        ...errorResponse,
        message:
          "Phone number associated with another account please filled the details",
        otpSent: false,
      };
    }

    user = await User.findOne({ email });
    if (user && user.isMobileVerified) {
      return {
        ...errorResponse,
        message:
          "Email associated with another account please filled the details",
        otpSent: false,
      };
    }

    sendOtp(phoneNumber);
    return {
      ...successResponse,
      message: `Otp sent to ${phoneNumber}`,
      otpSent: true,
    };
  }, service),
  verifyRegisteredUser: catchAsync(
    async (_root, { email, password, phoneNumber, otp }) => {
      const errorResponse = new ResponseError(true, 400, "user-not-created");
      const successResponse = new ResponseError(false, 200);

      // Validate the OTP
      if (await verifyOtp(phoneNumber, otp)) {
        const user = await User.create({
          email,
          phoneNumber,
          password: await bcrypt.hash(password, 12),
          name: " ",
          isMobileVerified: true,
        });

        return {
          ...successResponse,
          message: "User registation successfull",
          userId: user._id,
        };
      } else {
        return {
          ...errorResponse,
          message: "Otp not verified",
        };
      }
    },
    service
  ),
  userDetails: catchAsync(
    async (_root, { name, dateOfBirth, timeOfBirth, gender, phoneNumber }) => {
      const errorResponse = new ResponseError(true, 400, "token-not-generated");
      const successResponse = new ResponseError(false, 200);

      const user = await User.findOne({ phoneNumber });
      if (!user)
        return {
          ...errorResponse,
          message: `No user found with ${phoneNumber}`,
        };
      if (user.isMobileVerified) {
        user.name = name;
        user.dateOfBirth = new Date(dateOfBirth);
        user.timeOfBirth = timeOfBirth;
        user.gender = gender;
        await user.save();
        const data = { userId: user._id };

        const { accessToken, refreshToken } = generateToken(data);
        return {
          ...successResponse,
          message: "User Registered",
          accessToken,
          refreshToken,
          userID: user._id,
        };
      } else {
        return {
          ...errorResponse,
          message: "Phone number is not verified",
        };
      }
    },
    service
  ),

  loginUser: catchAsync(async (_root, { email, password }) => {
    const errorResponse = new ResponseError(true, 400, "token-not-generated");
    const successResponse = new ResponseError(false, 200);

    const user = await User.findOne({ email });
    if (!user) {
      return {
        ...errorResponse,
        message: "User not found, please signup first",
      };
    }
    if (!(await user.correctPassword(password, user.password)))
      return {
        ...errorResponse,
        message: "Incorrect password",
      };
    const data = { userId: user._id };
    const { accessToken, refreshToken } = generateToken(data);

    return {
      ...successResponse,
      message: "User successfully logged in",
      accessToken,
      refreshToken,
      userID: user._id,
    };
  }, service),
  loginUserWithOtp: catchAsync(async (_root, { phoneNumber, otp }) => {
    const errorResponse = new ResponseError(true, 400, "token-not-generated");
    const successResponse = new ResponseError(false, 200);

    if (!phoneValidator(phoneNumber))
      return {
        ...errorResponse,
        message: "Please enter a correct phone number",
      };
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return {
        ...errorResponse,
        message: "User not found, please signup first",
      };
    }
    if (await verifyOtp(phoneNumber, otp)) {
      const user = await User.findOne({ phoneNumber });
      if (!user.isMobileVerified) {
        return {
          ...errorResponse,
          message: "Mobile Number not verified",
        };
      }
      await user.save();
      const data = { userId: user._id };
      const { accessToken, refreshToken } = generateToken(data);

      return {
        ...successResponse,
        message: "User successfully logged in",
        accessToken,
        refreshToken,
        userID: user._id,
      };
    } else {
      return {
        ...errorResponse,
        message: "Invalid Otp",
      };
    }
  }, service),

  verifyOtp: catchAsync(async (_root, { phoneNumber, otp }) => {
    const errorResponse = new ResponseError(true, 404, "otp-not-verified");
    const successResponse = new ResponseError(false, 200);

    if (await verifyOtp(phoneNumber, otp)) {
      const user = await User.findOne({ phoneNumber });
      if (!user)
        return {
          ...errorResponse,
          message: `No user found with Phone Number ${phoneNumber}`,
          otpVerified: false,
        };
      if (user.isMobileVerified) {
        return {
          ...successResponse,
          message: "OTP verified",
          otpVerified: true,
        };
      } else {
        user.isMobileVerified = true;
        user.updatedAt = Date.now();
        await user.save();
        return {
          ...successResponse,
          message: "Phone number verified",
          otpVerified: true,
        };
      }
    } else {
      return {
        ...errorResponse,
        message: "OTP verified failed",
        otpVerified: false,
      };
    }
  }, service),

  sendOtp: catchAsync(async (_root, { phoneNumber }) => {
    const errorResponse = new ResponseError(true, 400, "otp-not-sent");
    const successResponse = new ResponseError(false, 200);

    if (!phoneValidator(phoneNumber))
      return {
        ...errorResponse,
        message: "Please enter a correct phone number",
        otpSent: false,
      };
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return {
        ...errorResponse,
        message: "User not found, please signup first",
        otpSent: false,
      };
    }
    sendOtp(phoneNumber);
    return {
      ...successResponse,
      otpSent: true,
      message: `OTP sent to ${phoneNumber}`,
    };
  }, service),

  forgotPassword: catchAsync(async (_root, { email, phoneNumber }) => {
    const errorResponse = new ResponseError(true, 400, "otp-not-sent");
    const successResponse = new ResponseError(false, 200);

    let user;
    user = await User.findOne({ email });
    if (!user) {
      user = await User.findOne({ phoneNumber });
      if (!user)
        return { ...errorResponse, message: "No User found", otpSent: false };
    }
    sendOtp(user.phoneNumber);
    return {
      ...successResponse,
      message: `OTP sent to your registered mobile number ${user.phoneNumber}`,
      otpSent: true,
    };
  }, service),

  resetForgotPassword: catchAsync(
    async (_root, { newPassword, confirmPassword, phoneNumber }) => {
      const errorResponse = new ResponseError(
        true,
        400,
        "password-not-changed"
      );
      const successResponse = new ResponseError(false, 200);

      if (newPassword !== confirmPassword) {
        return {
          ...errorResponse,
          message: "New password and confirm password did not match!",
        };
      }

      const user = await User.findOne({ phoneNumber });

      if (!user) return { ...errorResponse, message: "No user found" };

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();

      return { ...successResponse, message: "Password Changed!" };
    },
    service
  ),

  resetPassword: catchAsync(
    async (
      _root,
      { password, newPassword, confirmPassword },
      { userId, authError }
    ) => {
      const errorResponse = new ResponseError(
        true,
        400,
        "password-not-changed"
      );
      const successResponse = new ResponseError(false, 200);

      if (authError) {
        return { ...errorResponse, message: authError };
      }

      if (!userId)
        return { ...errorResponse, message: "Please Login to change password" };

      const user = await User.findOne({ _id: userId });

      if (!user || !(await user.correctPassword(password, user.password))) {
        return { ...errorResponse, message: "Incorrect password" };
      }
      if (newPassword !== confirmPassword) {
        return {
          ...errorResponse,
          message: "New password and confirm password did not match!",
        };
      }

      user.password = await bcrypt.hash(newPassword, 12);
      await user.save();

      return { ...successResponse, message: "Password Changed!" };
    },
    service
  ),

  refreshAccessToken: catchAsync(async (_root, { refreshToken }) => {
    const errorResponse = new ResponseError(true, 403, "token-not-generated");
    const successResponse = new ResponseError(false, 200);

    const { userId } = await new Promise((resolve, reject) => {
      jwt.verify(refreshToken, secret.jwtSecret, (error, payload) => {
        if (error) {
          reject(error);
        } else {
          resolve(payload);
        }
      });
    });
    const data = { userId };
    const tokens = generateToken(data);

    return {
      ...successResponse,
      message: "Token refreshed",
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      userID: userId,
    };
  }, service),
};

// export default authMutation;
export { authMutation };
