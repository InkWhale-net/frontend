import {
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  getAzeroStakingContract,
  getInwBalanceOfAddress,
  getInwContract,
  getMasterAccount,
} from "api/azero-staking/azero-staking";

import {
  getAzeroBalanceOfStakingContract,
  getAzeroStakeBalance,
  getInterestDistributionContract,
  getWithdrawalRequestList,
} from "api/azero-staking/azero-staking";
import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { formatChainStringToNumber, formatNumDynDecimal } from "utils";
import { getAzeroBalanceOfAddress } from "utils/contracts";

import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  doTopupAzeroStakeAccount,
  doWithdrawAzeroEmergency,
  doWithdrawAzeroToStake,
  getInwInterestBalance,
  getWithdrawableAzeroToStakeToValidator,
} from "api/azero-staking/azero-staking";
import { stakeStatus } from "constants";
import { useAppContext } from "contexts/AppContext";
import { Field, Form, Formik } from "formik";
import { getRequestStatus } from "pages/azero-staking/Staking";
import { ClaimRewardsTable } from "pages/azero-staking/components/Table";
import { isValidAddress } from "pages/launchpad/create/utils";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { addressShortener, delay } from "utils";
import { execContractQuery } from "utils/contracts";
import my_azero_staking from "utils/contracts/my_azero_staking";
import * as Yup from "yup";
import RequestListTable from "./Table";
import { getAzeroInterestBalance } from "api/azero-staking/azero-staking";
import { getMaxWaitingTime } from "api/azero-staking/azero-staking";
import { getPayableAzero } from "api/azero-staking/azero-staking";
import { getStakeList } from "api/azero-staking/azero-staking";
import { getStakeInfo } from "api/azero-staking/azero-staking";

export default function AzeroStakingAdmin() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [hasWithdrawalManagerRole, setHasWithdrawalManagerRole] =
    useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const hasRole = await execContractQuery(
        currentAccount?.address,
        "api",
        my_azero_staking.CONTRACT_ABI,
        my_azero_staking.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        3333445727,
        currentAccount.address
      );

      setHasWithdrawalManagerRole(hasRole?.toHuman()?.Ok);
    };

    fetchData();
  }, [currentAccount.address]);

  return (
    <>
      <ContractBalanceSection
        hasWithdrawalManagerRole={hasWithdrawalManagerRole}
      />
      <RewardsBalanceSection />
      <WithdrawalRequestListSection />
      <ValidatorRewardsSection />
    </>
  );
}

function ContractBalanceSection({ hasWithdrawalManagerRole }) {
  const dispatch = useDispatch();

  const { api } = useAppContext();
  const { currentAccount } = useSelector((s) => s.wallet);
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState([]);
  const [expirationDuration, setExpirationDuration] = useState(0);

  const userAzeroBalance = currentAccount?.balance?.azero?.replaceAll(",", "");

  const fetchData = useCallback(async (isMounted) => {
    try {
      setLoading(true);
      const { ret } = await APICall.getExpirationTime();
      setExpirationDuration(ret);

      const azeroStakingContract = await getAzeroStakingContract();

      const azeroBalance = await getAzeroBalanceOfStakingContract();
      const withdrawableAzero = await getWithdrawableAzeroToStakeToValidator(
        ret
      );
      const azeroStakeBalance = await getAzeroStakeBalance();
      const azeroInterestBalance = await getAzeroInterestBalance();
      const inwInterestBalance = await getInwInterestBalance();

      // console.log("interest::getAzeroStakingContract", azeroStakingContract);
      // console.log("Staking::getAzeroBalance", azeroBalanceOfStakingContract);
      // console.log("Staking::getWithdrawableAzeroToStakeToValidator",withdrawableAzeroToStakeToValidator);
      // console.log("Staking::getAzeroStakeAccount", azeroStakeBalance);
      // console.log("Staking::getInwInterestAccount", inwInterestBalance);

      const maxWaitingTime = await getMaxWaitingTime();
      const waitingListInfo = await APICall.getWaitingListInfo({
        expirationDuration: ret,
      });
      const payableAzero = await getPayableAzero();

      Promise.all([
        azeroStakingContract,
        azeroBalance,
        azeroStakeBalance,
        withdrawableAzero,
        azeroInterestBalance,
        inwInterestBalance,
        maxWaitingTime,
        waitingListInfo,
        payableAzero,
      ]).then(
        ([
          azeroStakingContract,
          azeroBalance,
          azeroStakeBalance,
          withdrawableAzero,
          azeroInterestBalance,
          inwInterestBalance,
          maxWaitingTime,
          waitingListInfo,
          payableAzero,
        ]) => {
          if (!isMounted) {
            return;
          }

          const insufficientAzeroAmount =
            formatChainStringToNumber(payableAzero) -
            (formatChainStringToNumber(waitingListInfo?.totalAzero) /
              Math.pow(10, 12) || 0);

          const ret = [
            {
              title: "Azero Staking Contract",
              value: azeroStakingContract,
              valueFormatted: (
                <>
                  <AddressCopier address={azeroStakingContract} />
                </>
              ),
              hasTooltip: true,
              tooltipContent: "azeroStakingContract",
            },
            {
              title: "Azero Balance Of Staking Contract",
              value: azeroBalance,
              valueFormatted: `${formatNumDynDecimal(azeroBalance)} AZERO`,
              hasTooltip: true,
              tooltipContent: "azeroBalance",
            },
            {
              title: "Azero Stake Balance",
              value: azeroStakeBalance,
              valueFormatted: `${formatNumDynDecimal(azeroStakeBalance)} AZERO`,
              hasTooltip: true,
              tooltipContent: "azeroStakeBalance",
            },
            {
              title: "Withdrawable To Stake To Validator",
              value: withdrawableAzero,
              valueFormatted: `${formatNumDynDecimal(withdrawableAzero)} AZERO`,
              hasTooltip: true,
              tooltipContent: "withdrawableAzero",
            },
            {
              title: "AZERO Interest Balance",
              value: azeroInterestBalance,
              valueFormatted: `${formatNumDynDecimal(
                azeroInterestBalance
              )} AZERO`,
              hasTooltip: true,
              tooltipContent: "azeroInterestBalance",
            },
            {
              title: "INW Interest Balance",
              value: inwInterestBalance,
              valueFormatted: `${formatNumDynDecimal(inwInterestBalance)} INW`,
              hasTooltip: true,
              tooltipContent: "inwInterestBalance",
            },
            {
              title: "Withdrawal Waiting Time",
              value: maxWaitingTime,
              valueFormatted: `${maxWaitingTime / 60000} mins`,
              hasTooltip: true,
              tooltipContent: "maxWaitingTime",
            },
            {
              title: "Total AZERO for pending list within expiration time",
              value: waitingListInfo?.totalAzero,
              valueFormatted: `${formatNumDynDecimal(
                formatChainStringToNumber(waitingListInfo?.totalAzero) /
                  Math.pow(10, 12)
              )} AZERO`,
              hasTooltip: true,
              tooltipContent: "waitingListInfo?.totalAzero",
            },
            {
              title: "Contract Payable Azero Amount",
              value: payableAzero,
              valueFormatted: `${formatNumDynDecimal(
                formatChainStringToNumber(payableAzero)
              )} AZERO`,
              hasTooltip: true,
              tooltipContent: "payableAzero",
            },
            {
              title: `${
                insufficientAzeroAmount > 0 ? "Excessive" : "Insufficient"
              } Amount`,
              value: insufficientAzeroAmount,
              valueFormatted: (
                <Flex
                  alignItems="center"
                  color={insufficientAzeroAmount < 0 ? "#EA4A61" : "#8C86A5"}
                >
                  {insufficientAzeroAmount < 0 ? (
                    <WarningTwoIcon color="#EA4A61" mr="8px" />
                  ) : (
                    <CheckCircleIcon color="lightgreen" mr="8px" />
                  )}
                  {formatNumDynDecimal(insufficientAzeroAmount)} AZERO
                </Flex>
              ),
              hasTooltip: true,
              tooltipContent: "insufficientAzeroAmount",
            },
          ];

          setInfo(ret);
          setLoading(false);
        }
      );
    } catch (error) {
      setLoading(false);

      console.log("Error", error);
      toast.error("Error", error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchData(isMounted);

    return () => (isMounted = false);
  }, [fetchData]);

  async function handleWithdrawAzeroToStake({ receiver }) {
    if (!hasWithdrawalManagerRole) {
      toast.error("This account don't have Withdrawal Manager Role!");
      return;
    }

    if (!expirationDuration || !receiver) {
      toast.error("Invalid input!");
      return;
    }

    if (!isValidAddress(receiver)) {
      toast.error("Invalid receiver wallet format!");
      return;
    }

    try {
      await doWithdrawAzeroToStake(
        api,
        currentAccount,
        expirationDuration,
        receiver
      );

      delay(1000).then(() => {
        fetchData(true);
        dispatch(fetchUserBalance({ currentAccount, api }));
      });
    } catch (error) {
      console.log("Error", error);
      toast.error("Error", error);
    }
  }

  async function handleWithdrawAzeroEmergency({
    receiverEmergency,
    amountEmergency,
  }) {
    if (!hasWithdrawalManagerRole) {
      toast.error("This account don't have Withdrawal Manager Role!");
      return;
    }

    if (!receiverEmergency || !amountEmergency) {
      toast.error("Invalid input!");
      return;
    }

    if (!isValidAddress(receiverEmergency)) {
      toast.error("Invalid receiver wallet format!");
      return;
    }

    if (info && info[1]?.value < amountEmergency) {
      toast.error(
        `Amount must be less than ${info[1]?.value.toFixed(4)} AZERO`
      );
      return;
    }

    try {
      await doWithdrawAzeroEmergency(
        api,
        currentAccount,
        receiverEmergency,
        amountEmergency
      );

      delay(1000).then(() => {
        fetchData(true);
        dispatch(fetchUserBalance({ currentAccount, api }));
      });
    } catch (error) {
      console.log("Error", error);
      toast.error("Error", error);
    }
  }

  async function handleTopupAzeroStakeAccount({ topupAmount }) {
    if (!topupAmount) {
      toast.error("Invalid input!");
      return;
    }

    if (userAzeroBalance < topupAmount) {
      toast.error(`Amount must be less than ${userAzeroBalance} AZERO`);
      return;
    }

    try {
      await doTopupAzeroStakeAccount(api, currentAccount, topupAmount);

      delay(1000).then(() => {
        fetchData(true);
        dispatch(fetchUserBalance({ currentAccount, api }));
      });
    } catch (error) {
      console.log("Error", error);
      toast.error("Error", error);
    }
  }

  return (
    <IWCard mb="24px" w="full" variant="outline" title="Staking">
      <Box pt="18px">
        {loading ? (
          <Flex justify="center" align="center" py="16px">
            <ClipLoader
              color="#57527E"
              loading
              size={36}
              speedMultiplier={1.5}
            />
          </Flex>
        ) : (
          info?.map(({ title, valueFormatted }, idx) => (
            <>
              <SimpleGrid columns={[1, 1, 2]} spacing={["0px", "0px", "24px"]}>
                <Text mr="4px">{title}: </Text>
                <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
              </SimpleGrid>
              {idx === 6 && <Divider my="16px" />}
            </>
          ))
        )}
      </Box>

      <SimpleGrid columns={[1, 1, 2]} w="full" spacing={["0px", "0px", "24px"]}>
        <Stack>
          {/* doWithdrawAzeroToStake */}
          <IWCard mt="16px" w="full" variant="solid">
            <Formik
              initialValues={{ receiver: "" }}
              validationSchema={() =>
                Yup.object().shape({
                  receiver: Yup.string().required("This field is a required"),
                })
              }
              onSubmit={async (values, formHelper) => {
                await handleWithdrawAzeroToStake(values);
                formHelper.resetForm();
              }}
            >
              {({ dirty, isValid, isSubmitting }) => (
                <Form>
                  <Flex flexDirection={["column"]}>
                    <Field name="receiver">
                      {({ field, form, meta }) => (
                        <FormControl
                          id="receiver"
                          isRequired
                          alignItems="center"
                        >
                          <FormLabel
                            display="flex"
                            ml={[0, 1]}
                            htmlFor="receiver"
                          >
                            <Text>Receiver</Text>
                          </FormLabel>

                          <Input
                            {...field}
                            id="receiver"
                            isDisabled={
                              isSubmitting || !hasWithdrawalManagerRole
                            }
                            onChange={({ target }) => {
                              form.setFieldValue(field.name, target.value);
                            }}
                            value={form.values.receiver}
                            placeholder="type your receiver address here ..."
                          />
                          <Text
                            h="20px"
                            color="red"
                            textAlign="left"
                            fontSize="14px"
                            lineHeight="22px"
                          >
                            {meta.touched && meta.error ? meta.error : null}
                          </Text>
                        </FormControl>
                      )}
                    </Field>

                    <Button
                      mt="16px"
                      isDisabled={
                        !(dirty && isValid) ||
                        isSubmitting ||
                        !hasWithdrawalManagerRole
                      }
                      type="submit"
                      w={["full"]}
                    >
                      {isSubmitting ? (
                        <ClipLoader
                          color="#57527E"
                          loading
                          size={18}
                          speedMultiplier={1.5}
                        />
                      ) : (
                        "Withdraw To Stake"
                      )}
                    </Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          </IWCard>

          {/* doTopupAzeroStakeAccount */}
          <IWCard mt="16px" w="full" variant="solid">
            <Formik
              initialValues={{ topupAmount: "" }}
              validationSchema={() =>
                Yup.object().shape({
                  topupAmount: Yup.number("Amount Emergency must be a number.")
                    .max(
                      userAzeroBalance,
                      `Topup Amount must be less than or equal to ${userAzeroBalance} AZERO`
                    )
                    .required("This field is a required"),
                })
              }
              onSubmit={async (values, formHelper) => {
                await handleTopupAzeroStakeAccount(values);
                formHelper.resetForm();
              }}
            >
              {({ dirty, isValid, isSubmitting }) => (
                <Form>
                  <Flex
                    flexDirection={["column", "column", "row"]}
                    alignItems="start"
                  >
                    <Field name="topupAmount">
                      {({ field, form, meta }) => (
                        <FormControl
                          isRequired
                          id="topupAmount"
                          alignItems="center"
                        >
                          <FormLabel
                            display="flex"
                            ml={[0, 1]}
                            htmlFor="topupAmount"
                          >
                            <Text>Topup Amount</Text>
                          </FormLabel>

                          <InputGroup>
                            <InputRightElement
                              right="10px"
                              justifyContent="end"
                              children={
                                <Button
                                  isDisabled={isSubmitting}
                                  size="sm"
                                  onClick={() => {
                                    form.setFieldValue(
                                      field.name,
                                      userAzeroBalance
                                    );
                                  }}
                                >
                                  Max
                                </Button>
                              }
                            />
                            <Input
                              {...field}
                              id="topupAmount"
                              isDisabled={isSubmitting}
                              onChange={({ target }) => {
                                form.setFieldValue(field.name, target.value);
                              }}
                              value={form.values.topupAmount}
                              placeholder="0"
                              type="number"
                              max={userAzeroBalance}
                            />
                          </InputGroup>
                          <Text
                            h="20px"
                            color="red"
                            textAlign="left"
                            fontSize="14px"
                            lineHeight="22px"
                          >
                            {meta.touched && meta.error ? meta.error : null}
                          </Text>
                        </FormControl>
                      )}
                    </Field>

                    <Button
                      mt={["16px", "16px", "38px"]}
                      ml={["0px", "0px", "8px"]}
                      isDisabled={!(dirty && isValid) || isSubmitting}
                      type="submit"
                      w={["full"]}
                    >
                      {isSubmitting ? (
                        <ClipLoader
                          color="#57527E"
                          loading
                          size={18}
                          speedMultiplier={1.5}
                        />
                      ) : (
                        "Topup Stake Account"
                      )}
                    </Button>
                  </Flex>
                </Form>
              )}
            </Formik>
          </IWCard>
        </Stack>

        {/* doWithdrawAzeroEmergency */}
        <IWCard mt="16px" w="full" variant="solid">
          <Formik
            initialValues={{ receiverEmergency: "", amountEmergency: "" }}
            validationSchema={() =>
              Yup.object().shape({
                receiverEmergency: Yup.string().required(
                  "This field is a required"
                ),
                amountEmergency: Yup.number(
                  "Amount Emergency must be a number."
                )
                  .max(
                    info && info[1]?.value,
                    `Amount Emergency must be less than or equal to ${
                      info && info[1]?.value?.toFixed(4)
                    } AZERO`
                  )
                  .required("This field is a required"),
              })
            }
            onSubmit={async (values, formHelper) => {
              await handleWithdrawAzeroEmergency(values);
              formHelper.resetForm();
            }}
          >
            {({ dirty, isValid, isSubmitting }) => (
              <Form>
                <Flex flexDirection={["column"]}>
                  <Field name="receiverEmergency">
                    {({ field, form, meta }) => (
                      <FormControl
                        isRequired
                        id="receiverEmergency"
                        alignItems="center"
                      >
                        <FormLabel
                          display="flex"
                          ml={[0, 1]}
                          htmlFor="receiverEmergency"
                        >
                          <Text>Receiver Emergency</Text>
                        </FormLabel>
                        <InputGroup>
                          <Input
                            {...field}
                            id="receiverEmergency"
                            isDisabled={
                              isSubmitting || !hasWithdrawalManagerRole
                            }
                            onChange={({ target }) => {
                              form.setFieldValue(field.name, target.value);
                            }}
                            value={form.values.receiverEmergency}
                            placeholder="type your emergency receiver address here ..."
                          />
                        </InputGroup>
                        <Text
                          h="20px"
                          color="red"
                          textAlign="left"
                          fontSize="14px"
                          lineHeight="22px"
                        >
                          {meta.touched && meta.error ? meta.error : null}
                        </Text>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="amountEmergency">
                    {({ field, form, meta }) => (
                      <FormControl
                        isRequired
                        id="amountEmergency"
                        alignItems="center"
                      >
                        <FormLabel
                          display="flex"
                          ml={[0, 1]}
                          htmlFor="amountEmergency"
                        >
                          <Text>Amount</Text>
                        </FormLabel>

                        <InputGroup>
                          <InputRightElement
                            right="10px"
                            justifyContent="end"
                            children={
                              <Button
                                isDisabled={
                                  isSubmitting || !hasWithdrawalManagerRole
                                }
                                size="sm"
                                onClick={() => {
                                  form.setFieldValue(
                                    field.name,
                                    info && info[1]?.value.toFixed(4)
                                  );
                                }}
                              >
                                Max
                              </Button>
                            }
                          />
                          <Input
                            {...field}
                            id="amountEmergency"
                            isDisabled={
                              isSubmitting || !hasWithdrawalManagerRole
                            }
                            onChange={({ target }) => {
                              form.setFieldValue(field.name, target.value);
                            }}
                            value={form.values.amountEmergency}
                            placeholder="0"
                            type="number"
                            max={info && info[1]?.value}
                          />
                        </InputGroup>
                        <Text
                          h="20px"
                          color="red"
                          textAlign="left"
                          fontSize="14px"
                          lineHeight="22px"
                        >
                          {meta.touched && meta.error ? meta.error : null}
                        </Text>
                      </FormControl>
                    )}
                  </Field>

                  <Button
                    mt="16px"
                    isDisabled={
                      !(dirty && isValid) ||
                      isSubmitting ||
                      !hasWithdrawalManagerRole
                    }
                    type="submit"
                    w={["full"]}
                  >
                    {isSubmitting ? (
                      <ClipLoader
                        color="#57527E"
                        loading
                        size={18}
                        speedMultiplier={1.5}
                      />
                    ) : (
                      <>
                        <WarningTwoIcon color="#EA4A61" mr="8px" />
                        Withdraw Emergency
                      </>
                    )}
                  </Button>
                </Flex>
              </Form>
            )}
          </Formik>
        </IWCard>
      </SimpleGrid>
    </IWCard>
  );
}

function RewardsBalanceSection() {
  const { api } = useAppContext();
  const { currentAccount } = useSelector((s) => s.wallet);
  const [loadingInkContract, setLoadingInkContract] = useState(true);
  const [inkContractInfo, setInkContractInfo] = useState([]);

  const [loadingMasterAccount, setLoadingMasterAccount] = useState(true);
  const [masterAccountInfo, setMasterAccountInfo] = useState([]);

  const [loadingInterest, setLoadingInterest] = useState(true);
  const [interestDistAccountInfo, setInterestDistAccountInfo] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted) => {
      try {
        setLoadingInkContract(true);

        const inwContract = await getInwContract();
        // console.log("interest::getInwContract", inwContract);

        const inkContractInfoData = [
          {
            title: "INW Contract",
            value: inwContract,
            valueFormatted: <AddressCopier address={inwContract} />,
            hasTooltip: true,
            tooltipContent: "inwContract",
          },
        ];

        if (!isMounted) {
          return;
        }

        setInkContractInfo(inkContractInfoData);

        setLoadingInkContract(false);
      } catch (error) {
        setLoadingInkContract(false);

        console.log("Error", error);
        toast.error("Error", error);
      }
    };

    fetchData(isMounted);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted) => {
      try {
        setLoadingMasterAccount(true);

        const masterAccount = await getMasterAccount();
        // console.log("interest::getMasterAccount", masterAccount);

        const masterAccountBalanceAZERO = await getAzeroBalanceOfAddress({
          address: masterAccount,
        });
        // console.log("MasterAccountBalanceAZERO", masterAccountBalanceAZERO);

        const masterAccountInfoData = [
          {
            title: "Master Account Address",
            value: masterAccount,
            valueFormatted: <AddressCopier address={masterAccount} />,
            hasTooltip: true,
            tooltipContent: "masterAccount",
          },

          {
            title: "AZERO Balance",
            value: masterAccountBalanceAZERO,
            valueFormatted: `${formatNumDynDecimal(
              masterAccountBalanceAZERO
            )} AZERO`,
            hasTooltip: true,
            tooltipContent: "masterAccountBalanceAZERO",
          },
        ];

        if (!isMounted) {
          return;
        }

        setMasterAccountInfo(masterAccountInfoData);
        setLoadingMasterAccount(false);
      } catch (error) {
        setLoadingMasterAccount(false);

        console.log("Error", error);
        toast.error("Error", error);
      }
    };

    fetchData(isMounted);

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted) => {
      try {
        setLoadingInterest(true);

        const interestDistributionContract =
          await getInterestDistributionContract();

        const interestDistributionContractBalanceAZERO =
          await getAzeroBalanceOfAddress({
            address: interestDistributionContract,
          });

        const interestDistributionContractBalance =
          await getInwBalanceOfAddress({
            address: interestDistributionContract,
          });
        // console.log("Staking::getInterestDistributionContract", interestDistributionContract);
        // console.log("InterestDistributionContractBalanceAZERO", interestDistributionContractBalanceAZERO);
        // console.log("InterestDistributionContract psp22::balanceOf INW", interestDistributionContractBalance);

        const interestDistAccountInfoData = [
          {
            title: "Interest Distribution Contract",
            value: interestDistributionContract,
            valueFormatted: (
              <AddressCopier address={interestDistributionContract} />
            ),
            hasTooltip: true,
            tooltipContent: "interestDistributionContract",
          },
          {
            title: "AZEROBalance",
            value: interestDistributionContractBalanceAZERO,
            valueFormatted: `${formatNumDynDecimal(
              interestDistributionContractBalanceAZERO
            )} AZERO`,
            hasTooltip: true,
            tooltipContent: "interestDistributionContractBalanceAZERO",
          },
          {
            title: "INW Balance",
            value: interestDistributionContractBalance,
            valueFormatted: `${formatNumDynDecimal(
              interestDistributionContractBalance
            )} INW`,
            hasTooltip: true,
            tooltipContent: "interestDistributionContractBalance",
          },
        ];

        if (!isMounted) {
          return;
        }

        setInterestDistAccountInfo(interestDistAccountInfoData);
        setLoadingInterest(false);
      } catch (error) {
        setLoadingInterest(false);

        console.log("Error", error);
        toast.error("Error", error);
      }
    };

    fetchData(isMounted);

    return () => (isMounted = false);
  }, []);

  // Calc Unclaimed Rewards Data==============
  const [unclaimedRewardsData, setUnclaimedRewardsData] = useState({});
  const [loadingUnclaimed, setLoadingUnclaimed] = useState(true);

  const fetchUnclaimedRewardsData = useCallback(
    async (isMounted) => {
      try {
        setLoadingUnclaimed(true);

        const stakeList = await getStakeList();

        const listInfo = await Promise.all(
          stakeList.map(async (addr) => {
            const info = await getStakeInfo(api, currentAccount, addr);

            const unclaimedAzero =
              formatChainStringToNumber(info?.unclaimedAzeroReward) /
              Math.pow(10, 12);

            const unclaimedInw =
              formatChainStringToNumber(info?.unclaimedInwReward) /
              Math.pow(10, 12);

            return { unclaimedAzero, unclaimedInw };
          })
        );

        const totalUnclaimedRewards = listInfo?.reduce(
          (prev, curr) => ({
            azero: prev?.azero + curr?.unclaimedAzero,
            inw: prev?.inw + curr?.unclaimedInw,
          }),
          {
            azero: 0,
            inw: 0,
          }
        );

        if (!isMounted) return;

        setUnclaimedRewardsData(totalUnclaimedRewards);
        setLoadingUnclaimed(false);
      } catch (error) {
        setLoadingUnclaimed(false);
        console.log("Error", error);
        toast.error("Error", error);
      }
    },
    [api, currentAccount]
  );

  useEffect(() => {
    let isMounted = true;
    api && fetchUnclaimedRewardsData(isMounted);

    return () => (isMounted = false);
  }, [api, currentAccount, fetchUnclaimedRewardsData]);

  const insufficientInwRewardsAmount =
    (interestDistAccountInfo && interestDistAccountInfo[2]?.value) -
    unclaimedRewardsData?.inw;

  // ==============

  return (
    <IWCard mb="24px" w="full" variant="outline" title="Rewards & Distribution">
      <Box pt="18px">
        {loadingInkContract ? (
          <Flex justify="center" align="center" py="16px">
            <ClipLoader
              color="#57527E"
              loading
              size={36}
              speedMultiplier={1.5}
            />
          </Flex>
        ) : (
          <>
            {inkContractInfo?.map(({ title, valueFormatted }) => (
              <SimpleGrid
                key={title}
                columns={[1, 1, 2]}
                spacing={["0px", "0px", "24px"]}
              >
                <Text mr="4px">{title}: </Text>
                <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
              </SimpleGrid>
            ))}
            <Divider my="12px" />{" "}
          </>
        )}
      </Box>

      <Box pt="18px">
        {loadingMasterAccount ? (
          <Flex justify="center" align="center" py="16px">
            <ClipLoader
              color="#57527E"
              loading
              size={36}
              speedMultiplier={1.5}
            />
          </Flex>
        ) : (
          <>
            <Box>
              {masterAccountInfo?.map(({ title, valueFormatted }) => (
                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">{title}: </Text>
                  <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
                </SimpleGrid>
              ))}{" "}
              <Divider my="12px" />
            </Box>
          </>
        )}
      </Box>

      <Box pt="18px">
        {loadingInterest || loadingUnclaimed ? (
          <Flex justify="center" align="center" py="16px">
            <ClipLoader
              color="#57527E"
              loading
              size={36}
              speedMultiplier={1.5}
            />
          </Flex>
        ) : (
          <>
            <Box>
              {interestDistAccountInfo?.map(({ title, valueFormatted }) => (
                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">{title}: </Text>
                  <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
                </SimpleGrid>
              ))}

              <SimpleGrid columns={[1, 1, 2]} spacing={["0px", "0px", "24px"]}>
                <Text mr="4px">Unclaimed INW Rewards: </Text>
                <Text mb={["12px", "12px", "2px"]}>
                  {formatNumDynDecimal(unclaimedRewardsData?.inw)} INW
                </Text>
              </SimpleGrid>

              <SimpleGrid columns={[1, 1, 2]} spacing={["0px", "0px", "24px"]}>
                <Text mr="4px">
                  {insufficientInwRewardsAmount > 0
                    ? "Excessive"
                    : "Insufficient"}{" "}
                  INW Amount:
                </Text>
                <Flex
                  alignItems="center"
                  color={
                    insufficientInwRewardsAmount < 0 ? "#EA4A61" : "#8C86A5"
                  }
                >
                  {insufficientInwRewardsAmount < 0 ? (
                    <WarningTwoIcon color="#EA4A61" mr="8px" />
                  ) : (
                    <CheckCircleIcon color="lightgreen" mr="8px" />
                  )}
                  {formatNumDynDecimal(insufficientInwRewardsAmount)} INW
                </Flex>
              </SimpleGrid>

              <SimpleGrid columns={[1, 1, 2]} spacing={["0px", "0px", "24px"]}>
                <Text mr="4px">Unclaimed AZERO Rewards: </Text>
                <Text mb={["12px", "12px", "2px"]}>
                  {formatNumDynDecimal(unclaimedRewardsData?.azero)} AZERO
                </Text>
              </SimpleGrid>
            </Box>
          </>
        )}
      </Box>
    </IWCard>
  );
}

function WithdrawalRequestListSection() {
  const [loading, setLoading] = useState(true);

  const [requestList, setRequestList] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted) => {
      try {
        setLoading(true);

        const withdrawalRequestList = await getWithdrawalRequestList();

        const withdrawalRequestListFormatted = withdrawalRequestList
          ?.map((i) => ({
            ...i,
            requestUserAddress: i.user,
            requestIndex: parseInt(i.requestIndex),
            azeroAmount: formatChainStringToNumber(i.amount) / Math.pow(10, 12),
            timeStamp: formatChainStringToNumber(i.requestTime) * 1,
            dateTime: new Date(
              formatChainStringToNumber(i.requestTime) * 1
            ).toLocaleString(),
            requestStatus: getRequestStatus(i.status),
          }))
          .sort((a, b) => b.requestIndex - a.requestIndex);

        // {
        //   requestIndex: '0',
        //   user: '5HSnVwAUX6N1Xvcs4wnYueAhom6oBN6YzvGk7uvL3grjR1Pt',
        //   amount: '6,000,000,000,000',
        //   requestTime: '1,701,430,238,000',
        //   status: '2'
        // },
        // ================================
        // {
        //   requestIndex: 9,
        //   user: '5HSnVwAUX6N1Xvcs4wnYueAhom6oBN6YzvGk7uvL3grjR1Pt',
        //   amount: '2,000,000,000,000',
        //   requestTime: '1,701,746,143,000',
        //   status: '2',
        //   requestUserAddress: '5HSnVwAUX6N1Xvcs4wnYueAhom6oBN6YzvGk7uvL3grjR1Pt',
        //   azeroAmount: 2,
        //   timeStamp: 1701746143000,
        //   dateTime: '12/5/2023, 10:15:43 AM',
        //   requestStatus: 'Unstaked'
        // },
        // ================================

        if (!isMounted) {
          return;
        }
        setRequestList(withdrawalRequestListFormatted);

        setLoading(false);
      } catch (error) {
        setLoading(false);

        console.log("Error", error);
        toast.error("Error", error);
      }
    };

    fetchData(isMounted);

    return () => (isMounted = false);
  }, []);

  function calculateTotalStake(p, c, status) {
    const num = c.requestStatus === status ? c.azeroAmount : 0;
    return num + p;
  }

  const totalPending = useMemo(
    () =>
      requestList?.reduce(
        (p, c) => calculateTotalStake(p, c, stakeStatus.PENDING),
        0
      ),
    [requestList]
  );

  const totalReady = useMemo(
    () =>
      requestList?.reduce(
        (p, c) => calculateTotalStake(p, c, stakeStatus.READY),
        0
      ),
    [requestList]
  );

  const totalUnstaked = useMemo(
    () =>
      requestList?.reduce(
        (p, c) => calculateTotalStake(p, c, stakeStatus.UNSTAKED),
        0
      ),
    [requestList]
  );

  const [filter, setFilter] = useState(false);

  const filterList = useMemo(() => {
    if (!filter) {
      return requestList;
    }

    return requestList.filter((i) => i.requestStatus === stakeStatus.PENDING);
  }, [filter, requestList]);

  return (
    <>
      <IWCard mb="24px" w="full" variant="outline" title="Withdrawal Request">
        <Box>
          {loading ? (
            <Flex justify="center" align="center" py="16px">
              <ClipLoader
                color="#57527E"
                loading
                size={36}
                speedMultiplier={1.5}
              />
            </Flex>
          ) : (
            <>
              <Box pt="18px">
                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">Total Pending </Text>
                  <Text mb={["12px", "12px", "2px"]}>
                    {formatNumDynDecimal(totalPending)} AZERO
                  </Text>
                </SimpleGrid>

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">Total Ready </Text>
                  <Text mb={["12px", "12px", "2px"]}>
                    {formatNumDynDecimal(totalReady)} AZERO
                  </Text>
                </SimpleGrid>

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">Total Unstaked </Text>
                  <Text mb={["12px", "12px", "2px"]}>
                    {formatNumDynDecimal(totalUnstaked)} AZERO
                  </Text>
                </SimpleGrid>
              </Box>
            </>
          )}
        </Box>
      </IWCard>

      <Flex justify="end" my="18px">
        <Checkbox
          size="lg"
          colorScheme="orange"
          onChange={() => setFilter(!filter)}
        >
          <Text mr="4px">Pending Only </Text>
        </Checkbox>
      </Flex>

      <Box>
        {loading ? (
          <Flex justify="center" align="center" py="16px">
            <ClipLoader
              color="#57527E"
              loading
              size={36}
              speedMultiplier={1.5}
            />
          </Flex>
        ) : (
          <>
            <RequestListTable tableBody={filterList} />
          </>
        )}
      </Box>
    </>
  );
}

function ValidatorRewardsSection() {
  const [loading, setLoading] = useState(true);

  const [userClaimedList, setUserClaimedList] = useState([]);

  const fetchUserClaimedList = useCallback(async () => {
    try {
      setLoading(true);
      const { status, ret, message } = await APICall.getDistributionInfo();

      if (status !== "OK") {
        toast.error("message", message);
      }

      if (ret?.length) {
        const formattedClaimedList = ret.map((i) => {
          const interestAccount =
            formatChainStringToNumber(i.interestAccountAmount) /
            Math.pow(10, 12);

          const masterAccount =
            formatChainStringToNumber(i.masterAccountAmount) / Math.pow(10, 12);

          const shortTxId = addressShortener(i.txId);

          const claimedTime = new Date(i.timestamp).toLocaleString();

          return {
            ...i,
            claimedTime,
            shortTxId,
            interestAccount,
            masterAccount,
          };
        });

        setUserClaimedList(formattedClaimedList);
        setLoading(false);
      } else {
        setUserClaimedList([]);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);

      console.log("Error", error);
      toast.error("Error", error);
    }
  }, []);

  useEffect(() => {
    fetchUserClaimedList();
  }, [fetchUserClaimedList]);

  return (
    <>
      <IWCard my="24px" w="full" variant="outline" title="Validator Rewards">
        <Box>
          {loading ? (
            <Flex justify="center" align="center" py="16px">
              <ClipLoader
                color="#57527E"
                loading
                size={36}
                speedMultiplier={1.5}
              />
            </Flex>
          ) : (
            <>
              <Box py="18px"></Box>
            </>
          )}
        </Box>
      </IWCard>
      {loading ? (
        <Flex justify="center" align="center" py="16px">
          <ClipLoader color="#57527E" loading size={36} speedMultiplier={1.5} />
        </Flex>
      ) : (
        <>
          <ClaimRewardsTable tableBody={userClaimedList} />
        </>
      )}
    </>
  );
}
