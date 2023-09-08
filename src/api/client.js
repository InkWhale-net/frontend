import axios from "axios";
import { Buffer } from "buffer";

const { create } = require("ipfs-http-client");

const client = async (
  method,
  url,
  options = {},
  baseURL = process.env.REACT_APP_API_BASE_URL
) => {
  const headers = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const urlencodedOptions = new URLSearchParams(
    Object.entries(options)
  ).toString();

  const { data } = await axios({
    baseURL,
    url,
    method,
    headers,
    timeout: 30000,
    data: urlencodedOptions,
  });

  if (data?.status === "FAILED") {
    console.log("error FAILED @ xx>>", url, data?.message);
  }

  return data;
};

export const APICall = {
  // Get list of tokens
  getTokensList: async ({ limit = 1000, offset = 0, sort = -1 }) => {
    let { ret, status, message } = await client("POST", "/getTokens", {
      limit,
      offset,
      sort,
    });
    ret = ret.filter(
      (el) => !!el?.contractAddress && el?.contractAddress !== "undefined"
    );
    ret.unshift(ret.pop());
    return { ret, status, message };
  },

  updateTokenIcon: async ({
    contractAddress,
    tokenGeneratorContractAddress,
    tokenIconUrl,
  }) => {
    return await client("POST", "/updateTokenUrl", {
      contractAddress,
      tokenGeneratorContractAddress,
      tokenIconUrl,
    });
  },
  importToken: async ({
    tokenAddress,
    tokenGeneratorContractAddress,
    tokenIconUrl,
    name,
    symbol,
    decimal,
    creator,
    signature,
    isNew,
  }) => {
    return await client("POST", "/importToken", {
      tokenAddress,
      tokenGeneratorContractAddress,
      tokenIconUrl,
      name,
      symbol,
      decimal,
      creator,
      signature,
      isNew,
    });
  },
  getTokenInfor: async ({ tokenAddress }) => {
    return await client("POST", "/getTokenInfor", {
      tokenAddress,
    });
  },

  // get INW total supply
  getINWTotalSupply: async () => {
    return await client("POST", "/getINWTotalSupply", {});
  },

  getINWInCirculation: async () => {
    return await client("POST", "/getINWInCirculation", {});
  },
  getTransactionHistory: async ({
    tokenContract,
    queryAddress,
    limit = 10,
    offset = 0,
    isFromOnly = false,
    isToOnly = false,
  }) => {
    return await client("POST", "/getTransactionHistory", {
      tokenContract,
      queryAddress,
      limit,
      offset,
      isFromOnly,
      isToOnly,
    });
  },
  getLaunchpad: async ({
    keyword,
    isActive = 1,
    status,
    sortBy,
    limit = 1000,
    offset = 0,
  }) => {
    return await client("POST", "/getLaunchpads", {
      keyword,
      isActive,
      status,
      sortBy,
      limit,
      offset,
    });
  },

  // Get list of staking pools
  getStakingPoolsList: async ({
    limit = 1000,
    offset = 0,
    sort = -1,
    showZeroPool = true,
  }) => {
    return await client("POST", "/getPools", {
      limit,
      offset,
      sort,
      showZeroPool,
    });
  },

  // Get list of staking pools by owner
  getStakingPoolsListByOwner: async ({ owner }) => {
    return await client("POST", "/getPoolByOwner", {
      owner,
    });
  },

  // Get staking pool by address
  getStakingPoolByAddress: async ({ poolContract }) => {
    return await client("POST", "/getPoolByAddress", {
      poolContract,
    });
  },

  //  Get list of NFT pools
  getNFTLPList: async ({
    limit = 1000,
    offset = 0,
    sort = -1,
    showZeroPool = true,
  }) => {
    const ret = await client("POST", "/getNFTPools", {
      limit,
      offset,
      sort,
      showZeroPool,
    });

    return ret;
  },

  // Get list of NFT pools by owner
  getNFTPoolsListByOwner: async ({ owner }) => {
    return await client("POST", "/getNFTPoolByOwner", {
      owner,
    });
  },

  // Get NFT pool by address
  getNFTPoolByAddress: async ({ poolContract }) => {
    return await client("POST", "/getNFTPoolByAddress", {
      poolContract,
    });
  },

  //  Get list of Token pools
  getTokenLPList: async ({
    limit = 1000,
    offset = 0,
    sort = -1,
    showZeroPool = true,
  }) => {
    const ret = await client("POST", "/getLPPools", {
      limit,
      offset,
      sort,
      showZeroPool,
    });

    return ret;
  },

  // Get list of Token pools by owner
  getTokenLPListByOwner: async ({ owner }) => {
    return await client("POST", "/getLPPoolByOwner", {
      owner,
    });
  },

  // Get Token pool by address
  getTokenLPByAddress: async ({ poolContract }) => {
    return await client("POST", "/getLPPoolByAddress", {
      poolContract,
    });
  },

  /*
   * Request to update data for token/staking pool/lp pool/nft pool
   * type: "token"|"pool"|"lp"|"nft"
   * poolContract:"new" | address
   */

  askBEupdate: async ({ type, poolContract }) => {
    const ret = await client("POST", "/update", { type, poolContract });

    return ret;
  },

  // ARTZERO BE CALL
  getCollectionByAddressFromArtZero: async ({ collection_address }) => {
    const ret = await client(
      "POST",
      "/getCollectionByAddress",
      {
        collection_address,
      },
      process.env.REACT_APP_ARTZERO_API_BASE_URL
    );

    return ret;
  },

  getAllCollectionsFromArtZero: async ({ isActive, ignoreNoNFT, limit }) => {
    const ret = await client(
      "POST",
      "/getCollections",
      {
        isActive,
        ignoreNoNFT,
        limit,
      },
      process.env.REACT_APP_ARTZERO_API_BASE_URL
    );

    return ret;
  },

  getNFTsByOwnerAndCollectionFromArtZero: async ({
    collection_address,
    owner,
  }) => {
    const ret = await client(
      "POST",
      "/getNFTsByOwnerAndCollection",
      {
        collection_address,
        owner,
      },
      process.env.REACT_APP_ARTZERO_API_BASE_URL
    );

    return ret;
  },

  getNFTByIdFromArtZero: async ({ collection_address, token_id }) => {
    if (!token_id) return { status: "failed" };
    const ret = await client(
      "POST",
      "/getNFTByID",
      {
        collection_address,
        token_id,
      },
      process.env.REACT_APP_ARTZERO_API_BASE_URL
    );

    return ret;
  },

  askBEupdateNFTFromArtZero: async ({ collection_address, token_id }) => {
    const ret = await client(
      "POST",
      "/updateNFT",
      {
        collection_address,
        token_id,
      },
      process.env.REACT_APP_ARTZERO_API_BASE_URL
    );

    return ret;
  },
  getTotalValueLocked: async () => {
    const ret = await client("POST", "/getTotalValueLocked");
    return ret;
  },
};

const projectId = process.env.REACT_APP_IPFS_PROJECT_ID;
const projectKey = process.env.REACT_APP_IPFS_PROJECT_KEY;

// IPFS API client call
const authorization =
  "Basic " + Buffer.from(projectId + ":" + projectKey).toString("base64");

export const ipfsClient = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization,
  },
});
