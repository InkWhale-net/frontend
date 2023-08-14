import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  SimpleGrid,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { APICall } from "api/client";
import { AzeroLogo } from "components/icons/Icons";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import { useAppContext } from "contexts/AppContext";
import { parseUnits } from "ethers";
import SectionContainer from "pages/launchpad/create/components/sectionContainer";
import { verifyWhitelist } from "pages/launchpad/create/utils";
import { useEffect, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { dayToMilisecond } from "utils";
import { millisecondsInADay } from "utils";
import { delay } from "utils";
import { formatNumDynDecimal } from "utils";
import { formatTokenAmount } from "utils";
import { execContractTx } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";

const EditPhase = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(-1);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const [onCreateNew, setOnCreateNew] = useState(true);
  const [newData, setNewData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const phaseData = launchpadData?.phaseList[selectedPhaseIndex];
    if (phaseData) {
      setOnCreateNew(true);
      setNewData({
        immediateReleaseRate:
          parseFloat(phaseData?.immediateReleaseRate?.replace(/,/g, "")) / 100,
        name: phaseData?.name,
        startDate: new Date(parseInt(phaseData?.startTime?.replace(/,/g, ""))),
        endDate: new Date(parseInt(phaseData?.endTime?.replace(/,/g, ""))),
        vestingLength:
          parseFloat(phaseData?.vestingDuration?.replace(/,/g, "")) /
          millisecondsInADay,
        vestingUnit:
          parseFloat(phaseData?.vestingUnit?.replace(/,/g, "")) /
          millisecondsInADay,
        allowPublicSale: phaseData?.isPublic,
        phasePublicAmount: formatTokenAmount(
          phaseData?.publicSaleInfor?.totalAmount,
          tokenDecimal
        ),
        phasePublicPrice: formatTokenAmount(
          phaseData?.publicSaleInfor?.price,
          12
        ),
      });
    } else {
      setOnCreateNew(false);
      setNewData(null);
      setSelectedPhaseIndex(-1);
    }
  }, [selectedPhaseIndex]);
  const fetchPhaseData = async () => {
    const result = await execContractQuery(
      currentAccount?.address,
      api,
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getAvailableTokenAmount"
    );
    const availableAmount = result.toHuman().Ok;
    setAvailableTokenAmount(formatTokenAmount(availableAmount, tokenDecimal));
  };
  useEffect(() => {
    if (!visible) {
      setOnCreateNew(false);
      setNewData(null);
      setSelectedPhaseIndex(-1);
    } else {
      if (launchpadData) fetchPhaseData();
    }
  }, [visible, launchpadData]);

  const onChangeImmediateReleaseRate = (value) => {
    setNewData((prevState) => ({
      ...prevState,
      immediateReleaseRate: value,
    }));

    if (+value === 100) {
      onChangeVestingDuration(0);
      onChangeVestingReleasePeriod(0);
    }
  };
  const onChangeVestingDuration = (value) => {
    setNewData((prevState) => ({
      ...prevState,
      vestingLength: value,
    }));
  };
  const onChangeVestingReleasePeriod = (value) => {
    setNewData((prevState) => ({
      ...prevState,
      vestingUnit: value,
    }));
  };

  const handleCreateNewPhase = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      if (newData?.whiteList)
        if (!verifyWhitelist(newData?.whiteList)) {
          toast.error("Invalid whitelist format");
          return false;
        }

      await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "addNewPhase",
        newData?.name,
        newData?.startDate?.getTime(),
        newData?.endDate?.getTime(),
        newData?.immediateReleaseRate === 100
          ? parseInt(
              (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
            )
          : parseInt(
              (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
            ),
        newData?.immediateReleaseRate === 100
          ? 0
          : dayToMilisecond(parseFloat(newData?.vestingLength)),
        newData?.immediateReleaseRate === 100
          ? 1
          : dayToMilisecond(parseFloat(newData?.vestingUnit)),
        newData?.allowPublicSale,
        newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicAmount.toString(), tokenDecimal)
          : null,
        newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicPrice.toString(), 12)
          : null
      );
      await delay(2000);
      await APICall.askBEupdate({
        type: "launchpad",
        poolContract: launchpadData?.launchpadContract,
      });
      toast.promise(
        delay(5000).then(() => {
          dispatch(fetchLaunchpads({ isActive: 0 }));
          setOnCreateNew(false);
          setVisible(false);
        }),
        {
          loading: "Please wait up to 5s for the data to be updated! ",
          success: "Success",
          error: "Could not fetch data!!!",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdatePhase = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      if (newData?.whiteList)
        if (!verifyWhitelist(newData?.whiteList)) {
          toast.error("Invalid whitelist format");
          return false;
        }

      await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "LaunchpadContractTrait::set_phase",
        // newData?.name,
        // newData?.startDate?.getTime(),
        // newData?.endDate?.getTime(),
        // newData?.immediateReleaseRate === 100
        //   ? parseInt(
        //       (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
        //     )
        //   : parseInt(
        //       (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
        //     ),
        // newData?.immediateReleaseRate === 100
        //   ? 0
        //   : dayToMilisecond(parseFloat(newData?.vestingLength)),
        // newData?.immediateReleaseRate === 100
        //   ? 1
        //   : dayToMilisecond(parseFloat(newData?.vestingUnit)),
        // newData?.allowPublicSale,
        // newData?.allowPublicSale
        //   ? parseUnits(newData?.phasePublicAmount.toString(), tokenDecimal)
        //   : null,
        // newData?.allowPublicSale
        //   ? parseUnits(newData?.phasePublicPrice.toString(), 12)
        //   : null
      );
      await delay(2000);
      await APICall.askBEupdate({
        type: "launchpad",
        poolContract: launchpadData?.launchpadContract,
      });
      toast.promise(
        delay(5000).then(() => {
          dispatch(fetchLaunchpads({ isActive: 0 }));
          setOnCreateNew(false);
          setVisible(false);
        }),
        {
          loading: "Please wait up to 5s for the data to be updated! ",
          success: "Success",
          error: "Could not fetch data!!!",
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Modal
      onClose={() => setVisible(false)}
      isOpen={visible}
      isCentered
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update phases</ModalHeader>
        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody sx={{ pb: "28px" }}>
          <Text>
            Available token amount:{" "}
            {`${formatNumDynDecimal(availableTokenAmount)} 
            ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>

          {onCreateNew ? (
            <>
              {selectedPhaseIndex >= 0 && (
                <>
                  <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                    Choose Phase
                  </Text>
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <Select
                      variant="filled"
                      defaultValue={-1}
                      placeholder="Select phase"
                      onChange={({ target }) => {
                        setSelectedPhaseIndex(target.value);
                      }}
                      value={selectedPhaseIndex}
                    >
                      {launchpadData?.phaseList.map((item, index) => (
                        <option key={index} value={index}>
                          {item.name}
                        </option>
                      ))}
                    </Select>
                  </Box>
                </>
              )}
              <Box
                bg={{ base: "#F6F6FC" }}
                borderRadius={{ base: "10px" }}
                padding={{ base: "30px" }}
                sx={{ display: "flex", flexDirection: "column" }}
                mt="16px"
              >
                <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                  <SectionContainer title={"Name"}>
                    <IWInput
                      value={newData?.name}
                      onChange={({ target }) =>
                        setNewData((prevState) => ({
                          ...prevState,
                          name: target.value,
                        }))
                      }
                      placeholder="Name"
                    />
                  </SectionContainer>
                  <SectionContainer title={"Start"}>
                    <Flex
                      h="52px"
                      borderWidth="1px"
                      justifyContent="start"
                      borderRadius="5px"
                      sx={{
                        "& .react-datetime-picker__calendar": {
                          zIndex: 9999,
                        },
                      }}
                    >
                      <DateTimePicker
                        locale="en-EN"
                        value={newData?.startDate || new Date()}
                        onChange={(value) =>
                          setNewData((prevState) => ({
                            ...prevState,
                            startDate: value,
                          }))
                        }
                      />
                    </Flex>
                  </SectionContainer>

                  <SectionContainer title={"End"}>
                    <Flex
                      h="52px"
                      borderWidth="1px"
                      justifyContent="start"
                      borderRadius="5px"
                      sx={{
                        "& .react-datetime-picker__calendar": {
                          zIndex: 9999,
                        },
                      }}
                    >
                      <DateTimePicker
                        locale="en-EN"
                        value={newData?.endDate || new Date()}
                        onChange={(value) =>
                          setNewData((prevState) => ({
                            ...prevState,
                            endDate: value,
                          }))
                        }
                      />
                    </Flex>
                  </SectionContainer>
                </SimpleGrid>
                <Heading
                  as="h2"
                  size="h2"
                  // mb="16px"
                  mt="16px"
                  lineHeight={{ base: "1.25", lg: "30px" }}
                >
                  Vesting Plan
                </Heading>
                <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                  <SectionContainer
                    title={
                      <>
                        Immediate Release Rate
                        <Tooltip
                          fontSize="md"
                          label={`Percentage or portion of tokens that are immediately released to token holders upon the token launch or distribution event`}
                        >
                          <QuestionOutlineIcon ml="6px" color="text.2" />
                        </Tooltip>
                      </>
                    }
                  >
                    <IWInput
                      inputRightElementIcon={<b>%</b>}
                      type="number"
                      value={newData?.immediateReleaseRate}
                      onChange={({ target }) =>
                        onChangeImmediateReleaseRate(target.value)
                      }
                      placeholder="0.00"
                    />
                  </SectionContainer>
                  <SectionContainer
                    title={
                      <>
                        Vesting Duration
                        <Tooltip
                          fontSize="md"
                          label={`The Vesting Duration refers to the length of time over which tokens are gradually released to token holders according to a predetermined schedule`}
                        >
                          <QuestionOutlineIcon ml="6px" color="text.2" />
                        </Tooltip>
                      </>
                    }
                  >
                    <IWInput
                      inputRightElementIcon={
                        <Tooltip
                          fontSize="md"
                          label={
                            "The vesting duration refers to the length of time over which a vesting schedule is applied"
                          }
                        >
                          <b>day(s)</b>
                        </Tooltip>
                      }
                      isDisabled={
                        parseFloat(newData?.immediateReleaseRate) === 100
                      }
                      type="number"
                      value={newData?.vestingLength}
                      onChange={({ target }) =>
                        onChangeVestingDuration(target.value)
                      }
                      placeholder="0"
                    />
                  </SectionContainer>
                  <SectionContainer title={"Vesting Release Period"}>
                    <IWInput
                      inputRightElementIcon={
                        <Tooltip
                          fontSize="md"
                          label={
                            "The Vesting Release Period is the interval or frequency at which vested tokens become accessible to the token holder according to the predetermined vesting schedule"
                          }
                        >
                          <b>day(s)</b>
                        </Tooltip>
                      }
                      isDisabled={
                        parseFloat(newData?.immediateReleaseRate) === 100
                      }
                      type="number"
                      value={newData?.vestingUnit}
                      onChange={({ target }) =>
                        onChangeVestingReleasePeriod(target.value)
                      }
                      placeholder="0"
                    />
                  </SectionContainer>

                  <Box sx={{ display: "flex" }}>
                    <Heading
                      as="h3"
                      size="h3"
                      mb="16px"
                      lineHeight={{ base: "1.25", lg: "30px" }}
                    >
                      Allow Public Sale
                    </Heading>
                    <Switch
                      sx={{ mt: "4px", ml: "16px" }}
                      id="zero-reward-pools"
                      isChecked={newData?.allowPublicSale}
                      onChange={() =>
                        setNewData((prevState) => ({
                          ...prevState,
                          allowPublicSale: !prevState?.allowPublicSale,
                        }))
                      }
                    />
                  </Box>
                </SimpleGrid>
                {newData?.allowPublicSale && (
                  <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                    <SectionContainer title={"Public Amount"}>
                      <IWInput
                        type="number"
                        inputRightElementIcon={launchpadData?.token?.symbol}
                        value={newData?.phasePublicAmount}
                        onChange={({ target }) =>
                          setNewData((prevState) => ({
                            ...prevState,
                            phasePublicAmount: target.value,
                          }))
                        }
                        placeholder="0"
                      />
                    </SectionContainer>
                    <SectionContainer title={"Phase Public Price"}>
                      <IWInput
                        type="number"
                        inputRightElementIcon={<AzeroLogo />}
                        value={newData?.phasePublicPrice}
                        onChange={({ target }) =>
                          setNewData((prevState) => ({
                            ...prevState,
                            phasePublicPrice: target.value,
                          }))
                        }
                        placeholder="0.0000"
                      />
                    </SectionContainer>
                  </SimpleGrid>
                )}
                <Divider sx={{ marginTop: "8px" }} />
                <SectionContainer
                  title={
                    <>
                      White list
                      <Tooltip
                        fontSize="md"
                        label={`Enter one address, whitelist amount and price on each line.
                A decimal separator of amount must use dot (.)`}
                      >
                        <QuestionOutlineIcon ml="6px" color="text.2" />
                      </Tooltip>
                    </>
                  }
                >
                  <IWTextArea
                    sx={{
                      height: "80px",
                    }}
                    value={newData?.whiteList}
                    onChange={({ target }) =>
                      setNewData((prevState) => ({
                        ...prevState,
                        whiteList: target.value,
                      }))
                    }
                    placeholder={`Sample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn, 100, 0.1\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL, 20, 2`}
                  />
                </SectionContainer>
                <Flex sx={{ justifyContent: "center" }}>
                  <Button
                    sx={{ mt: "20px", bg: "#F6F6FC" }}
                    _hover={{ bg: "#E3E1EC" }}
                    onClick={() => {
                      setOnCreateNew(false);
                      setNewData(null);
                      setSelectedPhaseIndex(-1);
                    }}
                  >
                    Cancle
                  </Button>
                  <Button
                    sx={{ mt: "20px", ml: "20px" }}
                    onClick={() => {
                      if (selectedPhaseIndex >= 0) {
                        handleUpdatePhase();
                      } else {
                        handleCreateNewPhase();
                      }
                    }}
                  >
                    {selectedPhaseIndex >= 0 ? "Update phase" : "Create Phase"}
                  </Button>
                </Flex>
              </Box>
            </>
          ) : (
            <>
              <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                Choose Phase
              </Text>
              <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                <Select
                  variant="filled"
                  defaultValue={-1}
                  placeholder="Select phase"
                  onChange={({ target }) => {
                    setSelectedPhaseIndex(target.value);
                  }}
                  value={selectedPhaseIndex}
                >
                  {launchpadData?.phaseList.map((item, index) => (
                    <option key={index} value={index}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <Button
                  sx={{ marginLeft: "10px" }}
                  size="md"
                  onClick={() => {
                    setOnCreateNew(true);
                    setSelectedPhaseIndex(-1);
                  }}
                >
                  Create new Phase
                </Button>
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditPhase;
