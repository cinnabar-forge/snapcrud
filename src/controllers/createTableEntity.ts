import { Request, Response } from "express";

import { createTableEntity } from "../services/createTableEntity.js";
import { CreateTableEntityParams } from "../types/openapi.js";

/**
 * Update a specific entity
 * @param req
 * @param res
 */
export default async function (
  req: Request<CreateTableEntityParams, null, Record<string, string>, unknown>,
  res: Response<string>,
) {
  try {
    const result: string = await createTableEntity(req.body, req.params);
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
