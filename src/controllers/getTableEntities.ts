import { Request, Response } from "express";

import { getTableEntities } from "../services/getTableEntities.js";
import {
  GetTableEntitiesParams,
  GetTableEntitiesQuery,
} from "../types/openapi.js";

/**
 * Retrieve a list of entities for a specific table
 * @param req
 * @param res
 */
export default async function (
  req: Request<GetTableEntitiesParams, null, unknown, GetTableEntitiesQuery>,
  res: Response<string>,
) {
  try {
    const result: string = await getTableEntities(req.params, req.query);
    res.status(200).contentType("text/html").send(result);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
}
