import knex from "../config/database.js";
import { CreateTableEntityParams } from "../types/openapi.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Create a new entity
 * @param request
 * @param params
 */
export async function createTableEntity(
  request: Record<string, string>,
  params: CreateTableEntityParams,
): Promise<string> {
  const { tableName } = params;
  const dataToInsert = request;

  if (!tableName) {
    throw new Error("Table name is required");
  }

  try {
    const insertedId = await knex(tableName).insert(dataToInsert);

    const entityCreatedData: string[] = [];
    Object.keys(dataToInsert).forEach((key) => {
      entityCreatedData.push(key + ": <b>" + dataToInsert[key] + "</b>");
    });

    const formHtml = `
    <div>
      <p><a href="/">Back to tables</a></p>
      <p><a href="/tables/${tableName}">Back to table '${tableName}'</a></p>
    </div>
    <div>
    <p>The entity has been created successfully:</p>
    <ul>${entityCreatedData.map((value) => "<li>" + value + "</li>").join("")}</ul>
    <p>Inserted ID: ${insertedId}</p>
    </div>
    `;

    return getHtmlPageTemplate(
      `Entity in table '${params.tableName}'`,
      formHtml,
    );
  } catch (error) {
    console.error("Error creating entity:", error);
    throw error;
  }
}
