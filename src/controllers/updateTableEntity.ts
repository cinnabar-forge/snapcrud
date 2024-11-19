import { Request, Response } from "express";

import { updateTableEntity } from "../services/updateTableEntity.js";
import {
  UpdateTableEntityParams,
  UpdateTableEntityQuery,
} from "../types/openapi.js";

/**
 * Update a specific entity
 * @param req
 * @param res
 */
export default async function (
  req: Request<
    UpdateTableEntityParams,
    null,
    Record<string, string>,
    UpdateTableEntityQuery
  >,
  res: Response<string>,
) {
  try {
    const result: string = await updateTableEntity(
      req.body,
      req.params,
      req.query,
    );
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
