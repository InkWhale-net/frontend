import {
  Box,
  Button,
  Circle,
  Divider,
  GridItem,
  Heading,
  Image,
  Progress,
  SimpleGrid,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Text,
} from "@chakra-ui/react";
import IWCardOneColumn from "components/card/CardOneColumn";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SaleCard from "./SaleCard";
import StatusCard from "./StatusCard";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { roundUp } from "utils";
import { formatTokenAmount } from "utils";
import { format } from "utils/datetime";
import IWTabs from "components/tabs/IWTabs";
import GeneralInformation from "./tabs/GeneralInformation";
import TokenInformation from "./tabs/TokenInformation";

const PublicDetailLaunchpad = () => {
  const { launchpads } = useSelector((s) => s.launchpad);
  const params = useParams();
  const launchpadContract = params?.launchpadContract;
  const launchpadData = useMemo(() => {
    return launchpads?.find((e) => e?.launchpadContract == launchpadContract);
  }, [launchpadContract, launchpads]);
  const { phase, projectInfor, roadmap, team, token, totalSupply } =
    launchpadData?.projectInfo;
  const mainTableHeader = [
    {
      label: "Launchpad contract",
      header: "contractAddress",
    },
    {
      label: "Token Name",
      header: "tokenName",
    },
    {
      label: "Token Symbol",
      header: "tokensymbol",
    },
    {
      label: "Token Decimal",
      header: "tokenDecimal",
    },
    {
      label: "Token Address",
      header: "tokenContract",
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
      tokenName: token?.name,
      tokensymbol: token?.symbol,
      tokenDecimal: token?.decimals,
      tokenContract: token?.tokenAddress,
      totalSupply: roundUp(token?.totalSupply?.replaceAll(",", "")),
      presaleStartTime: format(
        projectInfor.startTime,
        "MMMM Do YYYY, h:mm:ss a"
      ),
      presaleEndTime: format(projectInfor.endTime, "MMMM Do YYYY, h:mm:ss a"),
    };
  }, [launchpadContract, launchpadData]);
  const tabsData = [
    {
      label: <>General Information</>,
      component: (
        <GeneralInformation
          launchpadContract={launchpadContract}
          launchpadData={launchpadData}
        />
      ),
      isDisabled: false,
    },
    {
      label: <>Token</>,
      component: (
        <TokenInformation
          launchpadContract={launchpadContract}
          launchpadData={launchpadData}
        />
      ),
      isDisabled: false,
    },
    // {
    //   label: <>Advanced Mode</>,
    //   component: <></>,
    //   isDisabled: false,
    // },
    // {
    //   label: <>My Contributions</>,
    //   component: <></>,
    //   isDisabled: false,
    // },
  ];
  return (
    <SectionContainer mt={{ base: "0px", xl: "20px" }} right={<div></div>}>
      <Box sx={{ display: "flex" }}>
        <Circle w="80px" h="80px" bg="white">
          <Image
            sx={{
              w: "80px",
              h: "80px",
              borderRadius: "80px",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${projectInfor?.avatarImage}`}
            alt="logo-launchpad"
          />
        </Circle>
        <Box sx={{ marginLeft: "8px" }}>
          <Heading>{projectInfor?.name}</Heading>
          <Box sx={{ display: "flex" }}>
            <Image
              sx={{
                w: "32px",
                h: "32px",
                borderRadius: "80px",
                objectFit: "cover",
                objectPosition: "center",
              }}
              src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${token?.tokenIconUrl}`}
              alt="logo-launchpad"
            />
            <Text>{`${token?.name}(${token?.symbol})`}</Text>
          </Box>
        </Box>
      </Box>
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
};

export default PublicDetailLaunchpad;
