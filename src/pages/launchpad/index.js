import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWTabs from "components/tabs/IWTabs";
import { useHistory } from "react-router-dom";
import AllLaunchpads from "./tabs/AllLaunchpads";
import { isMobile } from "react-device-detect";

const Launchpad = () => {
  const history = useHistory();
  const tabsData = [
    {
      label: <>All Projects</>,
      component: <AllLaunchpads />,
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
      title="Current Presales"
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
