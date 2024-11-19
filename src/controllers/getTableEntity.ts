import { Request, Response } from "express";

import { getTableEntity } from "../services/getTableEntity.js";
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
    const result: string = await getTableEntity(req.params, req.query);
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
