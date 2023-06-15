import { CheckIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import Steps, { Step } from "rc-steps";
import { useContext, useEffect, useState } from "react";
import CreateLaunchpadContextProvider, { CreateLaunchpadContext } from "./CreateLaunchpadContext";

function CreateLaunchpadLayout({ api }) {
  const { nextStep, prevStep, itemStep, current } = useContext(CreateLaunchpadContext);

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "8px" }}
      title="Lauchpad"
      description={
        <>
          The premier destination to launch your NFT Collection on Aleph Zero
          Network.
        </>
      }
    >
      <CreateLaunchpadContextProvider>
        <div style={{ width: "100%" }}>
          <Steps
            current={current}
            // onChange={(val) => {
            //   // eslint-disable-next-line no-console
            //   console.log("Change:", val);
            //   setCurrent(val);
            // }}
            items={itemStep}
          >
            {" "}
          </Steps>
          <div>
            <Button type="button" onClick={prevStep}>
              Back
            </Button>
            <Button type="button" onClick={nextStep}>
              Next
            </Button>
          </div>
        </div>
      </CreateLaunchpadContextProvider>
    </SectionContainer>
  );
}

const CreateLaunchpadPage = () => {
  return (
    <CreateLaunchpadContextProvider>
      <CreateLaunchpadLayout />
    </CreateLaunchpadContextProvider>
  );
};

export default CreateLaunchpadPage;
