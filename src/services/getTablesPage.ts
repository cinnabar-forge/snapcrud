import { getConfig } from "../config/file.js";
import { tableCheck } from "../utils/db.js";
import { getHtmlPageTemplate } from "../utils/html.js";

/**
 * Retrieve a list of available tables
 */
export async function getTablesPage(): Promise<string> {
  const config = await getConfig();

  const tablesHtml = config.tables
    ? (
        await Promise.all(
          config.tables.map(async (tableConfig) => {
            const tableColumns = await tableCheck(tableConfig.name);
            return `<a href="/tables/${tableConfig.name}">${tableConfig.name}</a> (${tableColumns.join(", ")})`;
          }),
        )
      ).join("<br>")
    : "";

  return getHtmlPageTemplate("Tables", `<div>${tablesHtml}</div>`);
}
