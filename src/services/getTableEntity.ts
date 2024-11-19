import knex from "../config/database.js";
import { GetTableEntityParams, GetTableEntityQuery } from "../types/openapi.js";
import { generateTypes, tableCheck } from "../utils/db.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Retrieve a specific entity
 * @param params
 * @param query
 */
export async function getTableEntity(
  params: GetTableEntityParams,
  query: GetTableEntityQuery,
): Promise<string> {
  const { tableName } = params;

  const tableColumns = await tableCheck(tableName);

  const columns = await generateTypes(knex, tableName || "table");

  if (!columns) {
    throw new Error("no such columns");
  }

  const primaryKeys = columns
    .filter((value) => value.Key === "PRI")
    .map((value) => value.Field);

  const visibleColumns = columns
    .filter(
      (value) => value.Key === "PRI" || tableColumns.includes(value.Field),
    )
    .map((value) => value.Field);

  const entityQuery: Record<string, any> = {};
  const entityQueryList: string[] = [];
  primaryKeys.forEach((primaryKey) => {
    entityQuery[primaryKey] = query[primaryKey];
    entityQueryList.push(primaryKey + " " + query[primaryKey]);
  });

  const entity = await knex(tableName).where(entityQuery).first();

  if (!entity) {
    throw new Error("no such entity");
  }

  const formHtml = `
  <div>
    <p><a href="/">Back to tables</a></p>
    <p><a href="/tables/${tableName}">Back to table '${tableName}'</a></p>
  </div>
  <div>
    <form action="/tables/${tableName}/entity?${primaryKeys.map((primaryKey) => `${primaryKey}=${encodeURIComponent(entity[primaryKey])}`).join("&")}" method="post">
      ${visibleColumns
        .filter((column) => tableColumns.includes(column))
        .map((column) => {
          return `<div>
            <label for="${column}">${column}</label>
            <input type="text" id="${column}" name="${column}" value="${entity[column]}" ${primaryKeys.includes(column) ? "disabled" : ""}></div>
          `;
        })
        .join("")}
      <button type="submit">Save</button>
    </form>
  </div>
  `;

  return getHtmlPageTemplate(
    `Entity '${entityQueryList.join(", ")}' in table '${params.tableName}'`,
    formHtml,
  );
}
