import Jwt from "jsonwebtoken";
import { phone } from "phone";
import validator from "email-validator";
import logger from "../winston/index.js";
export const calculateAge = (dateOfBirth) => {
  const dob = new Date(dateOfBirth);
  const month_diff = Date.now() - dob.getTime();

  const age_dt = new Date(month_diff);

  const year = age_dt.getUTCFullYear();

  return Math.abs(year - 1970);
};

export const phoneValidator = (phoneNumber) => {
  try {
    if (!phone(phoneNumber).isValid) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    logger.error("Phone Validator");
    logger.error(error.message);
    logger.error(error);
  }
};

export const emailValidator = (email) => {
  if (validator.validate(email)) {
    return true;
  } else {
    return false;
  }
};

export const generateToken = (data) => {
  const accessToken = Jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  const refreshToken = Jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  return { refreshToken, accessToken };
};
