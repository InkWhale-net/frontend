import { Box, Circle, Divider, Heading, Image, Text } from "@chakra-ui/react";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import AddressCopier from "components/address-copier/AddressCopier";

const LabelField = ({ label, value, divider = true }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: "8px",
      }}
    >
      <Text sx={{ flex: 1 }}>{label}</Text>
      <Heading size="md" sx={{ flex: 2, textAlign: "right" }}>
        {value}
      </Heading>
    </div>
  );
};

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
        parseInt(launchpadData?.startTime?.replace(/,/g, "")),
        "MMMM Do YYYY, h:mm:ss a"
      ),
      presaleEndTime: format(
        parseInt(launchpadData?.endTime?.replace(/,/g, "")),
        "MMMM Do YYYY, h:mm:ss a"
      ),
    };
  }, [
    launchpadContract,
    projectInfor?.description,
    projectInfor?.endTime,
    projectInfor?.startTime,
    token?.symbol,
    totalSupply,
  ]);
  return (
    <TabLayout launchpadData={launchpadData}>
      <Heading sx={{fontSize: "24px"}} size="lg">General Information</Heading>
      <Divider sx={{ marginBottom: "16px" }} />
      {mainTableHeader.map((e, index) => {
        return (
          <>
            <Box
              sx={{ display: "flex", justifyContent: "space-between" }}
              flexDirection={["column", "column", "row"]}
              alignItems={["start"]}
            >
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
          fontSize: "24px"
        }}
        size="lg"
      >
        Roadmaps
      </Heading>
      <Divider sx={{ marginBottom: "20px" }} />
      {roadmap?.map((obj, index) => {
        return (
          <Box sx={{ paddingTop: index !== 0 ? "20px" : 0 }}>
            <Heading size="md">Milestone {index + 1}</Heading>
            <Box
              display="flex"
              flexDirection={["column", "column", "row"]}
              alignItems={["start", "start", "center"]}
              marginBottom={'10px'}
              marginTop={'10px'}
            >
              <Text sx={{ flex: 1 }}>Name</Text>
              <Text size="md" sx={{ flex: 2, textAlign: "right" }}>
                {obj?.name}
              </Text>
            </Box>
            <Box
              display="flex"
              flexDirection={["column", "column", "row"]}
              alignItems={["start", "start", "center"]}
              marginBottom={'10px'}
            >
              <Text sx={{ flex: 1 }}>Description</Text>
              <Text sx={{ flex: 2, textAlign: "right" }}>
                {obj?.description}
              </Text>
            </Box>
          </Box>
        );
      })}
      <Heading
        sx={{
          marginTop: "40px",
          fontSize: "24px"
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
                paddingLeft: "24px",
              }}
            >
              <Text  size="md">{obj?.name?.toUpperCase()}</Text>
              <Text>
                Role: <span>{obj?.title}</span>
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