import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWTabs from "components/tabs/IWTabs";
import { useHistory } from "react-router-dom";
import AllLaunchpads from "./tabs/AllLaunchpads";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { useEffect } from "react";

const Launchpad = () => {


  const history = useHistory();
  const tabsData = [
    {
      label: <>All Projects</>,
      component: <AllLaunchpads />,
      isDisabled: false,
    },
    {
      label: <>My Projects</>,
      component: <AllLaunchpads isOwner/>,
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
    <SectionContainer
      title="Launchpads"
      right={
        isMobile ? null : (
          <Button
            onClick={async () => {
              history.push("/launchpad/create");
              // await APICall.askBEupdate({
              //   type: "launchpad",
              //   poolContract: "new",
              // });
            }}
          >
            Create
          </Button>
        )
      }
    >
      {isMobile ? (
        <Button
          onClick={async () => {
            history.push("/launchpad/create");
            // await APICall.askBEupdate({
            //   type: "launchpad",
            //   poolContract: "new",
            // });
          }}
        >
          Create
        </Button>
      ) : null}
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
};

export default Launchpad;
