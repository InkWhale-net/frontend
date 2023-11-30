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
import { processStringToArray } from "pages/launchpad/create/utils";
import { checkDuplicatedWL } from "pages/launchpad/create/utils";

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
    return launchpadData?.phaseList?.map((e) => {
      return {
        ...e,
        immediateReleaseRate: +e?.immediateReleaseRate?.replace(/,/g, "") / 100,
        name: e?.name,
        startDate: new Date(parseInt(e?.startTime?.replace(/,/g, ""))),
        endDate: new Date(parseInt(e?.endTime?.replace(/,/g, ""))),
        vestingLength:
          parseFloat(e?.vestingDuration?.replace(/,/g, "")) /
          millisecondsInADay,
        vestingUnit:
          +e?.vestingUnit == 1
            ? 0
            : parseFloat(e?.vestingUnit?.replace(/,/g, "")) /
              millisecondsInADay,
        allowPublicSale: e?.publicSaleInfor?.isPublic,
        phasePublicAmount: formatTokenAmount(
          e?.publicSaleInfor?.totalAmount,
          tokenDecimal
        ),
        capAmount: formatTokenAmount(e?.capAmount, tokenDecimal),
        phasePublicPrice: formatTokenAmount(e?.publicSaleInfor?.price, 12),
      };
    });
  }, [launchpadData]);

  const onSelectAction = async (form, _selectedPhaseIndex) => {
    try {
      if (_selectedPhaseIndex?.length > 0) {
        if (+_selectedPhaseIndex >= 0) {
          setSelectedPhaseIndex(_selectedPhaseIndex);
          const phaseData = phaseListData[_selectedPhaseIndex];
          if (phaseData) {
            setOnCreateNew(true);
            form.setValues(phaseData);
          }
        } else {
          setOnCreateNew(true);
          setSelectedPhaseIndex(-1);
          form.setValues({
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
          });
        }
      } else {
        setOnCreateNew(false);
        setSelectedPhaseIndex(-1);
        form.setValues({
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
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleCreateNewPhase = async (data) => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      const phaseList = [...phaseListData, data];
      if (
        !validatePhaseData(phaseList, {
          overlapseErrorMsgL:
            "New phase duration overlaps 1 or more phases. Please choose other time range",
        })
      ) {
        return;
      }
      const newPhaseInput = api.createType("PhaseInput", {
        name: data?.name,
        startTime: data?.startDate?.getTime(),
        endTime: data?.endDate?.getTime(),
        immediateReleaseRate: parseInt(
          (parseFloat(data?.immediateReleaseRate) * 100).toFixed()
        ).toString(),
        vestingDuration:
          data?.immediateReleaseRate === 100
            ? 0
            : dayToMilisecond(parseFloat(data?.vestingLength)),
        vestingUnit:
          data?.immediateReleaseRate === 100
            ? 1
            : dayToMilisecond(parseFloat(data?.vestingUnit)),
        capAmount: parseUnits(data?.capAmount.toString(), tokenDecimal),
        isPublic: data?.allowPublicSale,
        publicAmount: data?.allowPublicSale
          ? parseUnits(data?.phasePublicAmount.toString(), tokenDecimal)
          : null,
        publicPrice: data?.allowPublicSale
          ? parseUnits(data?.phasePublicPrice.toString(), 12)
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

  const handleUpdatePhase = async (values) => {
    // const newCapAmount = values?.capAmount;

    // if (newCapAmount > totalSupply) {
    //   toast.error("New phase cap amount can not be greater than total supply!");
    //   return;
    // }

    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet first!");
      }
      if (values?.whiteList)
        if (!verifyWhitelist(values?.whiteList)) {
          toast.error("Invalid whitelist format");
          return false;
        }
      const phaseList = [
        ...phaseListData.map((e, index) => {
          const phaseData = index === +selectedPhaseIndex ? values : e;
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
        name: values?.name,
        startTime: values?.startDate?.getTime(),
        endTime: values?.endDate?.getTime(),
        immediateReleaseRate: parseInt(
          (parseFloat(values?.immediateReleaseRate) * 100).toFixed()
        ).toString(),
        vestingDuration:
          values?.immediateReleaseRate === 100
            ? 0
            : dayToMilisecond(parseFloat(values?.vestingLength)),
        vestingUnit:
          values?.immediateReleaseRate === 100
            ? 1
            : dayToMilisecond(parseFloat(values?.vestingUnit)),
        capAmount: parseUnits(values?.capAmount.toString(), tokenDecimal),
        isPublic: values?.allowPublicSale,
        publicAmount: values?.allowPublicSale
          ? parseUnits(values?.phasePublicAmount.toString(), tokenDecimal)
          : null,
        publicPrice: values?.allowPublicSale
          ? parseUnits(values?.phasePublicPrice.toString(), 12)
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
        values?.isActive,
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
          if (+selectedPhaseIndex >= 0) {
            return (
              +value <=
              +phaseListData[selectedPhaseIndex]?.capAmount +
                +availableTokenAmount
            );
          } else return +value <= +availableTokenAmount;
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
    phasePublicAmount: Yup.string()
      .test(
        "is-require-phasePublicAmount",
        "This field is required",
        function (value) {
          const allowPublicSale = this.parent.allowPublicSale;
          return allowPublicSale == false ? true : +value > 0;
        }
      )
      .test(
        "is-valid-phasePublicAmount",
        "Total public sale and whitelist must not higher phase cap",
        function (value) {
          const capAmount = this.parent.capAmount;
          const allowPublicSale = this.parent.allowPublicSale;
          const wlStr = this.parent?.whiteList;
          const whitelistData = wlStr && processStringToArray(wlStr);
          const totalWhitelist =
            whitelistData?.reduce(
              (wlAcc, currentWLValue) => wlAcc + currentWLValue?.amount,
              0
            ) || 0;
          return (
            allowPublicSale == false ||
            (allowPublicSale == true &&
              (+value || 0) + totalWhitelist <= +capAmount)
          );
        }
      ),
    phasePublicPrice: Yup.string().test(
      "is-require-phasePublicAmount",
      "This field is required",
      function (value) {
        const allowPublicSale = this.parent.allowPublicSale;
        return (
          allowPublicSale == false || (allowPublicSale == true && +value > 0)
        );
      }
    ),
    whiteList: Yup.string()
      .test("is-valid-whitelist", "Invalid whitelist format", function (value) {
        if (value?.length > 0) {
          return verifyWhitelist(value);
        } else return true;
      })
      .test(
        "is-duplicated-whitelist",
        "Duplicated account address",
        function (value) {
          if (value?.length > 0) {
            return !checkDuplicatedWL(value);
          } else return true;
        }
      )
      .test(
        "is-valid-whitelist-no-allowPublicSale",
        "Total public sale and whitelist must not higher phase cap",
        function (value) {
          const capAmount = this.parent.capAmount;
          const allowPublicSale = this.parent.allowPublicSale;
          const phasePublicAmount = this.parent.phasePublicAmount;
          const whitelistData =
            value?.length > 0 ? processStringToArray(value) : null;
          const totalWhitelist = whitelistData
            ? whitelistData?.reduce(
                (wlAcc, currentWLValue) => wlAcc + currentWLValue?.amount,
                0
              )
            : 0;
          return (
            allowPublicSale == false ||
            (allowPublicSale == true &&
              (+phasePublicAmount || 0) + totalWhitelist <= +capAmount)
          );
        }
      )
      .test(
        "is-valid-whitelist-allowPublicSale",
        "Total whitelist sale amount must not higher phase cap",
        function (value) {
          const capAmount = this.parent.capAmount;
          if (!(capAmount?.length > 0)) return true;
          const allowPublicSale = this.parent.allowPublicSale;
          const whitelistData =
            value?.length > 0 ? processStringToArray(value) : null;
          const totalWhitelist = whitelistData
            ? whitelistData?.reduce(
                (wlAcc, currentWLValue) => wlAcc + currentWLValue?.amount,
                0
              )
            : 0;
          return (
            allowPublicSale == true ||
            (allowPublicSale == false && (totalWhitelist || 0) <= +capAmount)
          );
        }
      ),
  });
  const handleSubmit = async (values, actions) => {
    // handleUpdatePhase(values);
    if (selectedPhaseIndex < 0) handleCreateNewPhase(values);
    if (selectedPhaseIndex >= 0) handleUpdatePhase(values);
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
                                  onSelectAction(form, target.value);
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
                                        "startDate",
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
                                      form.setFieldValue(
                                        "endDate",
                                        roundToMinute(value)
                                      );
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
                                  isChecked={form.values?.allowPublicSale}
                                  isDisabled={!isPhaseEditable}
                                  onChange={() => {
                                    form.setFieldValue(
                                      "allowPublicSale",
                                      !form.values.allowPublicSale
                                    );
                                  }}
                                />
                              </Box>
                            )}
                          </SimpleGrid>
                          {form.values.allowPublicSale && (
                            <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                              <FormControl
                                isInvalid={
                                  form.errors?.phasePublicAmount &&
                                  form.touched?.phasePublicAmount
                                }
                              >
                                <SectionContainer
                                  title="Public Amount"
                                  isRequiredLabel
                                >
                                  <IWInput
                                    isDisabled={!isPhaseEditable}
                                    type="number"
                                    inputRightElementIcon={
                                      launchpadData?.token?.symbol
                                    }
                                    value={form.values?.phasePublicAmount}
                                    onChange={({ target }) => {
                                      form.setFieldValue(
                                        "phasePublicAmount",
                                        target.value
                                      );
                                    }}
                                    placeholder="0"
                                  />
                                  <FormErrorMessage>
                                    {form.errors?.phasePublicAmount}
                                  </FormErrorMessage>
                                </SectionContainer>
                              </FormControl>
                              <FormControl
                                isInvalid={
                                  form.errors?.phasePublicPrice &&
                                  form.touched?.phasePublicPrice
                                }
                              >
                                <SectionContainer
                                  title="Phase Public Price"
                                  isRequiredLabel
                                >
                                  <IWInput
                                    type="number"
                                    step="any"
                                    isDisabled={!isPhaseEditable}
                                    inputRightElementIcon={<AzeroLogo />}
                                    value={form.values?.phasePublicPrice}
                                    onChange={({ target }) => {
                                      form.setFieldValue(
                                        "phasePublicPrice",
                                        target.value
                                      );
                                    }}
                                    placeholder="0.0000"
                                  />
                                  <FormErrorMessage>
                                    {form.errors?.phasePublicPrice}
                                  </FormErrorMessage>
                                </SectionContainer>
                              </FormControl>
                            </SimpleGrid>
                          )}
                          {!launchpadData?.requireKyc && (
                            <>
                              <Divider sx={{ marginTop: "8px" }} />
                              {selectedPhaseIndex === -1 && (
                                <FormControl
                                  isInvalid={
                                    form.errors?.whiteList &&
                                    form.touched?.whiteList
                                  }
                                >
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
                                      value={form.values.whiteList}
                                      onChange={({ target }) =>
                                        form.setFieldValue(
                                          "whiteList",
                                          target.value
                                        )
                                      }
                                      placeholder={`Sample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn,100,0.1\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL,20,2`}
                                    />
                                    <FormErrorMessage>
                                      {form.errors?.whiteList}
                                    </FormErrorMessage>
                                  </SectionContainer>
                                </FormControl>
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
                              onSelectAction(form, target.value);
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
                            onSelectAction(form, "-1");
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
