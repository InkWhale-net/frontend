import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWTabs from "components/tabs/IWTabs";
import { useHistory } from "react-router-dom";
import AllLaunchpads from "./tabs/AllLaunchpads";

const Launchpad = () => {
  const history = useHistory();
  const tabsData = [
    {
      label: <>All Launchpads</>,
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
        <Button
          onClick={async () => {
            history.push("/create/launchpad");
            // await APICall.askBEupdate({
            //   type: "launchpad",
            //   poolContract: "new",
            // });
          }}
        >
          Create
        </Button>
      }
    >
      <IWTabs tabsData={tabsData} />
      {/* <div style={{ width: "full" }}>
        
      </div> */}
    </SectionContainer>
  );
};

export default Launchpad;
