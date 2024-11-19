export interface GetTableEntitiesParams {
  tableName?: string;
}

export interface GetTableEntitiesQuery {
  limit: string;
  offset: string;
}

export interface GetTableEntityParams {
  tableName?: string;
}

export type GetTableEntityQuery = Record<string, string>;

export interface UpdateTableEntityParams {
  tableName?: string;
}

export type UpdateTableEntityQuery = Record<string, string>;
