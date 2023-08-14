import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import SectionContainer from "components/container/SectionContainer";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import azt_contract from "utils/contracts/azt_contract";
import private_sale from "utils/contracts/private_sale";
import public_sale from "utils/contracts/public_sale";

import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import CardThreeColumn from "components/card/CardThreeColumn";
import IWCountDown from "components/countdown/CountDown";
import SaleTab from "components/tabs/SaleTab";
import { toastMessages } from "constants";
import useInterval from "hook/useInterval";
import { toast } from "react-hot-toast";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  delay,
  formatChainStringToNumber,
  formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
  getPublicCurrentAccount,
  roundDown,
  roundUp,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import { parseUnits } from "ethers";
import { formatTokenAmount } from "utils";
import IWCountDownClaim from "./ClaimButton";

const inwContractAddress = azt_contract.CONTRACT_ADDRESS;

export default function FaucetPage({ api }) {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);

  const dispatch = useDispatch();

  const inwBalance = currentAccount?.balance?.inw ?? 0;
  const azeroBalance = currentAccount?.balance?.azero ?? 0;
  const [selectedContractAddress, setSelectedContractAddress] = useState(null);

  const [inwTotalSupply, setInwTotalSupply] = useState(0);
  const [availableMint, setAvailableMint] = useState("");
  const [inwBuyAmount, setInwBuyAmount] = useState("");
  const [azeroBuyAmount, setAzeroBuyAmount] = useState("");
  const [inwInCur, setInwInCur] = useState(0);
  const [inwPrice, setInwPrice] = useState(0);
  const [tabIndex, setTabIndex] = useState(0);
  const [saleInfo, setSaleInfo] = useState({});
  const [inwBurn, setInwBurn] = useState(0);

  const [accountInfo, setAccountInfo] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [accountInfoLoading, setAccountInfoLoading] = useState(false);
  const publicCurrentAccount = getPublicCurrentAccount();

  const prepareAccountInfoData = useCallback(() => {
    setAccountInfoLoading(true);

    const fetch = async () => {
      let ret = [
        {
          title: "Account Address",
          content: !currentAccount?.address ? (
            "No account selected"
          ) : (
            <AddressCopier address={currentAccount?.address} />
          ),
        },
        { title: "Azero Balance", content: `${azeroBalance} AZERO` },
        { title: "INW Balance", content: `${inwBalance} INW` },
      ];

      try {
        if (selectedContractAddress) {
          let balance = await execContractQuery(
            currentAccount?.address,
            api,
            azt_contract.CONTRACT_ABI,
            selectedContractAddress,
            0,
            "psp22::balanceOf",
            currentAccount?.address
          );

          const symbol = allTokensList.find(
            (item) => item.contractAddress === selectedContractAddress
          )?.symbol;

          ret.push({
            title: `${symbol} Balance`,
            content: `${formatQueryResultToNumber(balance)} ${symbol}`,
          });
        }
        setAccountInfoLoading(false);
        setAccountInfo((prev) => {
          return ret;
        });
      } catch (error) {
        setAccountInfoLoading(false);
        toast.error(error.message);
        console.log("error", error);
      }
    };
    fetch();
  }, [
    api,
    azeroBalance,
    currentAccount?.address,
    allTokensList,
    selectedContractAddress,
    inwBalance,
  ]);

  const getPriceInw = async (token) => {
    let price = await execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::inwPrice"
    );
    setInwPrice(formatQueryResultToNumber(price));
  };

  const getSaleInfo = async (token) => {
    let query1 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::endTime"
    );
    const query2 = execContractQuery(
      currentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::getBuyerInfo",
      currentAccount?.address
    );

    const query3 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::totalPurchasedAmount"
    );

    const query4 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::totalAmount"
    );

    const query5 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::totalClaimedAmount"
    );
    const query6 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::vestingDuration"
    );

    const query7 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::totalPurchasedAmount"
    );
    const query8 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::isBurned"
    );
    const query9 = execContractQuery(
      currentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::getUnclaimedAmount"
    );
    let query10 = execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::startTime"
    );
    const [
      endTime,
      buyInfoQr,
      balancePurchaseInwQr,
      balanceTotalInwQr,
      totalClaimedQr,
      vestingDuration,
      totalPuchaedQr,
      isBurnedQr,
      unclaimAmount,
      startTimeQr,
    ] = await Promise.all([
      query1,
      query2,
      query3,
      query4,
      query5,
      query6,
      query7,
      query8,
      query9,
      query10,
    ]);
    const leftAmount =
      +balanceTotalInwQr?.toHuman().Ok?.replaceAll(",", "") -
      +balancePurchaseInwQr?.toHuman().Ok?.replaceAll(",", "");
    const result = endTime?.toHuman()?.Ok?.replaceAll(",", "");
    const startTime = startTimeQr?.toHuman()?.Ok?.replaceAll(",", "");
    const result2 = buyInfoQr?.toHuman()?.Ok;
    const result3 = balanceTotalInwQr?.toHuman()?.Ok;
    const buyInfo = {
      claimedAmount: formatNumDynDecimal(
        result2?.claimedAmount?.replaceAll(",", "") / 10 ** 12,
        2
      ),
      purchasedAmount: formatNumDynDecimal(
        result2?.purchasedAmount?.replaceAll(",", "") / 10 ** 12,
        2
      ),
    };
    setAvailableMint(formatNumDynDecimal(leftAmount / 10 ** 12));
    setSaleInfo({
      buyerInfo: buyInfo,
      totalSale: formatNumDynDecimal(
        result3?.replaceAll(",", "") / 10 ** 12,
        2
      ),
      totalClaimed: formatNumDynDecimal(
        totalClaimedQr?.toHuman()?.Ok?.replaceAll(",", "") / 10 ** 12,
        2
      ),
      endTimeSale: result,
      startTimeSale: startTime,
      unclaimAmount: unclaimAmount?.toHuman()?.Ok?.Ok?.replaceAll(",", "") || 0,
      burnedAmount: isBurnedQr?.toHuman()?.Ok
        ? result3?.replaceAll(",", "") -
          +totalPuchaedQr?.toHuman()?.Ok?.replaceAll(",", "")
        : 0,
      vestingDuration: vestingDuration?.toHuman()?.Ok?.replaceAll(",", "") || 0,
    });
  };

  useEffect(() => {
    prepareAccountInfoData();
  }, [prepareAccountInfoData]);

  const getBalanceINWOfAddress = (address) => {
    return execContractQuery(
      publicCurrentAccount?.address,
      api,
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      address
    );
  };

  const getInwMintingCapAndTotalSupply = useCallback(async () => {
    if (!api) {
      setInwTotalSupply(0);
      return;
    }
    try {
      const INWTotalSupplyResponse = await APICall.getINWTotalSupply();
      if (INWTotalSupplyResponse?.status === "OK") {
        setInwTotalSupply(
          formatNumDynDecimal(
            roundUp(
              formatTokenAmount(INWTotalSupplyResponse?.ret?.totalSupply, 12) ||
                0,
              4
            )
          )
        );
        let result1 = await execContractQuery(
          process.env.REACT_APP_PUBLIC_ADDRESS,
          api,
          azt_contract.CONTRACT_ABI,
          azt_contract.CONTRACT_ADDRESS,
          0,
          "psp22Capped::cap"
        );
        const inwTotalSupplyCap = formatQueryResultToNumber(result1);
        setInwBurn(
          parseFloat(inwTotalSupplyCap?.replaceAll(",", "")) -
            parseFloat(
              formatTokenAmount(INWTotalSupplyResponse?.ret?.totalSupply, 12)
            )
        );
      } else {
        toast.error("Get In inCirculation fail");
      }

      const INWInCirculationResponse = await APICall.getINWInCirculation();
      if (INWInCirculationResponse?.status === "OK") {
        setInwInCur(
          formatNumDynDecimal(INWInCirculationResponse.ret.inCirculation, 2)
        );
      } else {
        toast.error("Get In inCirculation fail");
      }
    } catch (error) {
      console.log(error);
      toast.error("unknow error");
    }
  }, [api]);

  const isSaleEnded = useMemo(
    () => Date.now() >= saleInfo?.endTimeSale,
    [saleInfo?.endTimeSale]
  );

  const notSaleStart = useMemo(
    () => Date.now() < saleInfo?.startTimeSale,
    [saleInfo?.startTimeSale]
  );

  const disableBuyBtn = useMemo(() => {
    return (
      inwBuyAmount * parseFloat(inwPrice) >=
        formatChainStringToNumber(azeroBalance) ||
      isSaleEnded ||
      notSaleStart ||
      availableMint?.replaceAll(",", "") < +inwBuyAmount ||
      !(inwBuyAmount > 0)
    );
  }, [
    azeroBalance,
    inwBuyAmount,
    inwPrice,
    notSaleStart,
    isSaleEnded,
    availableMint,
  ]);

  const getBalanceContract = async (token) => {
    let balance = await execContractQuery(
      publicCurrentAccount?.address,
      api,
      azt_contract.CONTRACT_ABI,
      azt_contract.CONTRACT_ADDRESS,
      0,
      "psp22::balanceOf",
      token.CONTRACT_ADDRESS
    );
    setAvailableMint(
      formatQueryResultToNumber(balance).replace(".0000", ".00")
    );
  };
  const getPublicsaleInfo = async (token) => {
    let endTime = await execContractQuery(
      publicCurrentAccount?.address,
      api,
      token.CONTRACT_ABI,
      token.CONTRACT_ADDRESS,
      0,
      "genericTokenSaleTrait::endTime"
    );
    setSaleInfo({
      ...saleInfo,
      endTimeSale: endTime?.toHuman()?.Ok?.replaceAll(",", ""),
    });
  };

  useEffect(() => {
    getInwMintingCapAndTotalSupply();
  }, [api, currentAccount, getInwMintingCapAndTotalSupply]);

  const getInfo = () => {
    if (tabIndex === 0) {
      getPriceInw(private_sale);
      getSaleInfo(private_sale);
      // getBalanceContract(private_sale);
    } else {
      getPublicsaleInfo(public_sale);
      getPriceInw(public_sale);
      getBalanceContract(public_sale);
    }
  };

  useEffect(() => {
    if (!(api && publicCurrentAccount?.address)) return;
    getInfo();
    resetField();
  }, [tabIndex]);

  useEffect(() => {
    if (!(api && publicCurrentAccount?.address)) return;
    getInfo();
  }, [api, currentAccount]);

  useInterval(() => {
    getInfo();
  }, 7000);

  const inwPublicMintHandler = async () => {
    if (!api) {
      toast.error(toastMessages.ERR_API_CONN);
      return;
    }

    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    await execContractTx(
      currentAccount,
      api,
      public_sale.CONTRACT_ABI,
      public_sale.CONTRACT_ADDRESS,
      parseUnits(roundUp(inwPrice * inwBuyAmount, 4).toString(), 12), //-> value
      "genericTokenSaleTrait::purchase",
      formatNumToBN(inwBuyAmount) // -> token_amount, <...args>
    );

    await delay(5000);
    resetField();
    toast.promise(
      delay(1000).then(() => {
        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        getInwMintingCapAndTotalSupply();
        getInfo();
      }),
      {
        loading: "Fetching new data ... ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  };

  const inwPrivateMintHandler = async () => {
    console.log(inwPrice, inwBuyAmount);
    if (!api) {
      toast.error(toastMessages.ERR_API_CONN);
      return;
    }

    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }
    await execContractTx(
      currentAccount,
      api,
      private_sale.CONTRACT_ABI,
      private_sale.CONTRACT_ADDRESS,
      parseUnits(roundUp(inwPrice * inwBuyAmount, 4).toString(), 12), //-> value
      "genericTokenSaleTrait::purchase",
      formatNumToBN(inwBuyAmount) // -> token_amount, <...args>
    );

    await delay(5000);
    resetField();
    toast.promise(
      delay(1000).then(() => {
        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        getInwMintingCapAndTotalSupply();
        getInfo();
      }),
      {
        loading: "Fetching new data ... ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  };

  const claimPrivateInw = async () => {
    if (!api) {
      toast.error(toastMessages.ERR_API_CONN);
      return;
    }

    if (!currentAccount) {
      toast.error(toastMessages.NO_WALLET);
      return;
    }

    await execContractTx(
      currentAccount,
      api,
      private_sale.CONTRACT_ABI,
      private_sale.CONTRACT_ADDRESS,
      0, //-> value
      "genericTokenSaleTrait::claim"
    );

    await delay(5000);

    toast.promise(
      delay(1000).then(() => {
        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
        }

        getInwMintingCapAndTotalSupply();
        getInfo();
      }),
      {
        loading: "Fetching new data ... ",
        success: "Done !",
        error: "Could not fetch data!!!",
      }
    );
  };

  const checkNumeric = (text) => /^\d*(\.\d*)?$/.test(text);
  const onChangeAzeroInput = ({ target }) => {
    if (checkNumeric(target.value) == true) {
      setAzeroBuyAmount(target.value);
      setInwBuyAmount(roundDown(target.value / parseFloat(inwPrice)));
    }
  };

  const onChangeInwInput = ({ target }) => {
    if (checkNumeric(target.value) == true) {
      setInwBuyAmount(target.value);
      setAzeroBuyAmount(roundUp(target.value * parseFloat(inwPrice)));
    }
  };

  const resetField = () => {
    setInwBuyAmount("");
    setAzeroBuyAmount("");
  };

  const [isBigScreen] = useMediaQuery("(min-width: 480px)");

  const tabsData = [
    {
      label: <>Public Sale with Vesting</>,
      component: !isSaleEnded ? (
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex justifyContent={"space-between"}>
              {/* <Heading as="h4" size="h4" lineHeight="25px">
                Acquire INW Tokens
              </Heading> */}
              <Flex>
                {saleInfo?.endTimeSale ? (
                  notSaleStart ? (
                    <>
                      Sale start in:{" "}
                      <Text paddingLeft={"4px"}>
                        <IWCountDown date={+saleInfo?.startTimeSale} />{" "}
                      </Text>{" "}
                    </>
                  ) : !isSaleEnded ? (
                    <>
                      Sale end in:{" "}
                      <Text paddingLeft={"4px"}>
                        <IWCountDown date={+saleInfo?.endTimeSale} />{" "}
                      </Text>{" "}
                    </>
                  ) : (
                    <>Ended</>
                  )
                ) : (
                  ""
                )}
              </Flex>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <IWInput
                value={inwBuyAmount}
                onChange={onChangeInwInput}
                type="number"
                placeholder="Enter INW amount"
                inputRightElementIcon={
                  <Heading as="h5" size="h5" fontWeight="semibold">
                    INW
                  </Heading>
                }
              />

              <IWInput
                type="number"
                value={azeroBuyAmount}
                onChange={onChangeAzeroInput}
                placeholder="Enter AZERO amount"
                inputRightElementIcon={<AzeroLogo />}
              />
              {inwPrice > 0 && (
                <Flex
                  mt={{ base: "15px", lg: "0px" }}
                  w="full"
                  flexDirection={{ base: "column", lg: "row" }}
                  justifyContent="space-between"
                >
                  <Text textAlign="left" fontSize="md" lineHeight="28px">
                    Price: {inwPrice} Azero / INW
                  </Text>
                  <Text textAlign="left" fontSize="md" lineHeight="28px">
                    INW Available to acquire: {availableMint}
                  </Text>
                </Flex>
              )}
              {inwBuyAmount ? (
                <Flex
                  mt={{ base: "15px", lg: "0px" }}
                  w="full"
                  justifyContent="space-between"
                >
                  <Text textAlign="left" fontSize="md" lineHeight="28px">
                    You will receive {roundUp((inwBuyAmount * 5) / 100)} INW (5%
                    of total purchase) and the rest will be claimable every day
                    during 18-month vesting period. Vesting period starts after
                    public sale ends.
                    {/* , then linear vesting over the next 24 months */}
                  </Text>
                </Flex>
              ) : (
                ""
              )}
              <Button
                w="full"
                onClick={inwPrivateMintHandler}
                disabled={disableBuyBtn}
              >
                Buy INW
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
      ) : (
        <>
          <CardThreeColumn
            title="Public Sale Vesting"
            data={[
              {
                title: "Claimable Amount",
                content: `${formatNumDynDecimal(
                  saleInfo?.unclaimAmount / 10 ** 12,
                  2
                )} INW`,
              },
              {
                title: "Total Claimed Amount",
                content: `${saleInfo?.buyerInfo?.claimedAmount} INW`,
              },
              {
                title: "Allocation",
                content: `${saleInfo?.buyerInfo?.purchasedAmount} INW`,
              },
              {
                title: "Vesting Duration",
                content: `${
                  saleInfo?.vestingDuration / 60 / 60 / 24 / 1000
                } days`,
              },
              {
                title: "Vesting Start Date/Time",
                content: new Date(+saleInfo?.endTimeSale).toLocaleString(
                  "en-US"
                ),
              },
              {
                title: "Vesting End Date/Time",
                content: new Date(
                  +saleInfo?.endTimeSale + +saleInfo?.vestingDuration
                ).toLocaleString("en-US"),
              },
            ]}
          />
          {/* <Button
            w="full"
            mt="20px"
            onClick={claimPrivateInw}
            disabled={!(+saleInfo?.unclaimAmount > 0)}
          >
            Claim INW
          </Button> */}
          <IWCountDownClaim
            onClick={claimPrivateInw}
            disabled={!(+saleInfo?.unclaimAmount > 0)}
            startDate={new Date(+saleInfo?.endTimeSale)}
            endDate={
              new Date(+saleInfo?.endTimeSale + +saleInfo?.vestingDuration)
            }
          />
        </>
      ),
      isDisabled: false,
    },
    {
      label: `${isBigScreen ? "Public Sale" : ""} No Vesting`,
      component: (
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex justifyContent={"space-between"}>
              {/* <Heading as="h4" size="h4" lineHeight="25px">
                Acquire INW Tokens
              </Heading> */}
              <Flex>
                {saleInfo?.endTimeSale ? (
                  notSaleStart ? (
                    <>
                      Sale start in:{" "}
                      <Text paddingLeft={"4px"}>
                        <IWCountDown date={+saleInfo?.startTimeSale} />{" "}
                      </Text>{" "}
                    </>
                  ) : !isSaleEnded ? (
                    <>
                      Sale end in:{" "}
                      <Text paddingLeft={"4px"}>
                        <IWCountDown date={+saleInfo?.endTimeSale} />{" "}
                      </Text>{" "}
                    </>
                  ) : (
                    <>Ended</>
                  )
                ) : (
                  ""
                )}
              </Flex>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Stack
              w="100%"
              spacing="20px"
              direction={{ base: "column" }}
              align={{ base: "column", xl: "center" }}
            >
              <IWInput
                value={inwBuyAmount}
                onChange={onChangeInwInput}
                type="number"
                placeholder="Enter INW amount"
                inputRightElementIcon={
                  <Heading as="h5" size="h5" fontWeight="semibold">
                    INW
                  </Heading>
                }
              />

              <IWInput
                type="number"
                value={azeroBuyAmount}
                onChange={onChangeAzeroInput}
                placeholder="Enter AZERO amount"
                inputRightElementIcon={<AzeroLogo />}
              />
              {inwPrice > 0 && (
                <Flex
                  mt={{ base: "15px", lg: "0px" }}
                  w="full"
                  flexDirection={{ base: "column", lg: "row" }}
                  justifyContent="space-between"
                >
                  <Text textAlign="left" fontSize="md" lineHeight="28px">
                    Price: {inwPrice} Azero / INW
                  </Text>
                  <Text textAlign="left" fontSize="md" lineHeight="28px">
                    INW Available to acquire: {availableMint}
                  </Text>
                </Flex>
              )}

              {inwBuyAmount ? (
                <Flex
                  mt={{ base: "15px", lg: "0px" }}
                  w="full"
                  justifyContent="space-between"
                >
                  <Text textAlign="left" fontSize="md" lineHeight="28px">
                    You will receive full amount of INW right after the
                    purchase.
                  </Text>
                </Flex>
              ) : (
                ""
              )}
              <Button
                w="full"
                onClick={inwPublicMintHandler}
                disabled={disableBuyBtn}
              >
                Buy INW
              </Button>
            </Stack>
          </IWCard>
        </IWCard>
      ),
      isDisabled: false,
    },
  ];

  return (
    <>
      <SectionContainer
        mt={{ base: "0px", xl: "8px" }}
        title="INW Tokens"
        description={
          <>
            Check INW token information and acquire INW to be able to use
            platform features
          </>
        }
      >
        <Stack
          w="full"
          spacing="30px"
          alignItems="start"
          direction={{ base: "column", lg: "row" }}
        >
          <IWCardOneColumn
            title="Ink Whale Token (INW)"
            data={[
              {
                title: "Contract Address",
                content: <AddressCopier address={inwContractAddress} />,
              },
              { title: "Total Supply", content: `${inwTotalSupply} INW` },
              { title: "In Circulation ", content: `${inwInCur} INW` },
              {
                title: "Total Burned ",
                content: `${formatNumDynDecimal(inwBurn)} INW`,
              },
              {
                title: "Your Vesting Amount ",
                content: `${formatNumDynDecimal(
                  (+saleInfo?.buyerInfo?.purchasedAmount?.replaceAll(",", "") *
                    95) /
                    100 || 0
                )} INW`,
              },
              { title: "Your Balance: ", content: `${inwBalance} INW` },
            ]}
          />
          <Box w={"full"}>
            <SaleTab
              tabsData={tabsData}
              tabIndex={tabIndex}
              onChangeTab={(index) => {
                setTabIndex(index);
              }}
            />
          </Box>
        </Stack>
      </SectionContainer>
    </>
  );
}
