import knex from "../config/database.js";
import {
  GetTableEntitiesParams,
  GetTableEntitiesQuery,
} from "../types/openapi.js";
import { getColumns, tableCheck } from "../utils/db.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Retrieve a list of entities for a specific table
 * @param params
 * @param query
 */
export async function getTableEntitiesPage(
  params: GetTableEntitiesParams,
  query: GetTableEntitiesQuery,
): Promise<string> {
  const { tableName } = params;

  const tableColumns = await tableCheck(tableName);

  const limit = parseInt(query.limit) || 30;
  const offset = parseInt(query.offset) || 0;

  const columns = await getColumns(knex, tableName || "table");

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

  const entities = await knex(tableName)
    .select("*")
    .limit(limit)
    .offset(offset);

  const tableHtml = `
  <div>
    <p><a href="/">Back to tables</a></p>
    <p><a href="/tables/${tableName}/create">Create a new entity</a></p>
  </div>
  <div class="chonk">
    <table>
      <thead>
        <tr>
          ${visibleColumns.map((key) => `<th>${key}</th>`).join("")}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        ${entities
          .map((entity) => {
            return `
            <tr>
              ${visibleColumns.map((key) => `<td>${entity[key]}</td>`).join("")}
              <td>
                <a href="/tables/${tableName}/update?${primaryKeys.map((primaryKey) => `${primaryKey}=${encodeURIComponent(entity[primaryKey])}`).join("&")}">Edit</a>
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
