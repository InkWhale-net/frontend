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
import SaleTab from "components/tabs/SaleTab";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllTokensList } from "redux/slices/allPoolsSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  delay,
  formatNumDynDecimal,
  formatNumToBNEther,
  formatTextAmount,
  formatTokenAmount,
  isAddressValid,
  moveINWToBegin,
} from "utils";
import {
  execContractQuery,
  execContractTx,
  execContractTxAndCallAPI,
  psp22_contract,
  token_generator_contract,
} from "utils/contracts";
import ImportTokenForm from "./ImportToken";
import ImageUploadIcon from "./UploadIcon";
import { ethers, formatEther, formatUnits } from "ethers";
import { useMutation } from "react-query";
import { formatQueryResultToNumberEthers } from "utils";
import { appChain } from "constants";
const PAGINATION_AMOUNT = 32;

export default function CreateTokenPage() {
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);
  const { api } = useAppContext();

  const [tokenName, setTokenName] = useState("");
  const [mintAddress, setMintAddress] = useState(currentAccount?.address);
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const [createTokenFee, setCreateToken] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [iconIPFSUrl, setIconIPFSUrl] = useState(null);

  const [listToken, setListToken] = useState([]);

  useEffect(() => {
    const fetchCreateTokenFee = async () => {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        token_generator_contract.CONTRACT_ABI,
        token_generator_contract.CONTRACT_ADDRESS,
        0,
        "tokenManagerTrait::getCreationFee"
      );

      const fee = formatTokenAmount(result?.toHuman()?.Ok, appChain?.decimal);

      setCreateToken(fee);
    };

    api && fetchCreateTokenFee();
  }, [currentAccount, api]);
  const addTotalSupply = async (_allTokensList) => {
    const processedTokenList = await Promise.all(
      _allTokensList.map(async (e) => {
        let queryResult = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract.CONTRACT_ABI,
          e?.contractAddress,
          0,
          "psp22::totalSupply"
        );
        const rawTotalSupply = queryResult?.toHuman().Ok;

        return {
          ...e,
          totalSupply: formatTokenAmount(rawTotalSupply, e?.decimal),
        };
      })
    );
    setListToken(moveINWToBegin(processedTokenList));
  };
  useEffect(() => {
    // setListToken([...listToken, allTokensList.slice(x)])
    // setListToken(allTokensList);
    if (allTokensList?.length > 0 && !!api) addTotalSupply(allTokensList);
  }, [allTokensList, api]);

  const updateIcon = async (contractAddress) => {
    if (iconIPFSUrl) {
      APICall.updateTokenIcon({
        contractAddress,
        tokenGeneratorContractAddress:
          token_generator_contract.CONTRACT_ADDRESS,
        tokenIconUrl: iconIPFSUrl,
      });
    }
  };
  const { isLoading, mutate } = useMutation(async () => {
    return new Promise(async (resolve) => {
      resolve(createNewToken());
    });
  })
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
      +formatTextAmount(currentAccount?.balance?.inw) <
      +formatTextAmount(createTokenFee)
    ) {
      toast.error(
        `You don't have enough ${appChain?.inwName}. Create Token costs ${formatNumDynDecimal(
          createTokenFee
        )} ${appChain?.inwName}`
      );
      return;
    }
    let step = 1;
    //Approve
    await new Promise(async (resolve, reject) => {
      try {
        const allowanceINWQr = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract.CONTRACT_ABI,
          psp22_contract.CONTRACT_ADDRESS,
          0, //-> value
          "psp22::allowance",
          currentAccount?.address,
          token_generator_contract.CONTRACT_ADDRESS
        );
        const allowanceINW = formatQueryResultToNumberEthers(
          allowanceINWQr,
          appChain?.decimal
        );
        if (+allowanceINW < +createTokenFee) {
          toast(`Step ${step}: Approving...`);
          step++;
          let approve = await execContractTxAndCallAPI(
            currentAccount,
            "api",
            psp22_contract.CONTRACT_ABI,
            psp22_contract.CONTRACT_ADDRESS,
            0, //-> value
            "psp22::approve",
            async () => resolve(),
            token_generator_contract.CONTRACT_ADDRESS,
            formatNumToBNEther(totalSupply)
          );
          if (!approve) reject("APPROVE FAIL");
        } else resolve()

      } catch (error) {
        console.log(error);
        reject("APPROVE FAIL")
      }
    })
    await delay(200);
    toast(`Step ${step}: Processing...`);
    await new Promise(async (resolve, reject) => {
      try {
        const result = await execContractTxAndCallAPI(
          currentAccount,
          "api",
          token_generator_contract.CONTRACT_ABI,
          token_generator_contract.CONTRACT_ADDRESS,
          0, //-> value
          "newToken",
          async (newContractAddress) => {
            await updateIcon(newContractAddress)
            await delay(1000);
            await APICall.askBEupdate({ type: "token", poolContract: "new" });
            setTokenName("");
            setTokenSymbol("");
            setTotalSupply("");
            setIconIPFSUrl(null);


            toast.promise(
              delay(10000).then(() => {
                setIconIPFSUrl();
                if (currentAccount) {
                  dispatch(fetchAllTokensList({}));
                  dispatch(fetchUserBalance({ currentAccount, api }));
                }
                resolve()
              }),
              {
                loading: "Please wait 10s for the data to be updated! ",
                success: "Done !",
                error: "Could not fetch data!!!",
              }
            );
          },
          mintAddress,
          formatNumToBNEther(totalSupply),
          tokenName,
          tokenSymbol,
          appChain?.decimal // tokenDecimal
        );
        if (!result) reject("PROCESS FAIL")
      } catch (error) {
        console.log(error);
        reject("PROCESS FAIL")
      }
    })
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
        label: "Owner",
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
        label: "Total supply",
      },
    ],
  };
  const tabsData = [
    {
      label: <>Create Token</>,
      component: (
        <>
          <span>
            Create standard PSP22 (ERC20) token and mint the total supply to a
            specific address. The creation requires
            <Text as="span" fontWeight="700" color="text.1">
              {" "}
              {createTokenFee || 0} {appChain?.inwName}
            </Text>
          </span>
          <VStack w="full" mt={4}>
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
                  onChange={({ target }) => {
                    if (/^[a-zA-Z0-9]*$/.test(target.value)) {
                      setTokenName(target.value);
                    }
                  }}
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
                  onChange={({ target }) => {
                    if (/^[a-zA-Z0-9]*$/.test(target.value)) {
                      setTokenSymbol(target.value);
                    }
                  }}
                />
              </Box>
              <Box w={{ base: "full" }}>
                <IWInput
                  isDisabled={true}
                  value={`${currentAccount?.balance?.azero || 0} ${appChain?.unit}`}
                  label={`Your ${appChain?.unit} Balance`}
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
                  value={`${formatNumDynDecimal(
                    currentAccount?.balance?.inw?.replaceAll(",", "")
                  ) || 0
                    } INW`}
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
              isLoading={isLoading}
              disabled={isLoading}
              w="full"
              maxW={{ lg: "170px" }}
              onClick={() => mutate()}
            >
              Create Token
            </Button>
          </VStack>
        </>
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
      <SectionContainer mt={{ base: "0px", xl: "8px" }}>
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
        {listToken?.filter((el) => !!el)?.length > 0 && (
          <InfiniteTable
            {...tableData}
            tableBody={listToken?.slice(0, currentPage * 4) || []}
            getNext={() => (hasMorePage ? setCurrentPage(currentPage + 1) : "")}
            hasMore={hasMorePage}
            isDisableRowClick={true}
          />
        )}
      </SectionContainer>
    </>
  );
}
