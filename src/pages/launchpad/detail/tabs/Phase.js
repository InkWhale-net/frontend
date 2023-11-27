import {
  Box,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import {
  IWStatus,
  IWStatusWithCountDown,
} from "components/countdown/StatusWithCountDown";
import { AzeroLogo } from "components/icons/Icons";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import {
  formatNumDynDecimal,
  formatTokenAmount,
  millisecondsInADay,
} from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import { formatChainStringToNumber } from "utils";

const PhaseTag = ({ data, sx, isOwner, launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const tokenDecimal = parseInt(launchpadData.projectInfo.token.decimals);
  const tokenSymbol = launchpadData?.projectInfo?.token?.symbol;

  const tagData = useMemo(() => {
    return {
      ...data,
      availableAmount:
        formatChainStringToNumber(data?.availableAmount) / 10 ** tokenDecimal,
      capAmount:
        formatChainStringToNumber(data?.capAmount) / 10 ** tokenDecimal,
      startTime: new Date(parseInt(data?.startTime?.replace(/,/g, ""))),
      endTime: new Date(parseInt(data?.endTime?.replace(/,/g, ""))),
      immediateReleaseRate:
        parseFloat(data?.immediateReleaseRate?.replace(/,/g, "")) / 100,
      vestingDuration:
        parseFloat(data?.vestingDuration?.replace(/,/g, "")) /
        millisecondsInADay,
      vestingUnit:
        parseFloat(data?.vestingUnit?.replace(/,/g, "")) / millisecondsInADay,
    };
  }, [data]);
  const publicSaleInfo = useMemo(() => {
    return {
      totalAmount: formatTokenAmount(
        tagData?.publicSaleInfor?.totalAmount,
        tokenDecimal
      ),
      totalPurchasedAmount: formatTokenAmount(
        tagData?.publicSaleInfor?.totalPurchasedAmount,
        tokenDecimal
      ),
      totalClaimedAmount: formatTokenAmount(
        tagData?.publicSaleInfor?.totalClaimedAmount,
        tokenDecimal
      ),
      availableAmount: formatTokenAmount(
        tagData?.publicSaleInfor?.availableAmount,
        tokenDecimal
      ),
      price: formatTokenAmount(tagData?.publicSaleInfor?.price, 12),
    };
  }, [tagData]);

  const userWL = useMemo(() => {
    if (currentAccount)
      return tagData?.whitelist?.find(
        (e) => e?.account == currentAccount?.address
      );
  }, [currentAccount, tagData]);

  // ###############################
  // account:"5HdV9C5v5DJF4wNPrMNsEYk5amND93xMHCSncHEWaJbZbzn9"
  // amount:"100,000,000,000,000" Balance
  // claimedAmount:"0" Balance
  // lastUpdatedTime:"0"
  // price:"500,000,000,000" Balance
  // purchasedAmount:"0" Balance
  // vestingAmount: "0"; Balance

  const whitelistList = useMemo(
    () =>
      tagData?.whitelist?.map((w) => ({
        ...w,
        amount:
          formatChainStringToNumber(w?.amount) / Math.pow(10, tokenDecimal),
        claimedAmount:
          formatChainStringToNumber(w?.claimedAmount) /
          Math.pow(10, tokenDecimal),
        price: formatChainStringToNumber(w?.price) / Math.pow(10, tokenDecimal),
        purchasedAmount:
          formatChainStringToNumber(w?.purchasedAmount) /
          Math.pow(10, tokenDecimal),
        vestingAmount:
          formatChainStringToNumber(w?.vestingAmount) /
          Math.pow(10, tokenDecimal),
      })),
    [tagData?.whitelist, tokenDecimal]
  );

  const whitelistAddedAmount = whitelistList?.reduce(
    (prev, curr) => prev + curr.amount,
    0
  );

  const whitelistClaimedAmount = whitelistList?.reduce(
    (prev, curr) => prev + curr.claimedAmount,
    0
  );

  const whitelistClaimed = whitelistList.filter((w) => !!w.claimedAmount);

  return (
    <Box
      sx={{
        ...sx,
        border: "2px solid #E3DFF3",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "8px",
          paddingTop: "8px",
        }}
      >
        <Heading size="md">
          {data?.name}
          {`  `}
          {tagData?.publicSaleInfor?.isPublic && tagData?.whitelist?.length > 0
            ? `(Public sale/Whitelist sale)`
            : tagData?.publicSaleInfor?.isPublic
            ? `(Public sale)`
            : tagData?.whitelist?.length > 0
            ? `(Whitelist Only)`
            : null}
        </Heading>
        <IWStatus
          startDate={new Date(tagData?.startTime)}
          endDate={new Date(tagData?.endTime)}
          label={{
            upcoming: "Upcoming",
            live: "On-going",
            end: "Ended",
          }}
          isActive={tagData.isActive}
        />
      </Box>
      <Divider sx={{ mb: "16px" }} />

      <SimpleGrid w="full" columns={{ base: 1, lg: 2 }} spacing={2}>
        <Box>
          <Text
            sx={{
              fontWeight: "700",
              color: "#57527E",
            }}
            size="md"
          >
            Start Date & Time
          </Text>
          <Text sx={{ marginTop: "8px" }}>
            {format(tagData?.startTime, "MMMM Do YYYY, h:mm:ss a")}
          </Text>
        </Box>
        <Box>
          <Text
            sx={{
              fontWeight: "700",
              color: "#57527E",
            }}
            size="md"
          >
            End Date & Time
          </Text>
          <Text sx={{ marginTop: "8px" }}>
            {format(tagData?.endTime, "MMMM Do YYYY, h:mm:ss a")}
          </Text>
        </Box>
      </SimpleGrid>
      {tagData?.immediateReleaseRate == 100 ? (
        <Heading size="md" mt="16px" lineHeight={{ base: "1.25", lg: "30px" }}>
          Non Vesting
        </Heading>
      ) : (
        <>
          <Text
            size="md"
            mt="20px"
            lineHeight={{ base: "1.25", lg: "30px" }}
            sx={{ color: "#57527E", fontWeight: "700" }}
          >
            Vesting Plan
          </Text>
          <Divider sx={{ mb: "4px" }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Immediate Release Rate</Text>
            <Text size="md">{tagData?.immediateReleaseRate}%</Text>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Vesting Duration</Text>
            <Text size="md">
              {tagData?.vestingDuration} day
              {tagData?.vestingDuration > 1 ? "s" : null}
            </Text>
          </Box>{" "}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Vesting Release Period</Text>
            <Text size="md">
              {tagData?.vestingUnit} day {tagData?.vestingUnit > 1 ? "s" : null}
            </Text>
          </Box>
        </>
      )}
      {tagData?.publicSaleInfor?.isPublic && (
        <>
          <Heading
            size="md"
            mt="20px"
            lineHeight={{ base: "1.25", lg: "30px" }}
          >
            Public Sale Information
          </Heading>
          <Divider sx={{ mb: "4px" }} />
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Total for sale</Text>
            <Text size="md">
              {`${formatNumDynDecimal(publicSaleInfo?.totalAmount)}
               ${tokenSymbol}`}
            </Text>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Total purchased</Text>
            <Text size="md">
              {`${formatNumDynDecimal(publicSaleInfo?.totalPurchasedAmount)}
               ${tokenSymbol}`}
            </Text>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Price</Text>
            <Text size="md">
              {formatNumDynDecimal(publicSaleInfo?.price)}
              <AzeroLogo
                sx={{
                  marginLeft: "4px",
                  fontSize: "16px",
                }}
              />
            </Text>
          </Box>
        </>
      )}
      {userWL && (
        <>
          <Divider sx={{ mb: "20px", mt: "8px" }} />
          <Text sx={{ fontWeight: "700", color: "#57527E", mb: "16px" }}>
            You are in whitelist
          </Text>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Price</Text>
            <Text size="md">
              {formatNumDynDecimal(formatTokenAmount(userWL?.price))}
              <AzeroLogo
                sx={{
                  marginLeft: "4px",
                  fontSize: "16px",
                }}
              />
            </Text>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Amount</Text>
            <Text size="md">
              {`${formatNumDynDecimal(
                formatTokenAmount(userWL?.amount, tokenDecimal)
              )} ${tokenSymbol}`}
            </Text>
          </Box>
        </>
      )}
      <Flex justify="space-between" mt="12px">
        <Text>Phase Cap</Text>

        <Text>
          {formatNumDynDecimal(tagData.capAmount)} {tokenSymbol}
        </Text>
      </Flex>

      <Divider sx={{ mb: "20px", mt: "8px" }} />

      {whitelistList?.length ? (
        <>
          <Flex justify="space-between" mt="12px">
            <Text>Whitelist added</Text>

            <Text>
              {formatNumDynDecimal(whitelistAddedAmount)} {tokenSymbol}
            </Text>
          </Flex>
          <Flex justify="space-between" mt="12px">
            <Text>Whitelist address added</Text>

            <Text>{whitelistList?.length ?? 0}</Text>
          </Flex>
        </>
      ) : null}

      {whitelistList?.length ? (
        <>
          <Flex justify="space-between" mt="12px">
            <Text>Whitelist claimed</Text>

            <Text>
              {formatNumDynDecimal(whitelistClaimedAmount)} {tokenSymbol}
            </Text>
          </Flex>
          <Flex justify="space-between" mt="12px">
            <Text>Whitelist address claimed</Text>

            <Text>{whitelistClaimed?.length ?? 0}</Text>
          </Flex>
          <Divider sx={{ mb: "20px", mt: "8px" }} />
        </>
      ) : null}

      <IWStatusWithCountDown
        direction="row"
        startDate={new Date(tagData?.startTime)}
        endDate={new Date(tagData?.endTime)}
      />
    </Box>
  );
};

const PhaseInformation = ({ launchpadContract, launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { phaseList, owner } = launchpadData || {};
  return (
    <TabLayout launchpadData={launchpadData}>
      {phaseList?.map((phaseObj, index) => (
        <PhaseTag
          launchpadData={launchpadData}
          isOwner={owner == currentAccount?.address}
          key={`phase-${index}`}
          sx={{ marginTop: index !== 0 && "40px" }}
          data={phaseObj}
        />
      ))}
    </TabLayout>
  );
};

export default PhaseInformation;
