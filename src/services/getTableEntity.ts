import knex from "../config/database.js";
import { GetTableEntityParams, GetTableEntityQuery } from "../types/openapi.js";
import { getColumns, tableCheck } from "../utils/db.js";
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

  const columns = await getColumns(knex, tableName || "table");

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
          const columnType = columns.find((c) => c.Field === column)?.Type;
          let inputType = "text";
          let inputAttributes = "";

          let columnValue = entity[column];

          if (columnType == null) {
            inputType = "text";
          } else if (
            columnType.includes("int") ||
            columnType.includes("tinyint")
          ) {
            inputType = "number";
          } else if (
            columnType.includes("datetime") ||
            columnType.includes("timestamp")
          ) {
            const date = columnValue as Date;
            if (date && date.toISOString) {
              columnValue = date.toISOString().slice(0, 16);
            }
            inputType = "datetime-local";
            inputAttributes = `value="${columnValue}"`;
            return `
              <div>
                <p><label for="${column}">${column}</label></p>
                <input type="${inputType}" id="${column}" name="${column}" ${inputAttributes} ${primaryKeys.includes(column) ? "disabled" : ""}>
              </div>
            `;
          } else if (columnType.includes("enum")) {
            const enumValues = columnType
              .replace("enum(", "")
              .replace(")", "")
              .split(",");
            inputAttributes = `value="${entity[column]}"`;
            return `
              <div>
                <p><label for="${column}">${column}</label></p>
                <select id="${column}" name="${column}" ${primaryKeys.includes(column) ? "disabled" : ""}>
                  ${enumValues.map((value) => `<option value="${value}" ${entity[column] === value ? "selected" : ""}>${value}</option>`).join("")}
                </select>
              </div>
            `;
          } else if (columnType.includes("bool")) {
            inputType = "checkbox";
            inputAttributes = `value="${entity[column]}" ${entity[column] === 1 ? "checked" : ""}`;
          }

          return `
            <div>
              <p><label for="${column}">${column}</label></p>
              <input type="${inputType}" id="${column}" name="${column}" value="${columnValue}" autocomplete="off" ${primaryKeys.includes(column) ? "disabled" : ""} ${inputAttributes}>
            </div>
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
