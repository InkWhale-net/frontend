import { Box, Circle, Heading, Image, Text } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWTabs from "components/tabs/IWTabs";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GeneralInformation from "./tabs/GeneralInformation";
import TokenInformation from "./tabs/TokenInformation";
import PhaseInformation from "./tabs/Phase";

const PublicDetailLaunchpad = () => {
  const { launchpads } = useSelector((s) => s.launchpad);
  const params = useParams();
  const launchpadContract = params?.launchpadContract;
  const launchpadData = useMemo(() => {
    const foundNode = launchpads?.find(
      (e) => e?.launchpadContract == launchpadContract
    );
    if (foundNode)
      return {
        ...foundNode,
        phaseList: JSON.parse(foundNode?.phaseList || {}),
      };
  }, [launchpadContract, launchpads]);
  const { projectInfor, token } = launchpadData?.projectInfo || {};

  const tabsData = [
    {
      label: <>General</>,
      component: (
        <GeneralInformation
          launchpadContract={launchpadContract}
          launchpadData={launchpadData}
        />
      ),
      isDisabled: false,
    },

    {
      label: <>Phase</>,
      component: (
        <PhaseInformation
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
