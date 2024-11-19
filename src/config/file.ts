import { parseCli } from "clivo";
import fs from "fs/promises";

import knex from "../config/database.js";
import { Config } from "../types/config.js";
import { generateTypes } from "../utils/db.js";

let config: Config;
// eslint-disable-next-line sonarjs/no-unused-collection
let tables: string[];
let tableColumns: Record<string, string[]>;

/**
 *
 */
export function getCli() {
  const result = parseCli({
    args: process.argv,
    options: [{ letter: "c", name: "config" }],
  });

  const configPath = result["config"] && result["config"][0];
  if (!configPath) {
    throw new Error("specify --config path");
  }
  return { configPath };
}

/**
 *
 */
export async function getConfig(): Promise<Config> {
  console.log("config", config);
  if (config != null) {
    return config;
  }

  const { configPath } = getCli();

  try {
    config = JSON.parse(await fs.readFile(configPath, "utf8"));
    if (config == null) {
      config = { };
    }
    if (config.tables == null) {
      config.tables = [];
    }
  } catch {
    throw new Error("can't open config file " + configPath);
  }

  tables = [];
  tableColumns = {};

  if (config.displayAllTables) {
    try {
      const tableNames = await knex.raw("SHOW TABLES");
      const tablesList = tableNames[0].map(
        (row: any) => row["Tables_in_" + process.env.SNAPCRUD_DB_NAME],
      );

      for (const tableName of tablesList) {
        console.log(tableName);
        const columns = await generateTypes(knex, tableName);
        if (!columns) {
          continue;
        }
        config.tables.push({ displayAllColumns: true, name: tableName });
        tables.push(tableName);
        tableColumns[tableName] = [];
        for (const column of columns) {
          tableColumns[tableName].push(column.Field);
        }
      }
    } catch {
      throw new Error("file opened, but cannot be parsed " + configPath);
    }
  } else {
    try {
      for (const table of config.tables) {
        tables.push(table.name);
        tableColumns[table.name] = [];
        if (table.visibleColumns) {
          for (const column of table.visibleColumns) {
            tableColumns[table.name].push(column);
          }
        }
        if (table.editableColumns) {
          for (const column of table.editableColumns) {
            if (!tableColumns[table.name].includes(column)) {
              tableColumns[table.name].push(column);
            }
          }
        }
      }
    } catch {
      throw new Error("file opened, but cannot be parsed " + configPath);
    }
  }

  return config;
}

/**
 *
 * @param tableName
 */
export async function getTableColumns(tableName?: string) {
  if (!tableName) {
    return;
  }

  if (tableColumns == null) {
    await getConfig();
  }

  return tableColumns[tableName];
}
