import { CheckIcon } from "@chakra-ui/icons";
import { Box, Button, Center } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import Steps, { Step } from "rc-steps";
import styles from "./style.module.scss";
import { useContext, useEffect, useState } from "react";
import CreateLaunchpadContextProvider, {
  CreateLaunchpadContext,
} from "./CreateLaunchpadContext";

function CreateLaunchpadLayout({ api }) {
  const { nextStep, prevStep, itemStep, current } = useContext(
    CreateLaunchpadContext
  );
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
        <Box w={"full"}>
          <div className={styles.step_block}>
            <Steps
              className={styles.step_create}
              current={current}
              items={itemStep}
            ></Steps>
          </div>
          <Box>{itemStep[current]?.content}</Box>
          <Center mt={"60px"}>
            {current > 0 && (
              <Button w={"101px"} mr={"12px"} type="button" onClick={prevStep}>
                Back
              </Button>
            )}
            <Button w={"101px"} type="button" onClick={nextStep}>
              {current < itemStep?.length - 1 ? "Next" : "Finish"}
            </Button>
          </Center>
        </Box>
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
