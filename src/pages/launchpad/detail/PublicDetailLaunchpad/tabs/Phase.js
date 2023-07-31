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

const millisecondsInADay = 24 * 60 * 60 * 1000;

const PhaseTag = ({ data }) => {
  const [editatble, setEditable] = useState(false);
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
  return (
    <Box>
      <Heading size="lg">{data?.name}</Heading>
      <Divider sx={{ mb: "16px" }} />
      <SimpleGrid w="full" columns={{ base: 1, lg: 2 }} spacing={2}>
        <SectionContainer
          title={"Start Date & Time"}
          // right={
          //   phaseList?.length > 1 && (
          //     <IconButton
          //       borderRadius="0"
          //       icon={<BsTrashFill color="#57527E" />}
          //       variant="link"
          //       sx={{ marginTop: "4px" }}
          //       onClick={() => deletePhase(index)}
          //     />
          //   )
          // }
        >
          <Flex
            h="52px"
            borderWidth="1px"
            justifyContent="start"
            borderRadius="5px"
          >
            <DateTimePicker
              disabled={!editatble}
              locale="en-EN"
              value={tagData?.startTime}
              // onChange={(value) =>
              //   setPhaseList((prevState) => {
              //     const updatedArray = [...prevState];
              //     if (index >= 0 && index < updatedArray.length) {
              //       updatedArray[index] = {
              //         ...updatedArray[index],
              //         endDate: value,
              //       };
              //     }
              //     return updatedArray;
              //   })
              // }
            />
          </Flex>
        </SectionContainer>
        <SectionContainer
          title={"End Date & Time"}
          // right={
          //   phaseList?.length > 1 && (
          //     <IconButton
          //       borderRadius="0"
          //       icon={<BsTrashFill color="#57527E" />}
          //       variant="link"
          //       sx={{ marginTop: "4px" }}
          //       onClick={() => deletePhase(index)}
          //     />
          //   )
          // }
        >
          <Flex
            h="52px"
            borderWidth="1px"
            justifyContent="start"
            borderRadius="5px"
          >
            <DateTimePicker
              locale="en-EN"
              disabled={!editatble}
              value={tagData?.endTime}
              // onChange={(value) =>
              //   setPhaseList((prevState) => {
              //     const updatedArray = [...prevState];
              //     if (index >= 0 && index < updatedArray.length) {
              //       updatedArray[index] = {
              //         ...updatedArray[index],
              //         endDate: value,
              //       };
              //     }
              //     return updatedArray;
              //   })
              // }
            />
          </Flex>
        </SectionContainer>
      </SimpleGrid>
      <Heading
        as="h2"
        size="h2"
        // mb="16px"
        mt="16px"
        lineHeight={{ base: "1.25", lg: "30px" }}
      >
        Vesting Plan
      </Heading>
      <SectionContainer title={"Immediate Release Rate"}>
        <IWInput
          disabled={!editatble}
          inputRightElementIcon={
            <Tooltip
              fontSize="md"
              label={
                "percentage or portion of tokens that are immediately released to token holders upon the token launch or distribution event"
              }
            >
              <b>%</b>
            </Tooltip>
          }
          type="number"
          value={tagData?.immediateReleaseRate}
          // onChange={({ target }) =>
          //   setPhaseList((prevState) => {
          //     const updatedArray = [...prevState];
          //     if (index >= 0 && index < updatedArray.length) {
          //       updatedArray[index] = {
          //         ...updatedArray[index],
          //         immediateReleaseRate: target.value,
          //       };
          //     }
          //     return updatedArray;
          //   })
          // }
          placeholder="0.00"
        />
      </SectionContainer>
      <SectionContainer title={"Vesting Duration"}>
        <IWInput
          disabled={!editatble}
          inputRightElementIcon={
            <Tooltip
              fontSize="md"
              label={
                "The Vesting Duration refers to the length of time over which tokens are gradually released to token holders according to a predetermined schedule"
              }
            >
              <b>day(s)</b>
            </Tooltip>
          }
          type="number"
          value={tagData?.vestingDuration}
          // onChange={({ target }) =>
          //   setPhaseList((prevState) => {
          //     const updatedArray = [...prevState];
          //     if (index >= 0 && index < updatedArray.length) {
          //       updatedArray[index] = {
          //         ...updatedArray[index],
          //         vestingLength: target.value,
          //       };
          //     }
          //     return updatedArray;
          //   })
          // }
          placeholder="0"
        />
      </SectionContainer>
      <SectionContainer title={"Vesting Release Period"}>
        <IWInput
          disabled={!editatble}
          inputRightElementIcon={
            <Tooltip
              fontSize="md"
              label={
                "The Vesting Release Period is the interval or frequency at which vested tokens become accessible to the token holder according to the predetermined vesting schedule"
              }
            >
              <b>day(s)</b>
            </Tooltip>
          }
          type="number"
          value={tagData?.vestingUnit}
          // onChange={({ target }) =>
          //   setPhaseList((prevState) => {
          //     const updatedArray = [...prevState];
          //     if (index >= 0 && index < updatedArray.length) {
          //       updatedArray[index] = {
          //         ...updatedArray[index],
          //         vestingUnit: target.value,
          //       };
          //     }
          //     return updatedArray;
          //   })
          // }
          placeholder="0"
        />
      </SectionContainer>
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
  const { phaseList } = launchpadData || {};

  console.log(phaseList);

  return (
    <TabLayout>
      <div style={{}}></div>
      {/* <CircularProgress
        alignSelf={"center"}
        isIndeterminate
        size={"40px"}
        color="#93F0F5"
      /> */}
      {phaseList?.map((phaseObj, index) => (
        <PhaseTag key={`phase-${index}`} data={phaseObj} />
      ))}
    </TabLayout>
  );
};

export default PhaseInformation;
