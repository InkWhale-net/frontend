import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
import { Field, Form, Formik } from "formik";
import SectionContainer from "pages/launchpad/create/components/sectionContainer";
import {
  validatePhaseData,
  verifyWhitelist,
} from "pages/launchpad/create/utils";
import { useEffect, useMemo, useState } from "react";
import DateTimePicker from "react-datetime-picker";
import { toast } from "react-hot-toast";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { fetchLaunchpads } from "redux/slices/launchpadSlice";
import { formatChainStringToNumber } from "utils";
import {
  dayToMilisecond,
  delay,
  formatNumDynDecimal,
  formatTokenAmount,
  millisecondsInADay,
} from "utils";
import { execContractQuery, execContractTx } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import * as Yup from "yup";
import { roundToMinute } from "pages/launchpad/create/components/Phase";

const EditPhase = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhaseIndex, setSelectedPhaseIndex] = useState(-1);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const [onCreateNew, setOnCreateNew] = useState(true);
  const [newData, setNewData] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const dispatch = useDispatch();
  const phaseListData = useMemo(() => {
    return launchpadData?.phaseList?.map((e) => ({
      ...e,
      immediateReleaseRate:
        parseFloat(e?.immediateReleaseRate?.replace(/,/g, "")) / 100,
      name: e?.name,
      startDate: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
      endDate: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
      vestingLength:
        parseFloat(e?.vestingDuration?.replace(/,/g, "")) / millisecondsInADay,
      vestingUnit:
        parseFloat(e?.vestingUnit?.replace(/,/g, "")) / millisecondsInADay,
      allowPublicSale: e?.publicSaleInfor?.isPublic,
      phasePublicAmount: formatTokenAmount(
        e?.publicSaleInfor?.totalAmount,
        tokenDecimal
      ),
      capAmount: formatTokenAmount(e?.capAmount, tokenDecimal),
      phasePublicPrice: formatTokenAmount(e?.publicSaleInfor?.price, 12),
    }));
  }, [launchpadData]);

  useEffect(() => {
    if (selectedPhaseIndex >= 0) {
      const phaseData = phaseListData[selectedPhaseIndex];
      if (phaseData) {
        setOnCreateNew(true);
        setNewData(phaseData);
      } else {
        setOnCreateNew(false);
        setNewData({
          startDate: new Date(),
          endDate: new Date(),
        });
        setSelectedPhaseIndex(-1);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, launchpadData]);

  const totalSupply =
    formatChainStringToNumber(launchpadData?.totalSupply) / 10 ** tokenDecimal;

  const handleCreateNewPhase = async () => {
    const newCapAmount = newData?.capAmount;

    try {
      if (newCapAmount > totalSupply) {
        toast.error(
          "New phase cap amount can not be greater than total supply!"
        );
        return;
      }

      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      if (newData?.whiteList)
        if (!verifyWhitelist(newData?.whiteList)) {
          toast.error("Invalid whitelist format");
          return false;
        }
      const phaseList = [...phaseListData, newData];
      if (
        !validatePhaseData(phaseList, {
          overlapseErrorMsgL:
            "New phase duration overlaps 1 or more phases. Please choose other time range",
        })
      ) {
        return;
      }

      const newPhaseInput = api.createType("PhaseInput", {
        name: newData?.name,
        startTime: newData?.startDate?.getTime(),
        endTime: newData?.endDate?.getTime(),
        immediateReleaseRate: parseInt(
          (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
        ).toString(),
        vestingDuration:
          newData?.immediateReleaseRate === 100
            ? 0
            : dayToMilisecond(parseFloat(newData?.vestingLength)),
        vestingUnit:
          newData?.immediateReleaseRate === 100
            ? 1
            : dayToMilisecond(parseFloat(newData?.vestingUnit)),
        capAmount: parseUnits(newData?.capAmount.toString(), tokenDecimal),
        isPublic: newData?.allowPublicSale,
        publicAmount: newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicAmount.toString(), tokenDecimal)
          : null,
        publicPrice: newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicPrice.toString(), 12)
          : null,
      });

      const result = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "addNewPhase",
        newPhaseInput
      );
      if (result) {
        await delay(200);
        await APICall.askBEupdate({
          type: "launchpad",
          poolContract: launchpadData?.launchpadContract,
        });
        toast.promise(
          delay(5000).then(() => {
            dispatch(fetchLaunchpads({}));
            setOnCreateNew(false);
            setVisible(false);
          }),
          {
            loading: "Please wait up to 5s for the data to be updated! ",
            success: "Success",
            error: "Could not fetch data!!!",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePhase = async () => {
    const newCapAmount = newData?.capAmount;

    if (newCapAmount > totalSupply) {
      toast.error("New phase cap amount can not be greater than total supply!");
      return;
    }

    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      if (newData?.whiteList)
        if (!verifyWhitelist(newData?.whiteList)) {
          toast.error("Invalid whitelist format");
          return false;
        }
      const phaseList = [
        ...phaseListData.map((e, index) => {
          const phaseData = index === +selectedPhaseIndex ? newData : e;
          return {
            ...phaseData,
            name: phaseData?.name,
            immediateReleaseRate: phaseData?.immediateReleaseRate,
            startDate: phaseData?.startDate,
            endDate: phaseData?.endDate,
            vestingLength: phaseData?.vestingDuration,
            vestingUnit: phaseData?.vestingUnit,
            allowPublicSale: phaseData?.publicSaleInfor?.isPublic,
            phasePublicAmount: phaseData?.phasePublicAmount,
            phasePublicPrice: phaseData?.publicSaleInfor,
          };
        }),
      ];

      if (
        !validatePhaseData(phaseList, {
          overlapseErrorMsgL:
            "Updated phase time overlaps 1 or more phases. Please choose other time range",
        })
      )
        return;

      const editPhaseInput = api.createType("PhaseInput", {
        name: newData?.name,
        startTime: newData?.startDate?.getTime(),
        endTime: newData?.endDate?.getTime(),
        immediateReleaseRate: parseInt(
          (parseFloat(newData?.immediateReleaseRate) * 100).toFixed()
        ).toString(),
        vestingDuration:
          newData?.immediateReleaseRate === 100
            ? 0
            : dayToMilisecond(parseFloat(newData?.vestingLength)),
        vestingUnit:
          newData?.immediateReleaseRate === 100
            ? 1
            : dayToMilisecond(parseFloat(newData?.vestingUnit)),
        capAmount: parseUnits(newData?.capAmount.toString(), tokenDecimal),
        isPublic: newData?.allowPublicSale,
        publicAmount: newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicAmount.toString(), tokenDecimal)
          : null,
        publicPrice: newData?.allowPublicSale
          ? parseUnits(newData?.phasePublicPrice.toString(), 12)
          : null,
      });

      const result = await execContractTx(
        currentAccount,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0, //-> value
        "launchpadContractTrait::setPhase",
        selectedPhaseIndex,
        newData?.isActive,
        editPhaseInput
      );
      if (result) {
        await delay(200);
        await APICall.askBEupdate({
          type: "launchpad",
          poolContract: launchpadData?.launchpadContract,
        });
        toast.promise(
          delay(5000).then(() => {
            dispatch(fetchLaunchpads({}));
            setOnCreateNew(false);
            setVisible(false);
          }),
          {
            loading: "Please wait up to 5s for the data to be updated! ",
            success: "Success",
            error: "Could not fetch data!!!",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  const isPhaseEditable = useMemo(() => {
    if (selectedPhaseIndex >= 0) {
      const phaseData = phaseListData[selectedPhaseIndex];

      if (phaseData?.endDate < new Date() || phaseData?.startDate < new Date())
        return false;
      else return true;
    } else {
      return true;
    }
  }, [selectedPhaseIndex]);
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name required"),
    startDate: Yup.date().required("Start date is required"),
    endDate: Yup.date()
      .test(
        "is-after-start",
        "End date must be after start date",
        function (value) {
          const startDate = this.parent.startDate;
          return !startDate || !value || value > startDate;
        }
      )
      .required("End date is required"),
    capAmount: Yup.string()
      .test(
        "is-valid-capAmount",
        "Phase cap must equal or less than undistributed token",
        function (value) {
          return +value <= +availableTokenAmount;
        }
      )
      .required("This field is required"),
    immediateReleaseRate: Yup.number()
      .required("This field is required")
      .test(
        "is-valid-immediateReleaseRate",
        "Value must be in range 0 to 100",
        function (value) {
          return +value > 0 && +value <= 100;
        }
      ),
  });
  const handleSubmit = async (values, actions) => {
    console.log(values);
    actions.setSubmitting(false);
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
        <ModalHeader>
          {!onCreateNew
            ? "Manage Phases"
            : selectedPhaseIndex >= 0
            ? `Manage ${newData?.name ?? ""} phase`
            : "Create New Phase"}
        </ModalHeader>
        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody sx={{ pb: "28px", maxHeight: "80vh", overflow: "auto" }}>
          <Formik
            initialValues={{
              name: "",
              startDate: roundToMinute(new Date()),
              endDate: roundToMinute(new Date()),
              allowPublicSale: false,
              vestingLength: "",
              vestingUnit: "",
              immediateReleaseRate: "",
              phasePublicAmount: "",
              phasePublicPrice: "",
              whiteList: "",
              capAmount: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Field>
                {({ form }) => (
                  <>
                    <Text>
                      {`Undistributed token: ${formatNumDynDecimal(
                        availableTokenAmount
                      )} ${launchpadData?.projectInfo?.token?.symbol}`}
                    </Text>
                    {onCreateNew ? (
                      <>
                        {selectedPhaseIndex >= 0 && (
                          <>
                            <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                              Choose Phase
                            </Text>
                            <Box
                              sx={{ display: "flex", alignItems: "flex-end" }}
                            >
                              <Select
                                variant="filled"
                                defaultValue={-1}
                                placeholder="Select phase"
                                onChange={({ target }) => {
                                  setSelectedPhaseIndex(target.value);
                                }}
                                value={selectedPhaseIndex}
                              >
                                {phaseListData?.map((item, index) => (
                                  <option key={index} value={index}>
                                    {item.name}
                                  </option>
                                ))}
                              </Select>
                            </Box>
                          </>
                        )}
                        {!isPhaseEditable && (
                          <Box
                            sx={{
                              bg: "#FED1CA",
                              display: "flex",
                              alignItems: "center",
                              px: "10px",
                              py: "8px",
                              mt: "10px",
                              borderRadius: "4px",
                            }}
                          >
                            <AiFillExclamationCircle />
                            <Text sx={{ ml: "8px" }}>
                              You can not edit this phase!
                            </Text>
                          </Box>
                        )}
                        <Box
                          bg={{ base: "#F6F6FC" }}
                          borderRadius={{ base: "10px" }}
                          padding={{ base: "30px" }}
                          sx={{ display: "flex", flexDirection: "column" }}
                          mt="16px"
                        >
                          <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                            <FormControl
                              isInvalid={
                                form.errors?.name && form.touched?.name
                              }
                            >
                              <SectionContainer title="Name" isRequiredLabel>
                                <IWInput
                                  isDisabled={!isPhaseEditable}
                                  value={form.values.name}
                                  onChange={({ target }) => {
                                    form.setFieldValue("name", target.value);
                                  }}
                                  placeholder="Name"
                                />
                                <FormErrorMessage>
                                  {form.errors?.name}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>

                            <FormControl
                              isInvalid={
                                form.errors?.startDate &&
                                form.touched?.startDate
                              }
                            >
                              <SectionContainer title="Start" isRequiredLabel>
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
                                    disabled={!isPhaseEditable}
                                    locale="en-EN"
                                    value={form.values.startDate}
                                    onChange={(value) => {
                                      form.setFieldValue(
                                        "name",
                                        roundToMinute(value)
                                      );
                                    }}
                                  />
                                </Flex>
                                <FormErrorMessage>
                                  {form.errors?.startDate}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>
                            <FormControl
                              isInvalid={
                                form.errors?.endDate && form.touched?.endDate
                              }
                            >
                              <SectionContainer title="End" isRequiredLabel>
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
                                    disabled={!isPhaseEditable}
                                    locale="en-EN"
                                    value={form.values.endDate}
                                    onChange={(value) => {
                                      form.setFieldValue("endDate", value);
                                    }}
                                  />
                                </Flex>
                                <FormErrorMessage>
                                  {form.errors?.endDate}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>
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
                          <SimpleGrid columns={[1, 1, 4]} spacing={2}>
                            <FormControl
                              isInvalid={
                                (form.errors?.capAmount ||
                                  form.errors?.phase) &&
                                form.touched?.capAmount
                              }
                            >
                              <SectionContainer
                                title={
                                  <>
                                    Phase Cap
                                    <Tooltip
                                      fontSize="md"
                                      label={`Total token for sale in this phase`}
                                    >
                                      <QuestionOutlineIcon
                                        ml="6px"
                                        color="text.2"
                                      />
                                    </Tooltip>
                                  </>
                                }
                                isRequiredLabel
                              >
                                <IWInput
                                  type="number"
                                  isDisabled={!isPhaseEditable}
                                  value={form.values.capAmount}
                                  onChange={({ target }) => {
                                    form.setFieldValue(
                                      "capAmount",
                                      target.value
                                    );
                                  }}
                                  placeholder="0"
                                />
                                <FormErrorMessage>
                                  {form.errors?.capAmount}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>

                            <FormControl
                              isInvalid={
                                form.errors?.immediateReleaseRate &&
                                form.touched?.immediateReleaseRate
                              }
                            >
                              <SectionContainer
                                title={
                                  <>
                                    Initial Release Rate
                                    <Tooltip
                                      fontSize="md"
                                      label={`Percentage or portion of tokens that are immediately released to token holders upon the token launch or distribution event`}
                                    >
                                      <QuestionOutlineIcon
                                        ml="6px"
                                        color="text.2"
                                      />
                                    </Tooltip>
                                  </>
                                }
                                isRequiredLabel
                              >
                                <IWInput
                                  inputRightElementIcon={<b>%</b>}
                                  type="number"
                                  isDisabled={!isPhaseEditable}
                                  value={form.values.immediateReleaseRate}
                                  onChange={({ target }) => {
                                    const value = target.value;
                                    if (+value <= 100)
                                      form.setFieldValue(
                                        "immediateReleaseRate",
                                        value
                                      );
                                    if (+value == 100) {
                                      form.setFieldValue("vestingLength", 0);
                                      form.setFieldValue("vestingUnit", 0);
                                    }
                                  }}
                                  placeholder="0.00"
                                />
                                <FormErrorMessage>
                                  {form.errors?.immediateReleaseRate}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>
                            <FormControl
                              isInvalid={
                                form.errors?.vestingLength &&
                                form.touched?.vestingLength
                              }
                            >
                              <SectionContainer
                                title={
                                  <>
                                    Vesting Duration
                                    <Tooltip
                                      fontSize="md"
                                      label={`The Vesting Duration refers to the length of time over which tokens are gradually released to token holders according to a predetermined schedule`}
                                    >
                                      <QuestionOutlineIcon
                                        ml="6px"
                                        color="text.2"
                                      />
                                    </Tooltip>
                                  </>
                                }
                              >
                                <IWInput
                                  inputRightElementIcon={<b>day(s)</b>}
                                  isDisabled={
                                    +form.values.immediateReleaseRate == 100 ||
                                    !isPhaseEditable
                                  }
                                  type="number"
                                  value={form.values.vestingLength}
                                  onChange={({ target }) =>
                                    form.setFieldValue(
                                      "vestingLength",
                                      target.value
                                    )
                                  }
                                  placeholder="0"
                                />
                                <FormErrorMessage>
                                  {form.errors?.vestingLength}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>
                            <FormControl
                              isInvalid={
                                form.errors?.vestingUnit &&
                                form.touched?.vestingUnit
                              }
                            >
                              <SectionContainer
                                title={
                                  <>
                                    Vesting Release Period
                                    <Tooltip
                                      fontSize="md"
                                      label={`The Vesting Release Period is the interval or frequency at which vested tokens become accessible to the token holder according to the predetermined vesting schedule`}
                                    >
                                      <QuestionOutlineIcon
                                        ml="6px"
                                        color="text.2"
                                      />
                                    </Tooltip>
                                  </>
                                }
                              >
                                <IWInput
                                  inputRightElementIcon={<b>day(s)</b>}
                                  isDisabled={
                                    +form.values.immediateReleaseRate == 100 ||
                                    !isPhaseEditable
                                  }
                                  type="number"
                                  value={form.values.vestingUnit}
                                  onChange={({ target }) =>
                                    form.setFieldValue(
                                      "vestingUnit",
                                      target.value
                                    )
                                  }
                                  placeholder="0"
                                />
                                <FormErrorMessage>
                                  {form.errors?.vestingUnit}
                                </FormErrorMessage>
                              </SectionContainer>
                            </FormControl>

                            {!launchpadData?.requireKyc && (
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
                                  isDisabled={!isPhaseEditable}
                                  onChange={() =>
                                    setNewData((prevState) => ({
                                      ...prevState,
                                      allowPublicSale:
                                        !prevState?.allowPublicSale,
                                    }))
                                  }
                                />
                              </Box>
                            )}
                          </SimpleGrid>
                          {newData?.allowPublicSale && (
                            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                              <SectionContainer title={"Public Amount"}>
                                <IWInput
                                  type="number"
                                  isDisabled={!isPhaseEditable}
                                  inputRightElementIcon={
                                    launchpadData?.token?.symbol
                                  }
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
                                  isDisabled={!isPhaseEditable}
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
                          {!launchpadData?.requireKyc && (
                            <>
                              <Divider sx={{ marginTop: "8px" }} />
                              {selectedPhaseIndex === -1 && (
                                <SectionContainer
                                  title={
                                    <>
                                      White list
                                      <Tooltip
                                        fontSize="md"
                                        label={`Enter one address, whitelist amount and price on each line.
                A decimal separator of amount must use dot (.)`}
                                      >
                                        <QuestionOutlineIcon
                                          ml="6px"
                                          color="text.2"
                                        />
                                      </Tooltip>
                                    </>
                                  }
                                >
                                  <IWTextArea
                                    sx={{
                                      height: "80px",
                                    }}
                                    isDisabled={!isPhaseEditable}
                                    value={newData?.whiteList}
                                    onChange={({ target }) =>
                                      setNewData((prevState) => ({
                                        ...prevState,
                                        whiteList: target.value,
                                      }))
                                    }
                                    placeholder={`Sample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn,100,0.1\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL,20,2`}
                                  />
                                </SectionContainer>
                              )}
                            </>
                          )}
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
                              Cancel
                            </Button>
                            <Button
                              sx={{ mt: "20px", ml: "20px" }}
                              isDisabled={!isPhaseEditable}
                              type="submit"
                              // onClick={() => {
                              //   if (selectedPhaseIndex >= 0) {
                              //     handleUpdatePhase();
                              //   } else {
                              //     handleCreateNewPhase();
                              //   }
                              // }}
                            >
                              {selectedPhaseIndex >= 0
                                ? "Update phase"
                                : "Create Phase"}
                            </Button>
                          </Flex>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                          Select phase to edit
                        </Text>
                        <Box
                          sx={{ display: "flex" }}
                          flexDirection={["column", "row"]}
                          alignItems={["center", "flex-end"]}
                        >
                          <Select
                            variant="filled"
                            defaultValue={-1}
                            placeholder="Select phase"
                            onChange={({ target }) => {
                              setSelectedPhaseIndex(target.value);
                            }}
                            value={selectedPhaseIndex}
                          >
                            {phaseListData?.map((item, index) => (
                              <option key={index} value={index}>
                                {item.name}
                              </option>
                            ))}
                          </Select>
                        </Box>
                        <Button
                          mt={["16px"]}
                          size="md"
                          w={["full", "full", "25%"]}
                          onClick={() => {
                            setOnCreateNew(true);
                            setSelectedPhaseIndex(-1);
                          }}
                        >
                          Create New Phase
                        </Button>
                      </>
                    )}{" "}
                  </>
                )}
              </Field>
            </Form>
          </Formik>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
export default EditPhase;
