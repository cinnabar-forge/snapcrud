import knex from "../config/database.js";
import {
  DeleteTableEntityParams,
  DeleteTableEntityQuery,
} from "../types/openapi.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Delete a specific entity
 * @param params
 * @param query
 */
export async function deleteTableEntity(
  params: DeleteTableEntityParams,
  query: DeleteTableEntityQuery,
): Promise<string> {
  const { tableName } = params;
  const primaryKeys = query;

  if (!tableName) {
    throw new Error("Table name is required");
  }

  try {
    const deletedRows = await knex(tableName)
      .where(primaryKeys)
      .del();

    if (deletedRows === 0) {
      throw new Error("No rows deleted");
    }

    const entityId: string[] = [];
    Object.keys(primaryKeys).forEach((primaryKey) => {
      entityId.push(primaryKey + " " + primaryKeys[primaryKey]);
    });

    const formHtml = `
    <div>
      <p><a href="/">Back to tables</a></p>
      <p><a href="/tables/${tableName}">Back to table '${tableName}'</a></p>
    </div>
    <div>
    <p>The entity has been deleted successfully:</p>
    <p>Entity ID: ${entityId.join(", ")}</p>
    </div>
    `;

    return getHtmlPageTemplate(
      `Entity '${entityId.join(", ")}' in table '${params.tableName}'`,
      formHtml,
    );
  } catch (error) {
    console.error("Error deleting entity:", error);
    throw error;
  }
}
