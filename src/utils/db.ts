import "dotenv/config";
import { Knex } from "knex";

import { getTableColumns } from "../config/file.js";

interface GeneratedResultItem {
  Default: string;
  Extra: string;
  Field: string;
  Key: string;
  Null: string;
  Type: string;
}

/**
 * Generate TypeScript types from the database
 * @param knex
 * @param tableName
 */
export async function getColumns(
  knex: Knex,
  tableName: string,
): Promise<GeneratedResultItem[] | undefined> {
  try {
    const columns = await knex.raw(`SHOW COLUMNS FROM ${tableName}`);
    return columns[0];
  } catch (error) {
    console.error("Error generating types:", error);
  }
}

/**
 *
 * @param tableName
 */
export async function tableCheck(tableName?: string) {
  if (!tableName) {
    throw new Error(`no such table '${tableName}'`);
  }

  const tableColumns = await getTableColumns(tableName);

  if (!tableColumns) {
    throw new Error(`table '${tableName}' is inaccessible`);
  }

  return tableColumns;
}
