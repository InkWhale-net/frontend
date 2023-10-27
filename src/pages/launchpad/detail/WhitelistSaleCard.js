import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Box, Button, Link, Text } from "@chakra-ui/react";
import { APICall } from "api/client";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";
import { toastMessages } from "constants";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { useMemo, useState } from "react";
import Countdown from "react-countdown";
import { toast } from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  delay,
  formatNumToBN,
  formatTokenAmount,
  roundDown,
  roundUp,
} from "utils";
import { execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const IWCountDown = ({ saleTime, phaseContainWL, launchpadData }) => {
  const renderer = ({ completed }) => {
    const now = Date.now();
    const livePhase = saleTime?.find((e) => {
      return now > e.startTime && now < e.endTime;
    });
    const nearestPhase = saleTime?.reduce((acc, object) => {
      if (!acc && object?.startTime > now) return object;
      else {
        if (acc?.startTime > object?.startTime && object?.startTime > now)
          return object;
        else return acc;
      }
    }, null);
    if (completed) {
      return null;
    } else if (livePhase) {
      return (
        <SaleLayout
          launchpadData={launchpadData}
          saleTime={saleTime}
          livePhase={livePhase}
        />
        // <Box>
        //   <Box>
        //     {saleTime.map((e, index) => (

        //     ))}
        //   </Box>
        //   <Box sx={{ display: "flex", marginTop: "20px" }}>
        //     <Text>Active phase: </Text>
        //     <Text sx={{ fontWeight: "bold", color: "#57527E" }}>
        //       {" "}
        //       {livePhase?.name}
        //     </Text>
        //   </Box>
        //   <SaleLayout

        //   />
        // </Box>
      );
    } else if (nearestPhase) {
      return (
        <SaleLayout
          launchpadData={launchpadData}
          saleTime={saleTime}
          livePhase={nearestPhase}
          upComing
        />
      );
    } else return null;
  };
  const endTime =
    saleTime?.length > 0 ? saleTime[saleTime?.length - 1]?.endTime : null;
  if (saleTime?.length > 0)
    return <Countdown date={endTime} renderer={renderer} />;
  else return null;
};

const SaleLayout = ({ launchpadData, livePhase, saleTime, upComing }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [amount, setAmount] = useState(null);
  const [azeroBuyAmount, setAzeroBuyAmount] = useState(0);

  const isUserInWL = useMemo(() => {
    return (
      livePhase?.whitelist?.find(
        (e) => e?.account === currentAccount?.address
      ) ||
      upComing?.whitelist?.find((e) => e?.account === currentAccount?.address)
    );
  }, [livePhase, upComing, currentAccount]);
  const dispatch = useDispatch();

  const wlBuyHandler = async (maxAllowWlPurchase) => {
    try {
      if (!api) {
        toast.error(toastMessages.ERR_API_CONN);
        return;
      }

      if (!currentAccount) {
        toast.error(toastMessages.NO_WALLET);
        return;
      }
      if (parseFloat(amount) > maxAllowWlPurchase) {
        toast.error(
          `Current max whitelist sale available is ${maxAllowWlPurchase}`
        );
        return;
      }
      const buyResult = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        parseUnits(azeroBuyAmount.toString(), 12), //-> value
        "launchpadContractTrait::whitelistPurchase",
        livePhase?.id,
        formatNumToBN(
          parseFloat(amount),
          parseInt(launchpadData.projectInfo.token.decimals)
        )
      );
      if (!buyResult) return;
      await delay(400);
      await APICall.askBEupdate({
        type: "launchpad",
        poolContract: launchpadData?.launchpadContract,
      });
      setAmount(0);
      setAzeroBuyAmount(0);
      await delay(4000);
      if (currentAccount) {
        dispatch(fetchUserBalance({ currentAccount, api }));
        dispatch(fetchLaunchpads({}));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const wlBuyMutation = useMutation(async (maxAllowWlPurchase) => {
    await new Promise(async (resolve) => {
      await wlBuyHandler(maxAllowWlPurchase);
      resolve();
    });
  }, "wl_purchase");
  return (
    <Box
      sx={{
        marginTop: "12px",
        border: "2.8px solid #E3DFF3",
        borderRadius: "8px",
        paddingTop: "16px",
        paddingLeft: "16px",
        paddingRight: "16px",
        paddingBottom: "12px",
        color: "#57527E",
      }}
    >
      <Text fontWeight="600" size="md">
        {isUserInWL ? "You are in whitelist" : <>You are not in whitelist.</>}
      </Text>
      {isUserInWL && (
        <>
          <Box sx={{ mt: "20px" }}>
            {saleTime?.map((obj, index) => {
              const buyerInformation = obj?.whitelist?.find(
                (e) => e?.account === currentAccount?.address
              );
              const allowBuy = index === livePhase?.id;
              const wlTokenPriceStr = formatTokenAmount(
                buyerInformation?.price,
                12
              );
              const wlTokenPrice = parseFloat(wlTokenPriceStr);

              const wlMaxAmount = parseFloat(
                formatTokenAmount(
                  buyerInformation?.amount,
                  parseInt(launchpadData.projectInfo.token.decimals)
                )
              );
              const wlPurchasedAmount = roundUp(
                parseFloat(
                  formatTokenAmount(
                    buyerInformation?.purchasedAmount,
                    parseInt(launchpadData.projectInfo.token.decimals)
                  )
                )
              );

              const maxAmount = +wlMaxAmount - +wlPurchasedAmount;
              if (allowBuy) {
                return (
                  <>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      Max amount
                      <Text size="md">{wlMaxAmount}</Text>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                      }}
                    >
                      Purchased
                      <Text size="md">{wlPurchasedAmount}</Text>
                    </Box>
                    <>
                      <Box sx={{ marginTop: "20px", marginBottom: "8px" }}>
                        <IWInput
                          isDisabled={upComing || !(+maxAmount > 0)}
                          onChange={({ target }) => {
                            setAmount(target.value);
                            setAzeroBuyAmount(
                              roundUp(parseFloat(target.value) * wlTokenPrice),
                              4
                            );
                          }}
                          type="number"
                          value={amount}
                          label={
                            <Text fontSize={"16px"}>
                              Amount (max: {maxAmount})
                            </Text>
                          }
                          placeholder="0"
                          inputRightElementIcon={
                            launchpadData?.projectInfo?.token?.symbol
                          }
                        />
                      </Box>
                      <IWInput
                        isDisabled={upComing || !(+maxAmount > 0)}
                        onChange={({ target }) => {
                          setAzeroBuyAmount(target.value);
                          setAmount(
                            roundDown(
                              parseFloat(target.value) /
                                parseFloat(wlTokenPrice)
                            )
                          );
                        }}
                        type="number"
                        value={azeroBuyAmount}
                        // label={`Amount (max)`}
                        placeholder="0"
                        inputRightElementIcon={<AzeroLogo />}
                      />
                      <div
                        style={{
                          fontSize: "14px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Token price: {wlTokenPriceStr}
                        <AzeroLogo
                          sx={{
                            display: "flex",
                            marginLeft: "4px",
                          }}
                        />
                      </div>
                      <Box sx={{ display: "flex" }}>
                        <Button
                          isLoading={wlBuyMutation.isLoading}
                          isDisabled={
                            !allowBuy || !(parseFloat(amount) > 0) || upComing
                          }
                          sx={{ flex: 1, height: "40px", marginTop: "8px" }}
                          onClick={() =>
                            wlBuyMutation.mutate(
                              wlMaxAmount - wlPurchasedAmount
                            )
                          }
                          spinner={<BeatLoader size={8} color="white" />}
                        >
                          Whitelist Purchase
                        </Button>
                      </Box>
                    </>
                  </>
                );
              } else {
                return null;
              }
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

const WhitelistSaleCard = ({ launchpadData }) => {
  const phaseContainWL = useMemo(() => {
    return launchpadData?.phaseList?.filter(
      (phase) => phase?.whitelist?.length > 0
    );
  }, [launchpadData]);

  // const containerPhases = useMemo(() => {
  //   return launchpadData?.phaseList?.filter((phase) => {
  //     for (const obj of phase?.whitelist) {
  //       if (obj.account === currentAccount?.address) {
  //         return phase;
  //       }
  //     }
  //     return false;
  //   });
  // }, [launchpadData]);

  const saleTime = useMemo(
    () =>
      phaseContainWL?.map((e, index) => ({
        ...e,
        id: index,
        startTime: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
        endTime: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      })),
    [phaseContainWL]
  );
  // if (!(containerPhases?.length > 0)) return null;
  return (
    <IWCountDown
      launchpadData={launchpadData}
      phaseContainWL={phaseContainWL}
      saleTime={saleTime}
    />
  );
};

export default WhitelistSaleCard;

export const KycLayout = ({ launchpadData, upComing }) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const phaseContainWL = useMemo(() => {
    return launchpadData?.phaseList?.filter(
      (phase) => phase?.whitelist?.length > 0
    );
  }, [launchpadData]);

  const saleTime = useMemo(
    () =>
      phaseContainWL?.map((e, index) => ({
        ...e,
        id: index,
        startTime: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
        endTime: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      })),
    [phaseContainWL]
  );

  const livePhase = saleTime?.find((e) => {
    const now = Date.now();
    return now > e.startTime && now < e.endTime;
  });

  const isUserInWL = useMemo(() => {
    return (
      livePhase?.whitelist?.find(
        (e) => e?.account === currentAccount?.address
      ) ||
      upComing?.whitelist?.find((e) => e?.account === currentAccount?.address)
    );
  }, [livePhase, upComing, currentAccount]);

  const kycUrl = `https://verify-with.blockpass.org/?env=prod&auto=1&clientId=${launchpadData?.launchpadContract}&refId=${currentAccount?.address}`;

  // const urlencodedOptions = encodeURIComponent(window?.location?.href);
  // const appLink = `blockpass://service-register/Client_ID?refId=${currentAccount?.address}&redirect=${urlencodedOptions}`;

  return !isUserInWL && launchpadData?.requireKyc ? (
    <>
      <Box
        sx={{
          marginTop: "12px",
          border: "2.8px solid #E3DFF3",
          borderRadius: "8px",
          padding: "16px",
          paddingBottom: "12px",
          color: "#57527E",
        }}
      >
        <Link href={kycUrl} isExternal>
          Click here to KYC
          <ExternalLinkIcon mx="2px" />
        </Link>
      </Box>
    </>
  ) : null;
};
