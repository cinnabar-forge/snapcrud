import knex from "../config/database.js";
import { GetTableEntityParams } from "../types/openapi.js";
import { getColumns, tableCheck } from "../utils/db.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Create a new entity
 * @param params
 */
export async function getTableCreateEntityPage(
  params: GetTableEntityParams,
): Promise<string> {
  const { tableName } = params;

  const tableColumns = await tableCheck(tableName);

  const columns = await getColumns(knex, tableName || "table");

  if (!columns) {
    throw new Error("no such columns");
  }

  const autoIncrementColumns = columns
    .filter((value) => value.Extra === "auto_increment")
    .map((value) => value.Field);

  const visibleColumns = columns
    .filter(
      (value) => value.Key === "PRI" || tableColumns.includes(value.Field),
    )
    .map((value) => value.Field);

  const formHtml = `
  <div>
    <p><a href="/">Back to tables</a></p>
    <p><a href="/tables/${tableName}">Back to table '${tableName}'</a></p>
  </div>
  <div>
    <form action="/tables/${tableName}/create" method="post">
      ${visibleColumns
        .filter((column) => tableColumns.includes(column))
        .map((column) => {
          const columnType = columns.find((c) => c.Field === column)?.Type;
          let inputType = "text";
          let inputAttributes = "";
          let inputElement = "";

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
            inputType = "datetime-local";
            inputAttributes = `value="${new Date().toISOString().slice(0, 16)}"`;
            inputElement = `
              <input type="${inputType}" id="${column}" name="${column}" ${inputAttributes} ${autoIncrementColumns.includes(column) ? "disabled" : ""}>
            `;
          } else if (columnType.includes("enum")) {
            const enumValues = columnType
              .replace("enum(", "")
              .replace(")", "")
              .split(",");
            inputAttributes = `value="${enumValues[0]}"`;
            inputElement = `
              <select id="${column}" name="${column}" ${autoIncrementColumns.includes(column) ? "disabled" : ""}>
                ${enumValues.map((value) => `<option value="${value}" ${value === enumValues[0] ? "selected" : ""}>${value}</option>`).join("")}
              </select>
            `;
          } else if (columnType.includes("bool")) {
            inputType = "checkbox";
            inputAttributes = `value="1"`;
          } else {
            inputElement = `
              <input type="${inputType}" id="${column}" name="${column}" value="" autocomplete="off" ${autoIncrementColumns.includes(column) ? "disabled" : ""} ${inputAttributes}>
            `;
          }

          if (!inputElement) {
            inputElement = `
              <input type="${inputType}" id="${column}" name="${column}" autocomplete="off" ${autoIncrementColumns.includes(column) ? "disabled" : ""} ${inputAttributes}>
            `;
          }

          return `
            <div>
              <p><label for="${column}">${column} - ${columnType}</label></p>
              ${inputElement}
            </div>
          `;
        })
        .join("")}    
      <button type="submit">Create</button>
    </form>
  </div>
  `;

  return getHtmlPageTemplate(
    `Create new entity in table '${params.tableName}'`,
    formHtml,
  );
}
