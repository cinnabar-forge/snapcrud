import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.simple(),
  level: process.env.SNAPCRUD_LOGGER_LEVEL || "verbose",
  transports: [new winston.transports.Console()],
});

export { logger };
