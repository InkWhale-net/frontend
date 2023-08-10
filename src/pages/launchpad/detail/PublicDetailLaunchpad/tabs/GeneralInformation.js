import {
  Box,
  Circle,
  Divider,
  Heading,
  Image,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import AddressCopier from "components/address-copier/AddressCopier";
import ReactApexChart from "react-apexcharts";
import { isMobile } from "react-device-detect";

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
  const distributions = useMemo(() => {
    try {
      const totalDistribution = projectInfor?.tokenomic.reduce((acc, obj) => {
        return acc + obj?.value;
      }, 0);
      if (totalDistribution) {
        if (totalDistribution > 100) return [];
        else if (totalDistribution == 100) return projectInfor?.tokenomic;
        else
          return [
            ...projectInfor?.tokenomic,
            { label: "Others", value: 100 - totalDistribution },
          ];
      }
    } catch (error) {
      console.log(error);
      return [];
    }
  }, [launchpadData]);
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
      label: "Token total for sale",
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
      <Heading sx={{ fontSize: "24px" }} size="lg">
        General Information
      </Heading>
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
      {distributions?.length > 0 && (
        <>
          <Heading
            sx={{
              marginTop: "40px",
              fontSize: "24px",
            }}
            size="lg"
          >
            Tokenomic
          </Heading>
          <Box
            sx={{
              display: "flex",
              // justifyContent: "center",
            }}
          >
            <Box display={{ base: "flex" }} justifyContent={{ base: "center" }}>
              <ReactApexChart
                width={isMobile ? window.innerWidth : "400px"}
                height={isMobile ? window.innerWidth : "400px"}
                options={{
                  chart: {
                    type: "donut",
                  },
                  labels: distributions.map((e) => e.label),
                  responsive: [
                    {
                      breakpoint: 480,
                      options: {
                        chart: {
                          width: 200,
                        },
                        legend: {
                          position: "bottom",
                        },
                      },
                    },
                  ],
                }}
                series={distributions.map((e) => e.value)}
                type="donut"
              />
            </Box>
          </Box>
        </>
      )}
      <Heading
        sx={{
          marginTop: "40px",
          fontSize: "24px",
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
              marginBottom={"10px"}
              marginTop={"10px"}
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
              marginBottom={"10px"}
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
          fontSize: "24px",
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
              <Text size="md">{obj?.name?.toUpperCase()}</Text>
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
