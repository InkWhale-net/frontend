import { Box, Divider, Heading, SimpleGrid, Text } from "@chakra-ui/react";
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

const PhaseTag = ({ data, sx, isOwner, launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const tokenDecimal = parseInt(launchpadData.projectInfo.token.decimals);
  const tagData = useMemo(() => {
    return {
      ...data,
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
      price: formatTokenAmount(tagData?.publicSaleInfor?.price, 12),
    };
  }, [tagData]);

  const userWL = useMemo(() => {
    if (currentAccount)
      return tagData?.whitelist?.find(
        (e) => e?.account == currentAccount?.address
      );
  }, [currentAccount, tagData]);
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
            <Text size="md">{tagData?.vestingDuration} day(s)</Text>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: "12px",
            }}
          >
            <Text>Vesting Release Period</Text>
            <Text size="md">{tagData?.vestingUnit} day(s)</Text>
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
            <Text>Total sale amount</Text>
            <Text size="md">
              {formatNumDynDecimal(publicSaleInfo?.totalAmount)}
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
            <Text>Total purchased amount</Text>
            <Text size="md">
              {formatNumDynDecimal(publicSaleInfo?.totalPurchasedAmount)}
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
              )} ${launchpadData?.projectInfo?.token?.symbol}`}
            </Text>
          </Box>
        </>
      )}

      <Divider sx={{ mb: "20px", mt: "8px" }} />

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
