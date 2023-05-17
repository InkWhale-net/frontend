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
    let { ret, status, message } = await client("POST", "/getTokens", { limit, offset, sort })
    ret = ret.filter(el => !!el?.contractAddress)
    return { ret, status, message } ;
  },

  updateTokenIcon: async ({ contractAddress, tokenGeneratorContractAddress, tokenIconUrl }) => {
    return await client("POST", "/updateTokenUrl", { contractAddress, tokenGeneratorContractAddress, tokenIconUrl });
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

  getAllCollectionsFromArtZero: async ({ isActive, ignoreNoNFT }) => {
    const ret = await client(
      "POST",
      "/getCollections",
      {
        isActive,
        ignoreNoNFT,
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
