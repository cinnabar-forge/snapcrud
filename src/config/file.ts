import { parseCli } from "clivo";
import fs from "fs/promises";

import { Config } from "../types/config.js";

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
      config = [];
    }
  } catch {
    throw new Error("can't open config file " + configPath);
  }

  try {
    tables = [];
    tableColumns = {};
    for (const table of config) {
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