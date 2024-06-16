import { Box } from "@chakra-ui/react";
import SectionContainer from "components/container/SectionContainer";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import Steps from "rc-steps";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { formatNumDynDecimal, formatTokenAmountNumber } from "utils";
import { execContractQuery } from "utils/contracts";
import launchpad_generator from "utils/contracts/launchpad_generator";
import CreateLaunchpadContextProvider, {
  useCreateLaunchpad,
} from "./CreateLaunchpadContext";
import styles from "./style.module.scss";

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
  const [txRate, setTxRate] = useState(null);
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
      setCreateFee(
        formatNumDynDecimal(formatTokenAmountNumber(fee, appChain?.decimal))
      );
      const txRateQuery = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad_generator.CONTRACT_ABI,
        launchpad_generator.CONTRACT_ADDRESS,
        0,
        "launchpadGeneratorTrait::getTxRate"
      );
      setTxRate(+txRateQuery?.toHuman()?.Ok / 100);
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
          Network. This action requires {createFee} INW2 which will be burned
          immediately. A charge of {txRate}% on project creator side will be
          deducted for each successful purchase
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
