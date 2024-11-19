import { NextFunction, Request, Response } from "express";

import { logger } from "../utils/logger.js";

/**
 *
 * @param req
 * @param res
 * @param next
 */
export function logIncomingRequests(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  logger.http(`Incoming request: ${req.method} ${req.url}`);
  next();
}
