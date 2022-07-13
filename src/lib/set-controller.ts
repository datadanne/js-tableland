import { Connection, WriteQueryResult } from "./connection.js";
import * as tablelandCalls from "./tableland-calls.js";
import * as ethCalls from "./eth-calls.js";

/**
 * Set the Controller contract on a table
 * @returns {string} A Promise that resolves to ???.
 */
export async function setController(
  this: Connection,
  tableId: string,
  controller: string
): Promise<WriteQueryResult> {
  if (this.options.rpcRelay) {
    // Note that since tablelandCalls all use the token, the networks are matched during token creation
    return await tablelandCalls.setController.call(this, tableId, controller);
  }

  // We check the wallet and tableland chains match here again in
  // case the user switched networks after creating a siwe token
  await this.checkNetwork();

  const tableIdInt = parseInt(tableId, 10);
  if (isNaN(tableIdInt)) throw new Error("invalid tableId was provided");

  const txn = await ethCalls.setController.call(this, tableIdInt, controller);

  // match the response schema from the relay
  return { hash: txn.transactionHash };
}
