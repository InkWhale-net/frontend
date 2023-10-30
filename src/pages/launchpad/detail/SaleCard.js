import { Box, Button, Heading, Progress, Text } from "@chakra-ui/react";
import { APICall } from "api/client";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";
import { toastMessages } from "constants";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import { useMemo, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { toast } from "react-hot-toast";
import { useMutation, useQuery } from "react-query";
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
import { execContractQuery, execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
const headerSX = {
  fontWeight: "700",
  color: "#57527E",
};
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
        {label}
      </Heading>
      {time ? (
        <Countdown date={time} renderer={renderer} />
      ) : (
        <Text sx={{ fontWeight: "bold", color: "#57527E" }}>
          <Box
            display="flex"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <TimeBox value={"00"} />
            <TimeBox value={"00"} />
            <TimeBox value={"00"} />
            <TimeBox value={"00"} isLast />
          </Box>
        </Text>
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
    const nearestPhase = saleTime?.reduce((acc, object) => {
      if (!acc && object?.startTime > now) return object;
      else {
        if (acc?.startTime > object?.startTime && object?.startTime > now)
          return object;
        else return acc;
      }
    }, null);
    if (completed) {
      return (
        <Box sx={{ paddingBottom: "10px" }}>
          <SaleCount label="Ended" time={null} />
          {nearestPhase?.name && (
            <>
              <Box sx={{ display: "flex", marginTop: "20px" }}>
                <Text>Upcoming phase: </Text>
                <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                  {" "}
                  {nearestPhase?.name}
                </Text>
              </Box>
              <SaleLayout launchpadData={launchpadData} livePhase={null} />
            </>
          )}
        </Box>
      );
    } else if (livePhase) {
      return (
        <Box>
          <SaleCount label="Sale end in" time={livePhase?.endTime} />
          <Box sx={{ display: "flex", marginTop: "20px" }}>
            <Text>Active phase: </Text>
            <Text sx={{ fontWeight: "600", color: "#57527E" }}>
              {" "}
              {livePhase?.name}
            </Text>
          </Box>
          {livePhase?.publicSaleInfor?.isPublic && (
            <SaleLayout
              launchpadData={launchpadData}
              livePhase={livePhase}
              allowBuy
            />
          )}
        </Box>
      );
    } else if (nearestPhase) {
      return (
        <Box>
          <SaleCount label="Sale start in" time={nearestPhase?.startTime} />
          <Box sx={{ display: "flex", marginTop: "20px" }}>
            <Text>Upcoming phase: </Text>
            <Text sx={{ fontWeight: "bold", color: "#57527E" }}>
              {" "}
              {nearestPhase?.name}
            </Text>
          </Box>
          <SaleLayout launchpadData={launchpadData} livePhase={nearestPhase} />
        </Box>
      );
    } else return null;
  };
  const endTime = saleTime[saleTime?.length - 1]?.endTime;
  if (saleTime?.length > 0)
    return <Countdown date={endTime} renderer={renderer} />;
  else return null;
};
const SaleLayout = ({ launchpadData, livePhase, allowBuy }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();
  const [amount, setAmount] = useState(null);
  const [tokenPrice, setTokenPrice] = useState(0);
  const [azeroBuyAmount, setAzeroBuyAmount] = useState(0);
  const [publicSaleAmount, setPublicSale] = useState({
    purchased: 0,
    total: 0,
  });

  const dispatch = useDispatch();

  const saleQuery = useQuery(
    ["query-public-sale", currentAccount, launchpadData],
    async () => {
      if (currentAccount)
        await new Promise(async (resolve) => {
          await getPublicSaleInfo();
          resolve();
        });
    }
  );
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
      if (
        parseFloat(amount) + parseFloat(publicSaleAmount?.purchased) >
        parseFloat(publicSaleAmount?.total)
      ) {
        toast.error(
          `Current max public sale available is ${
            publicSaleAmount?.total - publicSaleAmount?.purchased
          }`
        );
        return;
      }
      const buyResult = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        parseUnits(azeroBuyAmount.toString(), 12), //-> value
        "launchpadContractTrait::publicPurchase",
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
      saleQuery.refetch();
      await delay(4000);
      if (currentAccount) {
        dispatch(fetchUserBalance({ currentAccount, api }));
        dispatch(fetchLaunchpads({}));
      }
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
      const result0 = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getPublicSaleTotalAmount",
        livePhase?.id
      );
      const publicSaleTotalAmount = result0.toHuman()?.Ok;
      const result = await execContractQuery(
        currentAccount?.address,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getPublicSaleTotalPurchasedAmount",
        livePhase?.id
      );
      const publicSaleTotalBuyedAmount = result.toHuman()?.Ok;
      setPublicSale({
        total: parseFloat(
          formatTokenAmount(
            publicSaleTotalAmount,
            parseInt(launchpadData.projectInfo.token.decimals)
          )
        ),
        purchased: parseFloat(
          formatTokenAmount(
            publicSaleTotalBuyedAmount,
            parseInt(launchpadData.projectInfo.token.decimals)
          )
        ),
      });
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
      setTokenPrice(formatTokenAmount(publicSalePrice, 12));
    } catch (error) {
      console.log(error);
    }
  };

  const progressPublicSaleRatio = useMemo(
    () =>
      publicSaleAmount?.total != 0
        ? roundUp(
            ((publicSaleAmount?.purchased || 0) /
              (publicSaleAmount?.total || 0)) *
              100
          )
        : 0,
    [publicSaleAmount]
  );
  const isBuyDisabled = useMemo(() => {
    return (
      !allowBuy ||
      !(parseFloat(amount) > 0) ||
      !(publicSaleAmount?.total - publicSaleAmount?.purchased > 0)
    );
  }, [allowBuy, amount, publicSaleAmount]);

  const maxAmount = useMemo(
    () => +publicSaleAmount?.total - +publicSaleAmount?.purchased,
    [publicSaleAmount]
  );

  return (
    <>
      <Box sx={{ marginTop: "12px" }}>
        <Text>Progress {`(${progressPublicSaleRatio}%)`}</Text>
        <Progress
          sx={{ marginTop: "4px" }}
          w="full"
          value={progressPublicSaleRatio}
          size="sm"
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            paddingLeft: "2px",
            paddingRight: "2px",
          }}
        >
          <div>{publicSaleAmount?.purchased}</div>
          <div>{publicSaleAmount?.total}</div>
        </Box>
      </Box>
      <Box sx={{ marginTop: "20px", marginBottom: "8px" }}>
        <Text sx={headerSX}>{`Amount (max: ${maxAmount})`}</Text>
        <IWInput
          isDisabled={!allowBuy || !(+maxAmount > 0)}
          onChange={({ target }) => {
            setAmount(target.value);
            setAzeroBuyAmount(
              roundUp(target.value * parseFloat(tokenPrice), 4)
            );
          }}
          type="number"
          value={amount}
          placeholder="0"
          inputRightElementIcon={launchpadData?.projectInfo?.token?.symbol}
        />
      </Box>
      <IWInput
        isDisabled={!allowBuy || !(+maxAmount > 0)}
        onChange={({ target }) => {
          setAzeroBuyAmount(target.value);
          setAmount(
            roundDown(parseFloat(target.value) / parseFloat(tokenPrice))
          );
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
      <Box sx={{ display: "flex" }}>
        <Button
          isLoading={publicBuyMutation.isLoading}
          isDisabled={isBuyDisabled}
          sx={{ flex: 1, height: "40px", marginTop: "8px" }}
          onClick={() => publicBuyMutation.mutate()}
          spinner={<BeatLoader size={8} color="white" />}
        >
          Public Purchase
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
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "16px",
      }}
    >
      {saleTime?.length > 0 && (
        <IWCountDown launchpadData={launchpadData} saleTime={saleTime} />
      )}
    </Box>
  );
};

export default SaleCard;
