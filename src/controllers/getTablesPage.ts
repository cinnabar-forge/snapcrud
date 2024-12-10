import { Request, Response } from "express";

import { getTablesPage } from "../services/getTablesPage.js";

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
    const result: string = await getTablesPage();
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
