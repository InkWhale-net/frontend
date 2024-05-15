import { Box, Button, Center } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import Steps from "rc-steps";
import CreateLaunchpadContextProvider, {
  useCreateLaunchpad,
} from "./CreateLaunchpadContext";
import styles from "./style.module.scss";
import { useEffect, useMemo } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { execContractQuery } from "utils/contracts";
import { useAppContext } from "contexts/AppContext";
import launchpad_generator from "utils/contracts/launchpad_generator";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";
import { isMobile } from "react-device-detect";
import { appChain } from "constants";

function CreateLaunchpadLayout() {
  const {
    nextStep,
    prevStep,
    itemStep,
    current,
    isNextButtonActive,
    handleAddNewLaunchpad,
  } = useCreateLaunchpad();
  const [createFee, setCreateFee] = useState(null);
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const getCreateFee = async () => {
    try {
      const result = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "launchpadGeneratorTrait::getCreationFee"
      );
      const fee = result.toHuman().Ok;
      setCreateFee(formatNumDynDecimal(formatTokenAmount(fee, appChain?.decimal)));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currentAccount) getCreateFee();
  }, [currentAccount, api]);

  return (
    <SectionContainer
      mt={{ base: "0px", xl: "8px" }}
      title="Launchpad"
      description={
        <>
          The premier destination to launch your PSP22 token on Aleph Zero
          Network. This action requires {createFee} INW2.
        </>
      }
    >
      <Box w={"full"}>
        <div className={styles.step_block}>
          <Steps
            direction={isMobile ? "vertical" : "horizontal"}
            className={styles.step_create}
            current={current}
            items={itemStep}
          ></Steps>
        </div>
        <Box>{itemStep[current]?.content}</Box>
        {/* <Center mt={"60px"}>
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
        </Center> */}
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
