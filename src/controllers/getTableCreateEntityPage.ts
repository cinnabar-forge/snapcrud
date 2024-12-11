import { Request, Response } from "express";

import { getTableCreateEntityPage } from "../services/getTableCreateEntityPage.js";
import { GetTableEntityParams, GetTableEntityQuery } from "../types/openapi.js";

/**
 * Retrieve a specific entity
 * @param req
 * @param res
 */
export default async function (
  req: Request<GetTableEntityParams, null, unknown, GetTableEntityQuery>,
  res: Response<string>,
) {
  try {
    const result: string = await getTableCreateEntityPage(req.params);
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
