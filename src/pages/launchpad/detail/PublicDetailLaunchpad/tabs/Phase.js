import {
  Box,
  CircularProgress,
  Divider,
  Flex,
  Heading,
  IconButton,
  Progress,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import SaleCard from "../SaleCard";
import StatusCard from "../StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo, useState } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import SectionContainer from "pages/launchpad/create/components/sectionContainer";
import DateTimePicker from "react-datetime-picker";
import IWInput from "components/input/Input";
import { AzeroLogo } from "components/icons/Icons";
import { useSelector } from "react-redux";
import { IWStatus } from "components/countdown/StatusWithCountDown";
import { LiveStatusTag } from "pages/launchpad/components/StatusTag";
import { UpcomingStatusTag } from "pages/launchpad/components/StatusTag";
import { EndStatusTag } from "pages/launchpad/components/StatusTag";
import { IWStatusWithCountDown } from "components/countdown/StatusWithCountDown";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";

const millisecondsInADay = 24 * 60 * 60 * 1000;

const PhaseTag = ({ data, sx, isOwner, launchpadData }) => {
  const [editatble, setEditable] = useState(false);
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
        <Heading size="lg">{data?.name}</Heading>
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
          <Heading size="md">Start Date & Time</Heading>
          <Text sx={{ marginTop: "8px" }}>
            {format(tagData?.startTime, "MMMM Do YYYY, h:mm:ss a")}
          </Text>
        </Box>
        <Box>
          <Heading size="md">End Date & Time</Heading>
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
      {/* <Text size="md" mt="16px" lineHeight={{ base: "1.25", lg: "30px" }}>
        Public sale
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
        <Text>Public sale amount</Text>
        <Heading size="md">{console.log(tagData)}%</Heading>
      </Box> */}
      <Divider sx={{ mb: "20px", mt: "8px" }} />

      <IWStatusWithCountDown
        direction="row"
        startDate={new Date(tagData?.startTime)}
        endDate={new Date(tagData?.endTime)}
      />
      {/* <Box sx={{ display: "flex" }}>
        <Heading
          as="h3"
          size="h3"
          mb="16px"
          lineHeight={{ base: "1.25", lg: "30px" }}
        >
          Allow Public Sale
        </Heading>
        <Switch
          disabled={!editatble}
          sx={{ mt: "4px", ml: "16px" }}
          id="zero-reward-pools"
          isChecked={tagData?.allowPublicSale}
          // onChange={() =>
          //   setPhaseList((prevState) => {
          //     const updatedArray = [...prevState];
          //     if (index >= 0 && index < updatedArray.length) {
          //       updatedArray[index] = {
          //         ...updatedArray[index],
          //         allowPublicSale: !obj?.allowPublicSale,
          //       };
          //     }
          //     return updatedArray;
          //   })
          // }
        />
      </Box>
      {tagData?.allowPublicSale && (
        <SimpleGrid columns={3} spacing={4}>
          <SectionContainer title={"Public Amount"}>
            <IWInput
              type="number"
              // inputRightElementIcon={launchpadData?.token?.symbol}
              value={tagData?.phasePublicAmount}
              // onChange={({ target }) =>
              //   setPhaseList((prevState) => {
              //     const updatedArray = [...prevState];
              //     if (index >= 0 && index < updatedArray.length) {
              //       updatedArray[index] = {
              //         ...updatedArray[index],
              //         phasePublicAmount: target.value,
              //       };
              //     }
              //     return updatedArray;
              //   })
              // }
              placeholder="0"
            />
          </SectionContainer>
          <SectionContainer title={"Phase Public Price"}>
            <IWInput
              type="number"
              inputRightElementIcon={<AzeroLogo />}
              value={tagData?.phasePublicPrice}
              // onChange={({ target }) =>
              //   setPhaseList((prevState) => {
              //     const updatedArray = [...prevState];
              //     if (index >= 0 && index < updatedArray.length) {
              //       updatedArray[index] = {
              //         ...updatedArray[index],
              //         phasePublicPrice: target.value,
              //       };
              //     }
              //     return updatedArray;
              //   })
              // }
              placeholder="0.0000"
            />
          </SectionContainer>
        </SimpleGrid>
      )} */}
    </Box>
  );
};

const PhaseInformation = ({ launchpadContract, launchpadData }) => {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { phaseList, owner } = launchpadData || {};
  return (
    <TabLayout launchpadData={launchpadData}>
      <div style={{}}></div>
      {/* <CircularProgress
        alignSelf={"center"}
        isIndeterminate
        size={"40px"}
        color="#93F0F5"
      /> */}
      {phaseList?.map((phaseObj, index) => (
        <PhaseTag
          launchpadData={launchpadData}
          isOwner={owner == currentAccount?.address}
          key={`phase-${index}`}
          sx={{ marginTop: index != 0 && "40px" }}
          data={phaseObj}
        />
      ))}
    </TabLayout>
  );
};

export default PhaseInformation;
