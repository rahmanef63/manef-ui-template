export type TableNames = string;

export type Id<TableName extends string> = string & {
  __tableName?: TableName;
};

export type Doc<TableName extends TableNames> = Record<string, unknown> & {
  _id: Id<TableName>;
};

export type DataModel = Record<string, never>;
