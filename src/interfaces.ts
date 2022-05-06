import { BigNumber, ContractReceipt, Signer } from "ethers";

export interface TableMetadata {
  id: string;
  /* eslint-disable-next-line camelcase */
  created_at?: string;
  description?: string;
  tablename?: string;
  name?: string;
  controller?: string;
  structure?: string;
}

export interface Token {
  token: string;
}

export interface ConnectionOptions {
  token?: Token;
  signer?: Signer;
  host?: string;
  network?: string;
  contract?: string;
}

export interface RpcParams {
  controller?: boolean;
  createStatement?: string;
  description?: string;
  dryrun?: boolean;
  statement?: string;
  tableId?: string;
  txnHash?: string;
}

export interface RpcRequestParam {
  controller?: string;
  /* eslint-disable-next-line camelcase */
  create_statement?: string;
  description?: string;
  dryrun?: boolean;
  id?: string;
  statement?: string;
  /* eslint-disable-next-line camelcase */
  txn_hash?: string;
}

export interface ConnectionReceipt {
  jwsToken: Token;
  ethAccounts: Array<string>;
}

export interface SupportedNetwork {
  key: string;
  phrase: string;
  chainId: number;
}

/**
 * ColumnDescriptor gives metadata about a colum (name, type)
 */
export interface ColumnDescriptor {
  name: string;
}

export type KeyVal<T = any> = [string, T];

export type Column = Array<ColumnDescriptor>;

export type Row = Array<string | number | boolean>;

export interface ReadQueryResult {
  columns: Array<Column>;
  rows: Array<Row>;
}

export interface ReceiptResult {
  /* eslint-disable-next-line camelcase */
  chain_id: number;
  /* eslint-disable-next-line camelcase */
  txn_hash: string;
  /* eslint-disable-next-line camelcase */
  block_number: number;
  error?: string;
}

export interface CreateTableOptions {
  /** A human readable description of the nature and purpoe of the table */
  description?: string;
  /** If your table was minted, but never created on tableland, use this param to create it. */
  id?: string;
  /** do a dry run of create to see if the create statement is valid without creating the table */
  dryrun?: boolean;
}

export interface CreateTableReceipt {
  name: string;
  structureHash: string;
  description?: string;
}

export interface StructureHashReceipt {
  structureHash: string;
}

// TODO: don't think we need this anymore... double check and remove
export interface TableRegistrationReceipt {
  receipt: ContractReceipt;
  tableId: BigNumber;
}

export interface RpcReceipt<T = any> {
  jsonrpc: string;
  id: number;
  result: T;
}

export interface Connection {
  host: string;
  signer: Signer;
  token: Token;
  network: string;
  contract: string;
  list: () => Promise<TableMetadata[]>;
  create: (
    query: string,
    options: CreateTableOptions
  ) => Promise<ContractReceipt>;
  query: (query: string) => Promise<null | ReadQueryResult>;
  hash: (query: string) => Promise<StructureHashReceipt>;
  receipt: (txnHash: string) => Promise<ReceiptResult>;
}
