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
import { toastMessages } from "constants";

import { APICall } from "api/client";
import { InfiniteTable } from "components/table/InfiniteTable";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTokensList } from "redux/slices/allPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  delay,
  formatNumToBN,
  formatQueryResultToNumber,
  isAddressValid,
} from "utils";
import {
  execContractQuery,
  execContractTx,
  execContractTxAndCallAPI,
} from "utils/contracts";
import azt_contract from "utils/contracts/azt_contract";
import core_contract from "utils/contracts/core_contract";
import psp22_contract from "utils/contracts/psp22_contract";
import ImportTokenForm from "./ImportToken";
import ImageUploadIcon from "./UploadIcon";
import SaleTab from "components/tabs/SaleTab";

export default function CreateTokenPage({ api }) {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);

  const [tokenName, setTokenName] = useState("");
  const [mintAddress, setMintAddress] = useState(currentAccount?.address);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const [createTokenFee, setCreateToken] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [iconIPFSUrl, setIconIPFSUrl] = useState(null);

  useEffect(() => {
    const fetchCreateTokenFee = async () => {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        core_contract.CONTRACT_ABI,
        core_contract.CONTRACT_ADDRESS,
        0,
        "tokenManagerTrait::getCreationFee"
      );

      const fee = formatQueryResultToNumber(result);

      setCreateToken(fee);
    };
    fetchCreateTokenFee();
  }, [currentAccount, api]);

  const updateIcon = async (contractAddress) => {
    if (iconIPFSUrl) {
      APICall.updateTokenIcon({
        contractAddress,
        tokenGeneratorContractAddress: core_contract.CONTRACT_ADDRESS,
        tokenIconUrl: iconIPFSUrl,
      });
    }
  };

  async function createNewToken() {
    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    if (!tokenName || !mintAddress || !tokenSymbol || !totalSupply) {
      toast.error(`Please fill in all data!`);
      return;
    }

    if (!iconIPFSUrl) {
      toast.error(`Please upload your icon to IPFS!`);
      return;
    }

    if (!isAddressValid(mintAddress)) {
      return toast.error("Invalid address!");
    }

    if (
      parseInt(currentAccount?.balance?.inw?.replaceAll(",", "")) <
      createTokenFee?.replaceAll(",", "")
    ) {
      toast.error(
        `You don't have enough INW. Create Token costs ${createTokenFee} INW`
      );
      return;
    }
    const allowanceINWQr = await execContractQuery(
      currentAccount?.address,
      "api",
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0, //-> value
      "psp22::allowance",
      currentAccount?.address,
      core_contract.CONTRACT_ADDRESS
    );
    const allowanceINW = formatQueryResultToNumber(allowanceINWQr).replaceAll(
      ",",
      ""
    );
    let step = 1;
    //Approve
    if (allowanceINW < createTokenFee.replaceAll(",", "")) {
      toast.success(`Step ${step}: Approving...`);
      step++;
      let approve = await execContractTx(
        currentAccount,
        "api",
        psp22_contract.CONTRACT_ABI,
        azt_contract.CONTRACT_ADDRESS,
        0, //-> value
        "psp22::approve",
        core_contract.CONTRACT_ADDRESS,
        formatNumToBN(Number.MAX_SAFE_INTEGER)
      );
      if (!approve) return;
    }

    await delay(3000);

    toast.success(`Step ${step}: Processing...`);

    await execContractTxAndCallAPI(
      currentAccount,
      "api",
      core_contract.CONTRACT_ABI,
      core_contract.CONTRACT_ADDRESS,
      0, //-> value
      "newToken",
      updateIcon,
      mintAddress,
      formatNumToBN(totalSupply),
      tokenName,
      tokenSymbol,
      12 // tokenDecimal
    );

    setTokenName("");
    setTokenSymbol("");
    setTotalSupply("");
    await delay(3000);

    await APICall.askBEupdate({ type: "token", poolContract: "new" });

    toast.promise(
      delay(30000).then(() => {
        setIconIPFSUrl();
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
  }

  const hasMorePage = useMemo(
    () => currentPage * 4 < allTokensList?.length,
    [currentPage, allTokensList]
  );

  const tableData = {
    tableHeader: [
      {
        name: "contractAddress",
        hasTooltip: false,
        tooltipContent: "",
        label: "Contract Address",
      },
      {
        name: "creator",
        hasTooltip: false,
        tooltipContent: "",
        label: "Creator",
      },
      {
        name: "name",
        hasTooltip: false,
        tooltipContent: "",
        label: "Name",
      },
      {
        name: "symbol",
        hasTooltip: false,
        tooltipContent: "",
        label: "Symbol",
      },
      {
        name: "tokenIconUrl",
        hasTooltip: false,
        tooltipContent: "",
        label: "Icon",
      },
      {
        name: "decimal",
        hasTooltip: false,
        tooltipContent: "",
        label: "Decimal",
      },
      {
        name: "totalSupply",
        hasTooltip: false,
        tooltipContent: "",
        label: "Initial Mint",
      },
    ],
  };
  const tabsData = [
    {
      label: <>Create Token</>,
      component: (
        <VStack w="full">
          <SimpleGrid
            w="full"
            columns={{ base: 1, lg: 2 }}
            spacingX={{ lg: "20px" }}
            spacingY={{ base: "20px", lg: "32px" }}
            mb={{ base: "30px" }}
          >
            <Box w={{ base: "full" }}>
              <IWInput
                type="text"
                value={tokenName}
                label="Token Name"
                placeholder="Token Name"
                onChange={({ target }) => setTokenName(target.value)}
              />
            </Box>
            <Box w={{ base: "full" }}>
              <IWInput
                type="text"
                value={mintAddress}
                label="Mint to"
                onChange={({ target }) => setMintAddress(target.value)}
                placeholder="Address"
              />
            </Box>
            <Box w={{ base: "full" }}>
              <IWInput
                type="text"
                value={tokenSymbol}
                label="Token Symbol"
                placeholder="Token Symbol"
                onChange={({ target }) => setTokenSymbol(target.value)}
              />
            </Box>
            <Box w={{ base: "full" }}>
              <IWInput
                isDisabled={true}
                value={`${currentAccount?.balance?.azero || 0} AZERO`}
                label="Your Azero Balance"
              />
            </Box>
            <Box w={{ base: "full" }}>
              <IWInput
                type="number"
                value={totalSupply}
                label="Total Supply"
                placeholder="0"
                onChange={({ target }) => setTotalSupply(target.value)}
              />
            </Box>
            <Box w={{ base: "full" }}>
              <IWInput
                isDisabled={true}
                value={`${currentAccount?.balance?.inw || 0} INW`}
                label="Your INW Balance"
              />
            </Box>
            <Box w="full">
              <Heading as="h4" size="h4" mb="12px">
                Token Icon
              </Heading>
              <ImageUploadIcon
                iconUrl={iconIPFSUrl}
                setImageIPFSUrl={setIconIPFSUrl}
                keyInput={0}
              />
            </Box>
          </SimpleGrid>

          <Button
            isDisabled={
              !(
                !!iconIPFSUrl &&
                !!tokenName &&
                !!tokenSymbol &&
                !!totalSupply &&
                !!mintAddress
              )
            }
            w="full"
            maxW={{ lg: "170px" }}
            onClick={createNewToken}
          >
            Create Token
          </Button>
        </VStack>
      ),
      isDisabled: false,
    },
    {
      label: <>Import Token</>,
      component: <ImportTokenForm />,
      isDisabled: false,
    },
  ];
  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="Create/Import Token"
        description={
          <span>
            Create standard PSP22 (ERC20) token and mint the total supply to a
            specific address. The creation requires
            <Text as="span" fontWeight="700" color="text.1">
              {" "}
              {createTokenFee} INW
            </Text>
          </span>
        }
      >
        <SaleTab
          tabsData={tabsData}
          tabIndex={tabIndex}
          onChangeTab={(index) => {
            setTabIndex(index);
          }}
        />
      </SectionContainer>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="Recent Tokens"
        description={``}
      >
        <InfiniteTable
          {...tableData}
          tableBody={allTokensList?.slice(0, currentPage * 4) || []}
          getNext={() => (hasMorePage ? setCurrentPage(currentPage + 1) : "")}
          hasMore={hasMorePage}
          isDisableRowClick={true}
        />
      </SectionContainer>
    </>
  );
}
