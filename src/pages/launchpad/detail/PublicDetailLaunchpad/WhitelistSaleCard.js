import {
  Box,
  Button,
  Divider,
  Text,
  Progress,
  Heading,
} from "@chakra-ui/react";
import { AzeroLogo } from "components/icons/Icons";
import { useAppContext } from "contexts/AppContext";
import { useCallback, useMemo } from "react";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { formatNumToBN } from "utils";
import { execContractTxAndCallAPI } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import { BeatLoader } from "react-spinners";
import { useMutation, useQuery } from "react-query";
import { toastMessages } from "constants";
import { execContractTx } from "utils/contracts";
import { parseUnits } from "ethers";
import { delay } from "utils";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { formatTokenAmount } from "utils";
import { roundUp } from "utils";
import IWInput from "components/input/Input";
import { APICall } from "api/client";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { roundDown } from "utils";

const IWCountDown = ({ saleTime, launchpadData }) => {
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
    }
    // else if (nearestPhase) {
    //   return (
    //     <Box>
    //       <SaleCount label="Sale start in" time={nearestPhase?.startTime} />
    //       <Box sx={{ display: "flex", marginTop: "20px" }}>
    //         <Text>Upcoming phase: </Text>
    //         <Text sx={{ fontWeight: "bold", color: "#57527E" }}>
    //           {" "}
    //           {nearestPhase?.name}
    //         </Text>
    //       </Box>
    //       <SaleLayout launchpadData={launchpadData} livePhase={nearestPhase} />
    //     </Box>
    //   );
    // } else return null;
  };
  const endTime = saleTime[saleTime?.length - 1]?.endTime;
  if (saleTime?.length > 0)
    return <Countdown date={endTime} renderer={renderer} />;
  else return null;
};

const SaleLayout = ({ launchpadData, livePhase, saleTime }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [amount, setAmount] = useState(null);
  const [azeroBuyAmount, setAzeroBuyAmount] = useState(0);

  const dispatch = useDispatch();

  const wlPublicHandler = async (maxAllowWlPurchase) => {
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
          `Current max public sale available is ${maxAllowWlPurchase}`
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
        dispatch(fetchLaunchpads({ isActive: 0 }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  const publicBuyMutation = useMutation(async (maxAllowWlPurchase) => {
    await new Promise(async (resolve) => {
      await wlPublicHandler(maxAllowWlPurchase);
      resolve();
    });
  }, "public_purchase");

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
        You are in whitelist
      </Text>

      <Box sx={{ mt: "20px" }}>
        {saleTime?.map((obj, index) => {
          const buyerInformation = obj?.whitelist?.find(
            (e) => e?.account == currentAccount?.address
          );
          const allowBuy = index == livePhase?.id;
          const wlTokenPrice = parseFloat(
            formatTokenAmount(buyerInformation?.price, 12)
          );
          const wlMaxAmount = parseFloat(
            formatTokenAmount(
              buyerInformation?.amount,
              parseInt(launchpadData.projectInfo.token.decimals)
            )
          );
          const wlPurchasedAmount = roundUp(
            parseFloat(formatTokenAmount(buyerInformation?.purchasedAmount, parseInt(launchpadData.projectInfo.token.decimals)))
          );
          if (allowBuy)
            return (
              <>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  Buy Phase
                  <Text
                    key={index}
                    size="md"
                    sx={{
                      marginTop: index > 0 && "16px",
                      // color: !allowBuy ? "#D7D5E5" : null,
                    }}
                  >
                    {`${obj?.name}${`${
                      !allowBuy ? "(Not available yet)" : ""
                    }`}`}
                  </Text>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  Price
                  <Text
                    size="md"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {wlTokenPrice}
                    <AzeroLogo
                      sx={{
                        marginLeft: "4px",
                      }}
                      fontSize="14px"
                    />
                  </Text>
                </Box>
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
                {allowBuy && (
                  <>
                    <Box sx={{ marginTop: "20px", marginBottom: "8px" }}>
                      <IWInput
                        onChange={({ target }) => {
                          console.log(target.value, 'target.value');
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
                            Amount (max: {wlMaxAmount - wlPurchasedAmount})
                          </Text>
                        }
                        placeholder="0"
                        inputRightElementIcon={
                          launchpadData?.projectInfo?.token?.symbol
                        }
                      />
                    </Box>
                    <IWInput
                      onChange={({ target }) => {
                        setAzeroBuyAmount(target.value);
                        setAmount(
                          roundDown(
                            parseFloat(target.value) / parseFloat(wlTokenPrice)
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
                      Token price: {wlTokenPrice}
                      <AzeroLogo
                        sx={{
                          display: "flex",
                          marginLeft: "4px",
                        }}
                      />
                    </div>
                    <Box sx={{ display: "flex" }}>
                      <Button
                        isLoading={publicBuyMutation.isLoading}
                        isDisabled={!allowBuy || !(parseFloat(amount) > 0)}
                        sx={{ flex: 1, height: "40px", marginTop: "8px" }}
                        onClick={() =>
                          publicBuyMutation.mutate(
                            wlMaxAmount - wlPurchasedAmount
                          )
                        }
                        spinner={<BeatLoader size={8} color="white" />}
                      >
                        Whitelist Purchase
                      </Button>
                      {/* <Button
            sx={{
              flex: 1,
              marginLeft: "8px",
              height: "40px",
              marginTop: "8px",
            }}
            onClick={() => {}}
          >
            Whitelist Buy
          </Button> */}
                    </Box>
                  </>
                )}
              </>
            );
        })}
      </Box>
    </Box>
  );
};

const WhitelistSaleCard = ({ launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);

  const containerPhases = useMemo(() => {
    return launchpadData?.phaseList?.filter((phase) => {
      for (const obj of phase?.whitelist) {
        if (obj.account === currentAccount?.address) {
          return phase;
        }
      }
      return false;
    });
  }, [launchpadData]);

  const saleTime = useMemo(
    () =>
      containerPhases?.map((e, index) => ({
        ...e,
        id: index,
        startTime: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
        endTime: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      })),
    [containerPhases]
  );
  if (!(containerPhases?.length > 0)) return null;
  return <IWCountDown launchpadData={launchpadData} saleTime={saleTime} />;
};

export default WhitelistSaleCard;
