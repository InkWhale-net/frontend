import {
  Box,
  Circle,
  Heading,
  Image,
  Text,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Show,
} from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWTabs from "components/tabs/IWTabs";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import GeneralInformation from "./tabs/GeneralInformation";
import TokenInformation from "./tabs/TokenInformation";
import PhaseInformation from "./tabs/Phase";
import BalanceTab from "./tabs/Balance";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { ChevronRightIcon } from "@chakra-ui/icons";
import ModalDetailContextProvider from "./modal/ModelContext";
import { useEffect } from "react";
import { useAppContext } from "contexts/AppContext";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";

const PublicDetailLaunchpad = () => {
  const { launchpads } = useSelector((s) => s.launchpad);
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const { currentAccount } = useSelector((s) => s.wallet);
  const params = useParams();
  const launchpadContract = params?.launchpadContract;
  const history = useHistory();

  useEffect(() => {
    if (api) dispatch(fetchLaunchpads({ isActive: 0 }));
  }, [currentAccount, api, dispatch]);

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
  const isLaunchpadOwner = useMemo(
    () => currentAccount?.address === launchpadData?.owner,

    [currentAccount?.address, launchpadData?.owner]
  );
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
    {
      label: <>Balance</>,
      component: <BalanceTab launchpadData={launchpadData} />,
      isDisabled: false,
    },
  ];
  return (
    <ModalDetailContextProvider launchpadData={launchpadData}>
      <Show above="md">
        <SectionContainer mt={{ xl: "-48px" }} mb={{ xl: "-32px" }}>
          <Breadcrumb
            spacing="4px"
            separator={<ChevronRightIcon color="gray.500" />}
          >
            <BreadcrumbItem color="text.1">
              <BreadcrumbLink onClick={() => history.push("/launchpad")}>
                All Launchpads
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem color="text.2">
              <BreadcrumbLink>Detail</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </SectionContainer>
      </Show>
      <SectionContainer mt={{ base: "0px", xl: "20px" }} right={<div></div>}>
        <Box sx={{ display: "flex", paddingBottom: "32px" }}>
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
          <Box sx={{ marginLeft: "16px", flex: 1 }}>
            <Heading>{projectInfor?.name}</Heading>
            <Box sx={{ display: "flex", marginTop: "4px" }}>
              <Image
                sx={{
                  w: "32px",
                  h: "32px",
                  borderRadius: "80px",
                  objectFit: "cover",
                  objectPosition: "center",
                  marginRight: "8px",
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
    </ModalDetailContextProvider>
  );
};

export default PublicDetailLaunchpad;
