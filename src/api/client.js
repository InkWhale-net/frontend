import axios from "axios";

//const baseURL = "http://localhost:3412";

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
  getFaucetTokensList: async () => {
    return await client("POST", "/getTokens", {});
  },

  getPoolsList: async () => {
    return await client("POST", "/getPools", {});
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
      // sort: 1,
      // limit: 5,
      // offset: 5,
      // showZeroPool: true,
    });

    return ret;
  },

  getTokenLPList: async () => {
    const ret = await client("POST", "/getLPPools", {
      // sort: 1,
      // limit: 5,
      // offset: 5,
      // showZeroPool: true,
    });

    return ret;
  },

  getUserStakingPools: async ({ owner }) => {
    const ret = await client("POST", "/getPoolByOwner", {
      owner,
    });

    return ret;
  },

  //  Get list of NFT pools
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

  // Get Token pool by address
  getTokenLPByAddress: async ({ poolContract }) => {
    return await client("POST", "/getLPPoolByAddress", {
      poolContract,
    });
  },

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
