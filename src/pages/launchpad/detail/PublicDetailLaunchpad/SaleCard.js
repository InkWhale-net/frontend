import { Box, Button, Flex, Heading, Progress, Text } from "@chakra-ui/react";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";
import { toastMessages } from "constants";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { useEffect } from "react";
import { useState } from "react";
import { useMemo } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { roundUp } from "utils";
import { delay } from "utils";
import { formatNumToBN } from "utils";
import { formatTokenAmount } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const TimeBox = ({ value, isLast = false }) => {
  return (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          background: "#FEEEBD",
          width: "40px",
          height: "40px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          fontWeight: "bold",
          borderRadius: "4px",
        }}
      >
        {value}
      </Box>
      {isLast || (
        <Box
          sx={{
            fontWeight: "bold",
            marginLeft: "4px",
            marginRight: "4px",
          }}
        >
          :
        </Box>
      )}
    </Box>
  );
};

const SaleCount = ({ label, time, direction }) => {
  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <></>;
    } else {
      return (
        <Box
          display="flex"
          sx={{
            justifyContent: "center",
            alignItems: "center",
            marginTop: "10px",
          }}
        >
          <TimeBox value={zeroPad(days)} />
          <TimeBox value={zeroPad(hours)} />
          <TimeBox value={zeroPad(minutes)} />
          <TimeBox value={zeroPad(seconds)} isLast />
        </Box>
      );
    }
  };
  return (
    <Box>
      <Heading sx={{ textAlign: "center" }} size="md">
        Sale end in
      </Heading>
      {time ? (
        <Countdown date={time} renderer={renderer} />
      ) : (
        <Text sx={{ fontWeight: "bold", color: "#57527E" }}>00:00:00:00</Text>
      )}
    </Box>
  );
};

const IWCountDown = ({ saleTime, launchpadData }) => {
  const renderer = ({ completed }) => {
    const now = Date.now();
    const livePhase = saleTime?.find((e) => {
      return now > e.startTime && now < e.endTime;
    });
    if (completed) {
      return <SaleCount label="Sale ended!" />;
    } else if (livePhase) {
      return (
        <Box>
          <SaleCount label="Sale end in" time={livePhase?.endTime} />
          <Box sx={{ display: "flex", marginTop: "20px" }}>
            <Text>Active phase: </Text>
            <Text sx={{ fontWeight: "bold", color: "#57527E" }}>
              {" "}
              {livePhase?.name}
            </Text>
          </Box>
          <SaleLayout launchpadData={launchpadData} livePhase={livePhase} />
        </Box>
      );
    }
    // else if (now < startDate) {
    //   return (
    //     <SaleCount
    //       label="Sale start in"
    //       time={startDate}
    //       direction={direction}
    //     />
    //   );
    // } else if (now >= startDate && now < endDate) {
    //   return (
    //     <SaleCount label="Sale end in" time={endDate} direction={direction} />
    //   );
    // }
    else return null;
  };
  const endTime = saleTime[saleTime?.length - 1]?.endTime;
  if (saleTime?.length > 0)
    return <Countdown date={endTime} renderer={renderer} />;
  else return null;
};
const SaleLayout = ({ launchpadData, livePhase }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [amount, setAmount] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [azeroBuyAmount, setAzeroBuyAmount] = useState(0);
  const [txRate, setTxRate] = useState(null);
  const dispatch = useDispatch();

  const saleQuery = useQuery("query-public-sale", async () => {
    await new Promise(async (resolve) => {
      await getPublicSaleInfo();
      resolve();
    });
  });
  const purchasePublicHandler = async () => {
    try {
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
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        parseUnits(
          (
            tokenPrice *
            formatNumToBN(
              amount,
              parseInt(launchpadData.projectInfo.token.decimals)
            )
          ).toString(),
          12
        ), //-> value
        "launchpadContractTrait::publicPurchase",
        livePhase?.id,
        formatNumToBN(
          amount,
          parseInt(launchpadData.projectInfo.token.decimals)
        )
      );
      // await delay(5000);
      // saleQuery.refetch();
      // toast.promise(
      //   delay(1000).then(() => {
      //     if (currentAccount) {
      //       dispatch(fetchUserBalance({ currentAccount, api }));
      //     }
      //   }),
      //   {
      //     loading: "Fetching new data ... ",
      //     success: "Done !",
      //     error: "Could not fetch data!!!",
      //   }
      // );
    } catch (error) {
      console.log(error);
    }
  };
  const publicBuyMutation = useMutation(async () => {
    await new Promise(async (resolve) => {
      await purchasePublicHandler();
      resolve();
    });
  }, "public_purchase");
  const getPublicSaleInfo = async () => {
    try {
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getPublicSaleTotalAmount",
        livePhase?.id
      );
      const publicSaleTotalBuyedAmount = result.toHuman()?.Ok;
      console.log(publicSaleTotalBuyedAmount);
      // const result = await execContractQuery(
      //   currentAccount?.address,
      //   "api",
      //   launchpad.CONTRACT_ABI,
      //   launchpadData?.launchpadContract,
      //   0,
      //   "launchpadContractTrait::getPublicSaleTotalPurchasedAmount",
      //   livePhase?.id
      // );
      // const publicSaleTotalBuyedAmount = result.toHuman()?.Ok;
      const result1 = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getPublicSalePrice",
        livePhase?.id
      );
      const publicSalePrice = result1.toHuman()?.Ok;
      setTokenPrice(parseFloat(formatTokenAmount(publicSalePrice, 12)));
      const result2 = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getTxRate"
      );
      const txRateCT = result2.toHuman()?.Ok;
      setTxRate(parseFloat(txRateCT) / 100);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box sx={{ marginTop: "12px" }}>
        <Heading size="md">Progress {`(00.00%)`}</Heading>
        <Progress sx={{ marginTop: "4px" }} w="full" value={0} size="sm" />
      </Box>
      <Box sx={{ marginTop: "12px", marginBottom: "8px" }}>
        <IWInput
          onChange={({ target }) => {
            setAmount(target.value);
            setAzeroBuyAmount(roundUp(target.value * parseFloat(tokenPrice)));
          }}
          type="number"
          value={amount}
          // label={`Amount (max)`}
          placeholder="0"
          inputRightElementIcon={launchpadData?.projectInfo?.token?.symbol}
        />
      </Box>
      <IWInput
        onChange={({ target }) => {
          setAmount(target.value);
        }}
        type="number"
        value={azeroBuyAmount}
        // label={`Amount (max)`}
        placeholder="0"
        inputRightElementIcon={<AzeroLogo />}
      />
      <div style={{ fontSize: "14px", display: "flex", alignItems: "center" }}>
        Token price: {tokenPrice}
        <div style={{ marginLeft: "4px" }}>
          <AzeroLogo />
        </div>
      </div>
      <div style={{ fontSize: "14px" }}>Transaction fee is {txRate}%</div>
      <Box sx={{ display: "flex" }}>
        <Button
          sx={{ flex: 1, height: "40px", marginTop: "8px" }}
          onClick={() => publicBuyMutation.mutate()}
        >
          Public Buy
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
  );
};

const SaleCard = ({ launchpadData }) => {
  const saleTime = useMemo(
    () =>
      launchpadData?.phaseList.map((e, index) => ({
        ...e,
        id: index,
        startTime: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
        endTime: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      })),
    [launchpadData]
  );
  return (
    <Box
      sx={{
        border: "2.8px solid #93F0F5",
        borderRadius: "8px",
        paddingTop: "16px",
        paddingLeft: "8px",
        paddingRight: "8px",
        paddingBottom: "12px",
      }}
    >
      {saleTime?.length > 0 && (
        <IWCountDown launchpadData={launchpadData} saleTime={saleTime} />
      )}
      {/* <Heading sx={{ textAlign: "center" }} size="md">
        Sale end in
      </Heading> */}

      {/* <Box sx={{ marginTop: "12px" }}>
        <Heading size="md">Progress {`(00.00%)`}</Heading>
        <Progress sx={{ marginTop: "4px" }} w="full" value={0} size="sm" />
      </Box>
      <Box sx={{ marginTop: "12px" }}>
        <IWInput
          onChange={({ target }) => {
            // setSelectedContractAddr(target.value)
          }}
          value={"0.0"}
          label={`Amount (max)`}
        />
      </Box>
      <Box sx={{ display: "flex" }}>
        <Button
          sx={{ flex: 1, height: "40px", marginTop: "8px" }}
          onClick={() => {}}
        >
          Public Buy
        </Button>
        <Button
          sx={{ flex: 1, marginLeft: "8px", height: "40px", marginTop: "8px" }}
          onClick={() => {}}
        >
          Whitelist Buy
        </Button>
      </Box> */}
    </Box>
  );
};

export default SaleCard;
