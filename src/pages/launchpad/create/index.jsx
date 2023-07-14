import { Box, Button, Center } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import Steps from "rc-steps";
import CreateLaunchpadContextProvider, {
  useCreateLaunchpad,
} from "./CreateLaunchpadContext";
import styles from "./style.module.scss";
import { useEffect, useMemo } from "react";

function CreateLaunchpadLayout() {
  const {
    nextStep,
    prevStep,
    itemStep,
    current,
    isNextButtonActive,
    handleAddNewLaunchpad,
  } = useCreateLaunchpad();

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
          <Button
            w={"101px"}
            type="button"
            onClick={
              current < itemStep?.length - 1 ? nextStep : handleAddNewLaunchpad
            }
            disabled={!isNextButtonActive}
          >
            {current < itemStep?.length - 1 ? "Next" : "Finish"}
          </Button>
        </Center>
      </Box>
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
