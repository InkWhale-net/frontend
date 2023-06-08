import { Box, Button, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";

import { web3FromSource } from "@polkadot/extension-dapp";
import { stringToHex } from "@polkadot/util";
import { APICall } from "api/client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTokensList } from "redux/slices/allPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay, formatQueryResultToNumber, isAddressValid } from "utils";
import { execContractQuery } from "utils/contracts";
import core_contract from "utils/contracts/core_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import ImageUploadIcon from "./UploadIcon";
import { roundUp } from "utils";
import { formatNumDynDecimal } from "utils";

const ImportTokenForm = ({ api }) => {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);

  const [tokenAddress, setTokenAddress] = useState("");
  const [importIconIPFSUrl, setImportIconIPFSUrl] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  const loadTokenInfo = async () => {
    try {
      if (!currentAccount) {
        toast.error("Please connect wallet!");
        return setTokenInfo(null);
      }
      if (!isAddressValid(tokenAddress)) {
        toast.error("Invalid address!");
        setTokenInfo(null);
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

      let queryResult3 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22::totalSupply"
      );
      const rawTotalSupply = queryResult3.toHuman().Ok;

      let queryResult4 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "psp22Metadata::tokenDecimals"
      );
      const decimals = queryResult4.toHuman().Ok;
      const totalSupply = roundUp(
        rawTotalSupply?.replaceAll(",", "") / 10 ** parseInt(decimals),
        0
      );
      let queryResult5 = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract.CONTRACT_ABI,
        tokenAddress,
        0,
        "ownable::owner"
      );
      const owner = queryResult5?.toHuman()?.Ok;
      setTokenInfo((prev) => {
        return {
          ...prev,
          title: tokenSymbol,
          name: tokenName,
          content: balance,
          totalSupply: formatNumDynDecimal(totalSupply, 4),
          decimals,
          owner,
        };
      });
    } catch (error) {
      toast.error("Invalid address!");
      setTokenInfo(null);
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
      if (tokenOwnerAddress != currentAccount?.address) {
        toast.error("You must be the owner of the token contract to continue");
        return;
      }
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
        if (status === "OK") {
          setTokenInfo(null);
          setTokenAddress("");
          toast.promise(
            delay(10000).then(() => {
              setImportIconIPFSUrl();
              if (currentAccount) {
                dispatch(fetchAllTokensList({}));
                dispatch(fetchUserBalance({ currentAccount, api }));
              }
            }),
            {
              loading: "Please wait 10s for the data to be updated! ",
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
    <>
      <span>
        Register your token to Ink Whale. You must be the contract owner to
        perform this action
      </span>
      <VStack mt={4} w="full" align={{ base: "flex-start" }}>
        <Box
          display={{ base: "flex" }}
          alignItems={{
            base: "flex-end",
          }}
          w={{ base: "full" }}
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
        <SimpleGrid
          w="full"
          columns={{ base: 1, lg: 2 }}
          spacingX={{ lg: "20px" }}
          spacingY={{ base: "20px", lg: "32px" }}
          mb={{ base: "30px" }}
        >
          {!!tokenInfo?.name && (
            <Box w={{ base: "full" }}>
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
            <Box w={{ base: "full" }}>
              <IWInput
                disabled
                type="text"
                value={tokenInfo?.title}
                label="Token Symbol"
                placeholder="Token Symbol"
              />
            </Box>
          )}
          {!!tokenInfo?.totalSupply && (
            <Box w={{ base: "full" }}>
              <IWInput
                disabled
                type="text"
                value={tokenInfo?.totalSupply}
                label="Total supply"
                placeholder="Total supply"
              />
            </Box>
          )}
          {!!tokenInfo?.decimals && (
            <Box w={{ base: "full" }}>
              <IWInput
                disabled
                type="text"
                value={tokenInfo?.decimals}
                label="Decimals"
                placeholder="Decimals"
              />
            </Box>
          )}
          {!!tokenInfo?.owner && (
            <Box w={{ base: "full" }}>
              <IWInput
                disabled
                type="text"
                value={tokenInfo?.owner}
                label="Owner"
                placeholder="Owner"
              />
            </Box>
          )}
        </SimpleGrid>

        <Box w="full">
          <Heading as="h4" size="h4" mb="12px">
            Token Icon
          </Heading>
          <ImageUploadIcon
            isDisabled={!!!tokenInfo}
            keyInput={1}
            iconUrl={importIconIPFSUrl}
            setImageIPFSUrl={setImportIconIPFSUrl}
          />
        </Box>

        <Button
          w="full"
          maxW={{ lg: "170px" }}
          onClick={importToken}
          disabled={!(!!tokenInfo && importIconIPFSUrl)}
        >
          Import Token
        </Button>
      </VStack>
    </>
  );
};
export default ImportTokenForm;
