export interface Config {
  displayAllTables?: boolean,
  tables?: {
    displayAllColumns?: boolean;
    editableColumns?: string[];
    name: string;
    visibleColumns?: string[];
  }[];
}
