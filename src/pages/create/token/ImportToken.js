import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { IWTable } from "components/table/IWTable";
import { toastMessages } from "constants";

import React, { useState, useEffect, useRef } from "react";
import { APICall } from "api/client";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTokensList } from "redux/slices/allPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay } from "utils";
import { isAddressValid } from "utils";
import { formatNumToBN } from "utils";
import { formatQueryResultToNumber } from "utils";
import { execContractQuery } from "utils/contracts";
import { execContractTx } from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import core_contract from "utils/contracts/core_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import { InfiniteTable } from "components/table/InfiniteTable";
import { useMemo } from "react";
import ImageUploadIcon from "./UploadIcon";
import { execContractTxAndCallAPI } from "utils/contracts";
import { web3FromSource } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";

const ImportTokenForm = ({ api }) => {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);

  const [tokenAddress, setTokenAddress] = useState("");
  const [mintAddress, setMintAddress] = useState(currentAccount?.address);
  const [importIconIPFSUrl, setImportIconIPFSUrl] = useState(null);
  const [tokenInfo, setTokenInfo] = useState({ title: "", content: "" });
  const importTokenImageRef = useRef(null);
  console.log(importTokenImageRef, "importTokenImageRef");
  const [tokenIcon, setTokenIcon] = useState({
    IPFSUrl: null,
    localSource: null,
  });

  const updateIcon = async (contractAddress) => {
    if (importIconIPFSUrl) {
      APICall.updateTokenIcon({
        contractAddress,
        tokenGeneratorContractAddress: core_contract.CONTRACT_ADDRESS,
        tokenIconUrl: importIconIPFSUrl,
      });
    }
  };

  const loadTokenInfo = async () => {
    try {
      if (!currentAccount) {
        toast.error("Please connect wallet!");
        return setTokenInfo({ title: "", content: "" });
      }
      if (!isAddressValid(tokenAddress)) {
        toast.error("Invalid address!");
        return;
      }
      let queryResult = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22::balanceOf",
        currentAccount?.address
      );
      const balance = formatQueryResultToNumber(queryResult);

      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenName"
      );
      const tokenName = queryResult1.toHuman().Ok;
      let queryResult2 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenSymbol"
      );
      const tokenSymbol = queryResult2.toHuman().Ok;

      setTokenInfo((prev) => {
        return {
          ...prev,
          title: tokenSymbol,
          name: tokenName,
          content: balance,
        };
      });
    } catch (error) {
      console.log(error);
    }
  };

  const importToken = async () => {
    try {
      if (!currentAccount) {
        toast.error("Please connect wallet for full-function using!");
      }
      let queryResult = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "ownable::owner"
      );
      const tokenOwnerAddress = queryResult.toHuman().Ok;
      // if (tokenOwnerAddress != currentAccount?.address) {
      //   toast.error("Token owner not match");
      //   return;
      // }
      const { signer } = await web3FromSource(currentAccount?.meta?.source);
      const { signature } = await signer.signRaw({
        address: currentAccount.address,
        data: stringToHex("Sign message to import token"),
        type: "bytes",
      });
      let queryResult1 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenDecimals"
      );
      const tokenDecimal = queryResult1.toHuman().Ok;

      if (importIconIPFSUrl) {
        const { status, message } = await APICall.importToken({
          tokenAddress,
          tokenGeneratorContractAddress: core_contract.CONTRACT_ADDRESS,
          tokenIconUrl: importIconIPFSUrl,
          name: tokenInfo?.name,
          symbol: tokenInfo?.title,
          decimal: tokenDecimal,
          creator: tokenOwnerAddress,
          signature,
        });
        // console.log(ret, status, message);
        if (status === "OK") {
          setTokenInfo({ title: "", content: "" })
          setTokenAddress("")
          toast.promise(
            delay(1000).then(() => {
              setImportIconIPFSUrl();
              if (currentAccount) {
                dispatch(fetchAllTokensList({}));
                dispatch(fetchUserBalance({ currentAccount, api }));
              }
            }),
            {
              loading: "Please wait a minute for the data to be updated! ",
              success: "Done !",
              error: "Could not fetch data!!!",
            }
          );
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SectionContainer
      mt={{ base: "0px", xl: "20px" }}
      title="Import Token"
      //   description={
      //     <span>
      //       Create standard PSP22 (ERC20) token and mint the total supply to a
      //       specific address. The creation requires
      //       <Text as="span" fontWeight="700" color="text.1">
      //         {" "}
      //         {createTokenFee} INW
      //       </Text>
      //     </span>
      //   }
    >
      <VStack w="full" align={{ base: "flex-start" }}>
        <Box
          display={{ base: "flex" }}
          alignItems={{
            base: "flex-end",
          }}
          w={{ base: "full", lg: "50%" }}
          sx={{ flexDirection: "row" }}
        >
          <Box w={{ base: "full" }}>
            <IWInput
              type="text"
              value={tokenAddress}
              label="Token address"
              onChange={({ target }) => setTokenAddress(target.value)}
              placeholder="Address"
            />
          </Box>
          <Button
            marginLeft={{ base: "10px" }}
            paddingLeft={{ base: "32px" }}
            paddingRight={{ base: "32px" }}
            onClick={loadTokenInfo}
          >
            Load
          </Button>
        </Box>
        {!!tokenInfo?.name && (
          <Box w={{ base: "full", lg: "50%" }}>
            <IWInput
              disabled
              type="text"
              value={tokenInfo?.name}
              label="Token Name"
              placeholder="Token Name"
            />
          </Box>
        )}

        {!!tokenInfo?.title && (
          <Box w={{ base: "full", lg: "50%" }}>
            <IWInput
              disabled
              type="text"
              value={tokenInfo?.title}
              label="Token Symbol"
              placeholder="Token Symbol"
            />
          </Box>
        )}
        {!!tokenInfo?.supply && (
          <Box w={{ base: "full", lg: "50%" }}>
            <IWInput
              disabled
              type="number"
              value={tokenInfo?.supply}
              label="Total Supply"
              placeholder="0"
            />
          </Box>
        )}
        <Box w="full">
          <Heading as="h4" size="h4" mb="12px">
            Token Icon
          </Heading>
          <ImageUploadIcon
            keyInput={1}
            iconUrl={importIconIPFSUrl}
            setImageIPFSUrl={setImportIconIPFSUrl}
          />
        </Box>

        <Button
          w="full"
          maxW={{ lg: "170px" }}
          onClick={importToken}
          disabled={!(!!tokenInfo?.name && !!tokenInfo?.name)}
        >
          Import Token
        </Button>
      </VStack>
    </SectionContainer>
  );
};
export default ImportTokenForm;
