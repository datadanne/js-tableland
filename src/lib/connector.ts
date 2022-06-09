import { Signer, ethers } from "ethers";
import { ConnectionOptions, Connection, Token } from "../interfaces.js";
import { list } from "./list.js";
import { createToken } from "./token.js";
import { read, write } from "./query.js";
import { create } from "./create.js";
import { hash } from "./hash.js";
import { receipt } from "./tableland-calls.js";
import { SUPPORTED_NETWORKS, contractAddresses } from "./util.js";

declare let globalThis: any;

export async function getSigner(): Promise<Signer> {
  await globalThis.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.providers.Web3Provider(globalThis.ethereum);
  const signer = provider.getSigner();
  return signer;
}

export async function userCreatesToken(
  signer: Signer,
  chainId: number
): Promise<Token> {
  const now = Date.now();
  const exp = new Date(now + 10 * 60 * 60 * 1000).toISOString(); // Default to ~10 hours

  return await createToken(signer, {
    chainId: chainId,
    expirationTime: exp,
    uri: globalThis.document?.location.origin,
    version: "1",
    statement: "Official Tableland SDK",
  });
}

export async function connect(options: ConnectionOptions): Promise<Connection> {
  const network = options.network ?? "goerli";
  const host = options.host ?? "https://testnetv2.tableland.network";
  const contract = options.contract ?? contractAddresses[network];

  if (network !== "goerli" && !options.host) {
    throw Error(
      "Please specify a host connection (e.g. https://testnetv2.tableland.network)"
    );
  }

  const signer = options.signer ?? (await getSigner());
  const providerNetwork = await signer.provider?.getNetwork();

  if (
    !providerNetwork?.name ||
    !SUPPORTED_NETWORKS.find((net) => {
      return (
        net.key === providerNetwork.name ||
        net.chainId === providerNetwork.chainId
      );
    })
  ) {
    const plural = SUPPORTED_NETWORKS.length > 1;
    const phrase = plural
      ? SUPPORTED_NETWORKS.map((net: any, i: number) => {
          const last = i === SUPPORTED_NETWORKS.length - 1;
          const first = i === 0;

          if (first) return net.phrase;
          if (last) return ` and ${net.phrase}`;
          return ` ${net.phrase}`;
        })
      : SUPPORTED_NETWORKS[0].phrase;

    throw new Error(
      `Only ${phrase} network${
        plural ? "s are" : " is"
      } currently supported. Switch your wallet connection and reconnect.`
    );
  }

  const token =
    options.token ?? (await userCreatesToken(signer, providerNetwork.chainId));
  const connectionObject: Connection = {
    get token() {
      return token;
    },
    get network() {
      return network;
    },
    get host() {
      return host;
    },
    get contract() {
      return contract;
    },
    get signer() {
      return signer;
    },
    get list() {
      return list;
    },
    get read() {
      return read;
    },
    get write() {
      return write;
    },
    get create() {
      return create;
    },
    get hash() {
      return hash;
    },
    get receipt() {
      return receipt;
    },
  };

  return connectionObject;
}
