import { createLogger, format, transports } from "winston";

const { combine, timestamp, prettyPrint, printf, colorize } = format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${level}] ${timestamp} ${message}`;
});

export const developmentLogger = () => {
  return createLogger({
    level: "debug",
    format: combine(
      colorize(),
      prettyPrint(),
      timestamp({ format: "hh:mm:ss" }),
      myFormat
    ),
    transports: [new transports.Console()],
  });
};

export const productionLogger = () => {
  return createLogger({
    level: "info",
    format: combine(timestamp(), myFormat),
    transports: [new transports.File({ filename: "logger.log" })],
  });
};
