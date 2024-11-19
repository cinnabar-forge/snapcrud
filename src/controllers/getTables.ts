import { Request, Response } from "express";

import { getTables } from "../services/getTables.js";

/**
 * Retrieve a list of available tables
 * @param req
 * @param res
 */
export default async function (
  req: Request<unknown, null, unknown, unknown>,
  res: Response<string>,
) {
  try {
    const result: string = await getTables();
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
