import { Request, Response } from "express";

import { deleteTableEntity } from "../services/deleteTableEntity.js";
import {
  DeleteTableEntityParams,
  DeleteTableEntityQuery,
} from "../types/openapi.js";

/**
 * Update a specific entity
 * @param req
 * @param res
 */
export default async function (
  req: Request<
    DeleteTableEntityParams,
    null,
    Record<string, string>,
    DeleteTableEntityQuery
  >,
  res: Response<string>,
) {
  try {
    const result: string = await deleteTableEntity(
      req.params,
      req.query,
    );
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
