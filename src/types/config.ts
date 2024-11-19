export interface Config {
  tables: {
    displayAllColumns: boolean;
    editableColumns: string[];
    name: string;
    visibleColumns: string[];
  }[];
}
