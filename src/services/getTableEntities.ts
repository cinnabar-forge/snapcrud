import knex from "../config/database.js";
import {
  GetTableEntitiesParams,
  GetTableEntitiesQuery,
} from "../types/openapi.js";
import { generateTypes, tableCheck } from "../utils/db.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Retrieve a list of entities for a specific table
 * @param params
 * @param query
 */
export async function getTableEntities(
  params: GetTableEntitiesParams,
  query: GetTableEntitiesQuery,
): Promise<string> {
  const { tableName } = params;

  const tableColumns = await tableCheck(tableName);

  const limit = parseInt(query.limit) || 30;
  const offset = parseInt(query.offset) || 0;

  const columns = await generateTypes(knex, tableName || "table");

  if (!columns) {
    throw new Error(`failed to get columns in '${tableName}'`);
  }

  const primaryKeys = columns
    .filter((value) => value.Key === "PRI")
    .map((value) => value.Field);

  const visibleColumns = columns
    .filter(
      (value) => value.Key === "PRI" || tableColumns.includes(value.Field),
    )
    .map((value) => value.Field);

  console.log("primaryKeys", primaryKeys);

  const entities = await knex(tableName)
    .select("*")
    .limit(limit)
    .offset(offset);

  const tableHtml = `
  <div>
    <p><a href="/">Back to tables</a></p>
  </div>
  <div>
    <table>
      <thead>
        <tr>
          ${visibleColumns.map((key) => `<th>${key}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${entities
          .map((entity) => {
            return `
            <tr>
              ${visibleColumns.map((key) => `<td>${entity[key]}</td>`).join("")}
              <td>
                <a href="/tables/${tableName}/entity?${primaryKeys.map((primaryKey) => `${primaryKey}=${encodeURIComponent(entity[primaryKey])}`).join("&")}">Edit</a>
              </td>
            </tr>
          `;
          })
          .join("")}
      </tbody>
    </table>
  </div>
  `;

  return getHtmlPageTemplate(`'${params.tableName}' table`, tableHtml);
}
