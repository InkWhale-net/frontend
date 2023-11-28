import {
  AspectRatio,
  Box,
  Circle,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Text,
} from "@chakra-ui/react";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { isMobile } from "react-device-detect";
import { roundUp } from "utils";
import { format } from "utils/datetime";
import TabLayout from "../Layout";
import TokenInformation from "./TokenInformation";
import { ExternalLinkIcon } from "@chakra-ui/icons";

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
  const { projectInfor, roadmap, team, token } =
    launchpadData?.projectInfo || {};

  const distributions = useMemo(() => {
    try {
      const totalDistribution = projectInfor?.tokenomic?.reduce((acc, obj) => {
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
      label: "Total token for sale",
      header: "totalSupply",
    },

    {
      label: "Start Time",
      header: "presaleStartTime",
    },
    {
      label: "End Time",
      header: "presaleEndTime",
    },
  ];

  const mainTabData = useMemo(() => {
    return {
      contractAddress: launchpadContract,
      tokenSymbol: token?.symbol,
      description: projectInfor?.description,
      youtubeUrl: projectInfor?.youtubeUrl,
      tokenomicsMoreInfo: projectInfor?.tokenomicsMoreInfo,

      totalSupply: roundUp(
        launchpadData?.totalSupply?.replaceAll(",", "") /
          Math.pow(10, token?.decimals)
      ),
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
    launchpadData?.endTime,
    launchpadData?.startTime,
    launchpadData?.totalSupply,
    projectInfor?.description,
    projectInfor?.tokenomicsMoreInfo,
    projectInfor?.youtubeUrl,
    token?.decimals,
    token?.symbol,
  ]);

  return (
    <TabLayout launchpadData={launchpadData}>
      <>
        <Box
          sx={{ display: "flex", justifyContent: "space-between" }}
          flexDirection={["column", "column", "row"]}
          alignItems={["start"]}
        >
          <Box
            sx={{
              flex: 2,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Text w="full" textAlign="left">
              {mainTabData?.description}
            </Text>
          </Box>
        </Box>

        {mainTabData.youtubeUrl && (
          <AspectRatio mt="24px" w="full" maxW="750px" ratio={16 / 9}>
            <iframe
              allowFullScreen
              title="youtube-link"
              src={mainTabData.youtubeUrl}
            />
          </AspectRatio>
        )}
      </>
      <Heading sx={{ fontSize: "24px" }} size="lg" marginTop="40px">
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
                sx={{
                  flex: 2,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Text>{formatDataCellTable(mainTabData, e?.header)}</Text>
              </Box>
            </Box>
            <Divider sx={{ marginBottom: "8px", marginTop: "8px" }} />
          </>
        );
      })}
      <Heading sx={{ fontSize: "24px" }} size="lg" marginTop="40px">
        Token Information
      </Heading>
      <Divider sx={{ marginBottom: "16px" }} />
      <TokenInformation
        launchpadContract={launchpadContract}
        launchpadData={launchpadData}
      />{" "}
      {distributions?.length > 0 && (
        <>
          <Heading
            sx={{
              marginTop: "40px",
              fontSize: "24px",
            }}
            size="lg"
          >
            Tokenomics
          </Heading>
          <Box
            sx={{
              display: "flex",
              // justifyContent: "center",
            }}
          >
            <Box
              w="full"
              display={{ base: "flex" }}
              justifyContent={{ base: "center" }}
              textAlign="left"
            >
              <ReactApexChart
                width={isMobile ? window.innerWidth : "550px"}
                height={isMobile ? window.innerWidth : "550px"}
                options={{
                  chart: {
                    type: "donut",
                    height: "auto",
                  },
                  labels: distributions.map((e) => e.label),
                  legend: { width: 250 },
                  responsive: [
                    {
                      breakpoint: 480,
                      options: {
                        plotOptions: {
                          pie: {
                            donut: {
                              size: "45%",
                            },
                          },
                        },
                        chart: {
                          width: 400,
                          height: 600,
                        },
                        legend: {
                          width: 160,
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
      {mainTabData?.tokenomicsMoreInfo && (
        <Box
          mt="16px"
          sx={{ display: "flex", justifyContent: "space-between" }}
          flexDirection={["column", "column", "row"]}
          alignItems={["start"]}
        >
          <Box
            sx={{
              flex: 2,
              display: "flex",
            }}
          >
            <Text>{mainTabData?.tokenomicsMoreInfo}</Text>
          </Box>
        </Box>
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
              <Text sx={{ flex: 2 }} textAlign={["left", "left", "right"]}>
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

              {obj?.socialLink ? (
                <Link w="fit-content" href={obj?.socialLink} isExternal>
                  Social link <ExternalLinkIcon mx="2px" />
                </Link>
              ) : (
                <Flex
                  color="lightgrey"
                  cursor="not-allowed"
                  alignItems="center"
                  fontWeight={600}
                  textDecoration="underline"
                >
                  Social link <ExternalLinkIcon mx="2px" />
                </Flex>
              )}
            </Box>
          </Box>
        );
      })}
    </TabLayout>
  );
};

export default GeneralInformation;
