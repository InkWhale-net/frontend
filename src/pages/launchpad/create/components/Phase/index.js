import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  IconButton,
  SimpleGrid,
  Switch,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import SectionContainer from "../sectionContainer";
import { useState } from "react";
import IWInput from "components/input/Input";
import IWTextArea from "components/input/TextArea";
import DateTimePicker from "react-datetime-picker";
import { useCreateLaunchpad } from "../../CreateLaunchpadContext";
import { useEffect } from "react";
import { BsTrashFill } from "react-icons/bs";
import { QuestionOutlineIcon } from "@chakra-ui/icons";
import { AzeroLogo } from "components/icons/Icons";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { MdError } from "react-icons/md";
import { delay } from "utils";
const roundToMinute = (date) => {
  const roundedDate = new Date(date);
  roundedDate.setSeconds(0);
  roundedDate.setMilliseconds(0);
  return roundedDate;
};
const Phase = () => {
  const {
    updatePhase,
    updateTotalSupply,
    launchpadData,
    current,
    updateRequireKyc,
    prevStep,
    handleAddNewLaunchpad,
  } = useCreateLaunchpad();

  const [phaseData, setPhaseData] = useState({
    totalSupply: launchpadData?.totalSupply || "",
    requireKyc: launchpadData?.requireKyc || false,
    phase: launchpadData?.phase || [
      {
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
      },
    ],
  });

  useEffect(() => {
    if (current === 4) {
      window.scrollTo(0, 0);
      // if (launchpadData?.phase) setPhaseList(launchpadData?.phase);
      // if (launchpadData?.totalSupply)
      //   setTotalSupply(launchpadData?.totalSupply);
    }
  }, [current]);

  const onChangeImmediateReleaseRate = (form, value, index) => {
    if (+value >= 0 && +value <= 100) {
      const updatedArray = [...form.values.phase];
      if (index >= 0 && index < updatedArray?.length) {
        updatedArray[index] =
          +value == 100
            ? {
                ...updatedArray[index],
                immediateReleaseRate: value,
                vestingLength: 0,
                vestingUnit: 0,
              }
            : {
                ...updatedArray[index],
                immediateReleaseRate: value,
              };
      }
      form.setFieldValue("phase", updatedArray);
    }
  };

  const onChangeVestingDuration = (form, value, index) => {
    const updatedArray = [...form.values.phase];
    if (index >= 0 && index < updatedArray?.length) {
      updatedArray[index] = {
        ...updatedArray[index],
        vestingLength: value,
      };
    }
    form.setFieldValue("phase", updatedArray);
  };

  const onChangeVestingReleasePeriod = (form, value, index) => {
    const updatedArray = [...form.values.phase];
    if (index >= 0 && index < updatedArray?.length) {
      updatedArray[index] = {
        ...updatedArray[index],
        vestingUnit: value,
      };
    }
    form.setFieldValue("phase", updatedArray);
  };

  const validationSchema = Yup.object().shape({
    totalSupply: Yup.string().required("Total For Sale is required"),
    phase: Yup.array().of(
      Yup.object().shape({
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
        capAmount: Yup.string().required("This field is required"),
        immediateReleaseRate: Yup.number()
          .required("This field is required")
          .test(
            "is-valid-immediateReleaseRate",
            "Value must be in range 0 to 100",
            (value) => (+value > 0 ? "ok" : null)
          ),
        vestingLength: Yup.string().test(
          "is-require-vesting-length",
          "This field is required",
          function (value) {
            const immediateReleaseRate = this.parent.immediateReleaseRate;
            return +immediateReleaseRate == 100
              ? "ok"
              : +value > 0
              ? "ok"
              : null;
          }
        ),
        vestingUnit: Yup.string().test(
          "is-require-vesting-unit",
          "This field is required",
          function (value) {
            const immediateReleaseRate = this.parent.immediateReleaseRate;
            return +immediateReleaseRate == 100
              ? "ok"
              : +value > 0
              ? "ok"
              : null;
          }
        ),
      })
    ),
  });

  const handleSubmit = async (values, actions) => {
    actions.setSubmitting(false);
    await updatePhase(values.phase);
    await updateRequireKyc(values.requireKyc);
    await updateTotalSupply(values.totalSupply);
    await delay(1000);
    await handleAddNewLaunchpad();
  };

  return (
    <Formik
      initialValues={phaseData}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <SectionContainer title={"Total For Sale"}>
          <Field name="totalSupply">
            {({ field, form }) => (
              <FormControl
                isInvalid={form.errors.totalSupply && form.touched.totalSupply}
              >
                <IWInput
                  type="number"
                  value={field.value}
                  onChange={({ target }) => {
                    form.setFieldValue("totalSupply", target.value);
                    updateTotalSupply(target.value);
                  }}
                  placeholder="0"
                  inputRightElementIcon={launchpadData?.token?.symbol}
                />
                <FormErrorMessage>{form.errors.totalSupply}</FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Text
            sx={{ mt: "8px" }}
          >{`Token balance: ${launchpadData?.token?.balance} ${launchpadData?.token?.symbol}`}</Text>
        </SectionContainer>
        {/* =========================== */}
        <Heading
          as="h2"
          size="h2"
          sx={{ marginTop: "16px" }}
          lineHeight={{ base: "1.25", lg: "30px" }}
        >
          KYC Verification (Know Your Customer)
          <Tooltip
            fontSize="md"
            label={`Lorem KYC Verification is Know Your Customer`}
          >
            <QuestionOutlineIcon ml="6px" color="text.2" />
          </Tooltip>
        </Heading>

        <Box
          bg={{ base: "#F6F6FC" }}
          borderRadius={{ base: "10px" }}
          padding={{ base: "30px" }}
          sx={{ display: "flex", flexDirection: "column" }}
          mt="16px"
        >
          <Box sx={{ display: "flex" }} mt="16px">
            <Heading
              as="h3"
              size="h3"
              mb="16px"
              lineHeight={{ base: "1.25", lg: "30px" }}
            >
              Required KYC
            </Heading>
            <Field name="headerImage">
              {({ form }) => (
                <Switch
                  sx={{ mt: "4px", ml: "16px" }}
                  id="require-kyc"
                  isChecked={form.values.requireKyc}
                  onChange={() => {
                    const newValue = !form.values.requireKyc;
                    form.setFieldValue("requireKyc", newValue);
                    updateRequireKyc(newValue);
                  }}
                />
              )}
            </Field>
          </Box>
        </Box>

        {/* ================================================ */}
        <Heading
          sx={{ marginTop: "16px" }}
          as="h2"
          size="h2"
          // mb="8px"
          lineHeight={{ base: "1.25", lg: "30px" }}
        >
          Add Phase
        </Heading>
        <Field>
          {({ form }) =>
            form.values?.phase?.map((obj, index) => {
              return (
                <Box
                  bg={{ base: "#F6F6FC" }}
                  borderRadius={{ base: "10px" }}
                  padding={{ base: "30px" }}
                  sx={{ display: "flex", flexDirection: "column" }}
                  mt="16px"
                  key={`phase-${index}`}
                >
                  <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                    <FormControl
                      isInvalid={
                        form.errors?.phase?.[index]?.name &&
                        form.touched?.phase?.[index]?.name
                      }
                    >
                      <SectionContainer title="Name" isRequiredLabel>
                        <IWInput
                          value={obj?.name}
                          onChange={({ target }) => {
                            const updatedArray = [...form.values.phase];
                            if (index >= 0 && index < updatedArray?.length) {
                              updatedArray[index] = {
                                ...updatedArray[index],
                                name: target.value,
                              };
                            }
                            form.setFieldValue("phase", updatedArray);
                          }}
                          placeholder="Name"
                        />
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.name}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        form.errors?.phase?.[index]?.startDate &&
                        form.touched?.phase?.[index]?.startDate
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
                            locale="en-EN"
                            value={obj?.startDate}
                            onChange={(value) => {
                              const updatedArray = [...form.values.phase];
                              if (index >= 0 && index < updatedArray?.length) {
                                updatedArray[index] = {
                                  ...updatedArray[index],
                                  startDate: roundToMinute(value),
                                };
                              }
                              form.setFieldValue("phase", updatedArray);
                            }}
                          />
                        </Flex>
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.startDate}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        form.errors?.phase?.[index]?.endDate &&
                        form.touched?.phase?.[index]?.endDate
                      }
                    >
                      <SectionContainer
                        title="End"
                        isRequiredLabel
                        right={
                          form.values?.phase?.length > 1 && (
                            <IconButton
                              borderRadius="0"
                              icon={<BsTrashFill color="#57527E" />}
                              variant="link"
                              sx={{ marginTop: "4px" }}
                              onClick={() => {
                                form.setFieldValue("phase", [
                                  ...form.values.phase.slice(0, index),
                                  ...form.values.phase.slice(index + 1),
                                ]);
                              }}
                            />
                          )
                        }
                      >
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
                            value={obj?.endDate}
                            onChange={(value) => {
                              const updatedArray = [...form.values.phase];
                              if (index >= 0 && index < updatedArray?.length) {
                                updatedArray[index] = {
                                  ...updatedArray[index],
                                  endDate: roundToMinute(value),
                                };
                              }
                              form.setFieldValue("phase", updatedArray);
                            }}
                          />
                        </Flex>
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.endDate}
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
                        form.errors?.phase?.[index]?.capAmount &&
                        form.touched?.phase?.[index]?.capAmount
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
                              <QuestionOutlineIcon ml="6px" color="text.2" />
                            </Tooltip>
                          </>
                        }
                        isRequiredLabel
                      >
                        <IWInput
                          type="number"
                          value={obj?.capAmount}
                          onChange={({ target }) => {
                            const updatedArray = [...form.values.phase];
                            if (index >= 0 && index < updatedArray?.length) {
                              updatedArray[index] = {
                                ...updatedArray[index],
                                capAmount: target.value,
                              };
                            }
                            form.setFieldValue("phase", updatedArray);
                          }}
                          placeholder="0"
                        />
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.capAmount}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>

                    <FormControl
                      isInvalid={
                        form.errors?.phase?.[index]?.immediateReleaseRate &&
                        form.touched?.phase?.[index]?.immediateReleaseRate
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
                              <QuestionOutlineIcon ml="6px" color="text.2" />
                            </Tooltip>
                          </>
                        }
                        isRequiredLabel
                      >
                        <IWInput
                          inputRightElementIcon={<b>%</b>}
                          type="number"
                          value={obj?.immediateReleaseRate}
                          onChange={({ target }) =>
                            onChangeImmediateReleaseRate(
                              form,
                              target.value,
                              index
                            )
                          }
                          placeholder="0.00"
                        />
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.immediateReleaseRate}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>
                    <FormControl
                      isInvalid={
                        form.errors?.phase?.[index]?.vestingLength &&
                        form.touched?.phase?.[index]?.vestingLength
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
                              <QuestionOutlineIcon ml="6px" color="text.2" />
                            </Tooltip>
                          </>
                        }
                      >
                        <IWInput
                          inputRightElementIcon={<b>day(s)</b>}
                          isDisabled={+obj?.immediateReleaseRate == 100}
                          type="number"
                          value={obj?.vestingLength}
                          onChange={({ target }) =>
                            onChangeVestingDuration(form, target.value, index)
                          }
                          placeholder="0"
                        />
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.vestingLength}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>

                    <FormControl
                      isInvalid={
                        form.errors?.phase?.[index]?.vestingUnit &&
                        form.touched?.phase?.[index]?.vestingUnit
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
                              <QuestionOutlineIcon ml="6px" color="text.2" />
                            </Tooltip>
                          </>
                        }
                      >
                        <IWInput
                          inputRightElementIcon={<b>day(s)</b>}
                          isDisabled={
                            parseFloat(obj?.immediateReleaseRate) === 100
                          }
                          type="number"
                          value={obj?.vestingUnit}
                          onChange={({ target }) =>
                            onChangeVestingReleasePeriod(
                              form,
                              target.value,
                              index
                            )
                          }
                          placeholder="0"
                        />
                        <FormErrorMessage>
                          {form.errors?.phase?.[index]?.vestingUnit}
                        </FormErrorMessage>
                      </SectionContainer>
                    </FormControl>

                    {!form.values.requireKyc ? (
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
                          isChecked={obj?.allowPublicSale}
                          onChange={
                            () => {}
                            // setPhaseList((prevState) => {
                            //   const updatedArray = [...prevState];
                            //   if (index >= 0 && index < updatedArray.length) {
                            //     updatedArray[index] = {
                            //       ...updatedArray[index],
                            //       allowPublicSale: !obj?.allowPublicSale,
                            //     };
                            //   }
                            //   return updatedArray;
                            // })
                          }
                        />
                      </Box>
                    ) : null}
                  </SimpleGrid>
                  {!form.values.requireKyc ? (
                    <>
                      {obj?.allowPublicSale && (
                        <SimpleGrid columns={[1, 1, 3]} spacing={4}>
                          <SectionContainer title={"Public Amount"}>
                            <IWInput
                              type="number"
                              inputRightElementIcon={
                                launchpadData?.token?.symbol
                              }
                              value={obj?.phasePublicAmount}
                              onChange={
                                ({ target }) => {}
                                // setPhaseList((prevState) => {
                                //   const updatedArray = [...prevState];
                                //   if (
                                //     index >= 0 &&
                                //     index < updatedArray.length
                                //   ) {
                                //     updatedArray[index] = {
                                //       ...updatedArray[index],
                                //       phasePublicAmount: target.value,
                                //     };
                                //   }
                                //   return updatedArray;
                                // })
                              }
                              placeholder="0"
                            />
                          </SectionContainer>
                          <SectionContainer title={"Phase Public Price"}>
                            <IWInput
                              type="number"
                              inputRightElementIcon={<AzeroLogo />}
                              value={obj?.phasePublicPrice}
                              // onChange={({ target }) =>
                              //   setPhaseList((prevState) => {
                              //     const updatedArray = [...prevState];
                              //     if (
                              //       index >= 0 &&
                              //       index < updatedArray.length
                              //     ) {
                              //       updatedArray[index] = {
                              //         ...updatedArray[index],
                              //         phasePublicPrice: target.value,
                              //       };
                              //     }
                              //     return updatedArray;
                              //   })
                              // }
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
                          value={obj?.whiteList}
                          onChange={
                            ({ target }) => {}
                            // setPhaseList((prevState) => {
                            //   const updatedArray = [...prevState];
                            //   if (index >= 0 && index < updatedArray.length) {
                            //     updatedArray[index] = {
                            //       ...updatedArray[index],
                            //       whiteList: target.value,
                            //     };
                            //   }
                            //   return updatedArray;
                            // })
                          }
                          placeholder={`Sample:\n5EfUESCp28GXw1v9CXmpAL5BfoCNW2y4skipcEoKAbN5Ykfn, 100, 0.1\n5ES8p7zN5kwNvvhrqjACtFQ5hPPub8GviownQeF9nkHfpnkL, 20, 2`}
                        />
                      </SectionContainer>
                    </>
                  ) : null}
                </Box>
              );
            })
          }
        </Field>

        <Flex justify="center">
          <Field>
            {({ form }) => (
              <Button
                w={{
                  base: "full",
                  lg: "-webkit-fit-content",
                }}
                alignSelf={{ base: "center" }}
                mt={"16px"}
                type="button"
                onClick={() => {
                  form.setFieldValue("phase", [
                    ...form.values.phase,
                    {
                      name: "",
                      startDate: new Date(),
                      endDate: new Date(),
                      allowPublicSale: false,
                      vestingLength: "",
                      vestingUnit: "",
                      immediateReleaseRate: "",
                      phasePublicAmount: "",
                      phasePublicPrice: "",
                      whiteList: "",
                      capAmount: "",
                    },
                  ]);
                }}
              >
                Add Phase
              </Button>
            )}
          </Field>
        </Flex>
        <Field>
          {({ form }) => (
            <Flex justify="center" mt="20px">
              <Button
                onClick={() => {
                  (async () => {
                    await updatePhase(form.values?.phase);
                    await prevStep();
                  })();
                }}
                minW="100px"
              >
                Previous
              </Button>
              <Flex align="center">
                <Button mr="4px" ml="8px" type="submit" minW="100px">
                  Finish
                </Button>
                {Object.entries(form.errors)?.length > 0 && (
                  <MdError color="red" />
                )}
              </Flex>
            </Flex>
          )}
        </Field>
      </Form>
    </Formik>
  );
};

export default Phase;
