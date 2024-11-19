import knex from "../config/database.js";
import {
  UpdateTableEntityParams,
  UpdateTableEntityQuery,
} from "../types/openapi.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Update a specific entity
 * @param request
 * @param params
 * @param query
 */
export async function updateTableEntity(
  request: Record<string, string>,
  params: UpdateTableEntityParams,
  query: UpdateTableEntityQuery,
): Promise<string> {
  const { tableName } = params;
  const primaryKeys = query;
  const dataToUpdate = request;

  const entityId: string[] = [];
  Object.keys(primaryKeys).forEach((primaryKey) => {
    entityId.push(primaryKey + " " + primaryKeys[primaryKey]);
  });

  const entityUpdatedData: string[] = [];
  Object.keys(dataToUpdate).forEach((key) => {
    entityUpdatedData.push(key + ": <b>" + dataToUpdate[key] + "</b>");
  });

  if (!tableName) {
    throw new Error("Table name is required");
  }

  try {
    const updatedRows = await knex(tableName)
      .where(primaryKeys)
      .update(dataToUpdate);

    if (updatedRows === 0) {
      throw new Error("No rows updated");
    }

    const formHtml = `
    <div>
      <p><a href="/">Back to tables</a></p>
      <p><a href="/tables/${tableName}">Back to table '${tableName}'</a></p>
    </div>
    <div>
    <p>The entity has been updated successfully:</p>
    <ul>${entityUpdatedData.map((value) => "<li>" + value + "</li>").join("")}</ul>
    </div>
    `;

    return getHtmlPageTemplate(
      `Entity '${entityId.join(", ")}' in table '${params.tableName}'`,
      formHtml,
    );
  } catch (error) {
    console.error("Error updating entity:", error);
    throw error;
  }
}
