import logger from "../winston/index.js";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const sendOtp = async (phone) => {
  try {
    const result = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phone, channel: "sms" });
  } catch (error) {
    logger.error("Twilio Validator");
    logger.error(error.message);
    logger.error(error);
  }
};

export const verifyOtp = async (phone, otp) => {
  try {
    const result = await client.verify.v2
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phone, code: otp });

    return result.status === "approved" ? true : false;
  } catch (error) {
    logger.error("Twilio Validator");
    logger.error(error.message);
    logger.error(error);
  }
};
