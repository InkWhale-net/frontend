import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import IWTabs from "components/tabs/IWTabs";
import { useHistory } from "react-router-dom";

const Launchpad = () => {
  const history = useHistory();
  const tabsData = [
    {
      label: <>All Launchpads</>,
      component: <></>,
      isDisabled: false,
    },
    {
      label: <>Advanced Mode</>,
      component: <></>,
      isDisabled: false,
    },
    {
      label: <>My Contributions</>,
      component: <></>,
      isDisabled: false,
    },
  ];
  return (
    <SectionContainer
      title="Current Presales"
      right={
        <Button onClick={() => history.push("/create/launchpad")}>
          Create
        </Button>
      }
    >
      <IWTabs tabsData={tabsData} />
    </SectionContainer>
  );
};

export default Launchpad;
