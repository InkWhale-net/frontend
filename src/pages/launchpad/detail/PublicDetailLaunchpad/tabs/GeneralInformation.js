import {
  Box,
  Circle,
  Divider,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import SaleCard from "../SaleCard";
import StatusCard from "../StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import AddressCopier from "components/address-copier/AddressCopier";

const GeneralInformation = ({ launchpadContract, launchpadData }) => {
  const avatarSize = "120px";
  const { phase, projectInfor, roadmap, team, token, totalSupply } =
    launchpadData?.projectInfo || {};
  const mainTableHeader = [
    {
      label: "Launchpad contract",
      header: "contractAddress",
    },
    {
      label: "Description",
      header: "description",
    },
    {
      label: "Token total supply",
      header: "totalSupply",
    },

    {
      label: "Presale Start Time",
      header: "presaleStartTime",
    },
    {
      label: "Presale End Time",
      header: "presaleEndTime",
    },
  ];
  const mainTabData = useMemo(() => {
    return {
      contractAddress: launchpadContract,
      tokenSymbol: token?.symbol,
      description: projectInfor?.description,
      totalSupply: roundUp(totalSupply?.replaceAll(",", "")),
      presaleStartTime: format(
        projectInfor?.startTime,
        "MMMM Do YYYY, h:mm:ss a"
      ),
      presaleEndTime: format(projectInfor?.endTime, "MMMM Do YYYY, h:mm:ss a"),
    };
  }, [launchpadContract, launchpadData]);
  return (
    <TabLayout launchpadData={launchpadData}>
      <Heading size="lg">General</Heading>
      <Divider sx={{ marginBottom: "16px" }} />
      {mainTableHeader.map((e, index) => {
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Text sx={{ flex: 1 }}>{e?.label}</Text>
              <Box
                sx={{ flex: 2, display: "flex", justifyContent: "flex-end" }}
              >
                <Text>{formatDataCellTable(mainTabData, e?.header)}</Text>
              </Box>
            </Box>
            <Divider sx={{ marginBottom: "8px", marginTop: "8px" }} />
          </>
        );
      })}
      <Heading
        sx={{
          marginTop: "40px",
        }}
        size="lg"
      >
        Roadmaps
      </Heading>
      <Divider sx={{ marginBottom: "16px" }} />
      {roadmap?.map((obj, index) => {
        return (
          <Box sx={{ paddingTop: index != 0 ? "20px" : 0 }}>
            <Heading size="md">Milestone {index + 1}</Heading>
            <Divider />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text sx={{ flex: 1 }}>Name</Text>
              <Heading size="md" sx={{ flex: 2, textAlign: "right" }}>
                {obj?.name}
              </Heading>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
              }}
            >
              <Text sx={{ flex: 1 }}>Description</Text>
              <Text sx={{ flex: 2, textAlign: "right" }}>
                {obj?.description}
              </Text>
            </div>
          </Box>
        );
      })}
      <Heading
        sx={{
          marginTop: "40px",
        }}
        size="lg"
      >
        Team member
      </Heading>
      <Divider sx={{ marginBottom: "16px" }} />
      {team?.map((obj, index) => {
        return (
          <Box
            key={`member-${index}`}
            sx={{
              width: "full",
              display: "flex",
              paddingTop: index != 0 && "20px",
            }}
          >
            <Circle w={avatarSize} h={avatarSize} bg="white">
              <Image
                sx={{
                  w: avatarSize,
                  h: avatarSize,
                  borderRadius: "80px",
                  objectFit: "cover",
                  objectPosition: "center",
                }}
                src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${obj?.iconIPFSUrl}`}
                alt="logo-launchpad"
              />
            </Circle>
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: "20px",
              }}
            >
              <Heading size="md">{obj?.name?.toUpperCase()}</Heading>
              <Text>
                Role: <b>{obj?.title}</b>
              </Text>
              <Box sx={{ display: "flex" }}>
                <Text sx={{ marginRight: "8px" }}>Social link:</Text>
                {obj?.socialLink ? (
                  <AddressCopier truncated={false} address={obj?.socialLink} />
                ) : (
                  "---"
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </TabLayout>
  );
};

export default GeneralInformation;
