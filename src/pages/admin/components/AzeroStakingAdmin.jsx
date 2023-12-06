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
  Text,
} from "@chakra-ui/react";
import { getMasterAccount } from "api/azero-staking/azero-staking";
import { getAzeroStakingContract } from "api/azero-staking/azero-staking";
import { getInwContract } from "api/azero-staking/azero-staking";
import { getInwBalanceOfAddress } from "api/azero-staking/azero-staking";

import { getAzeroStakeBalance } from "api/azero-staking/azero-staking";
import { getInterestDistributionContract } from "api/azero-staking/azero-staking";
import { getAzeroBalanceOfStakingContract } from "api/azero-staking/azero-staking";
import { getWithdrawalRequestList } from "api/azero-staking/azero-staking";
import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { formatNumDynDecimal } from "utils";
import { formatChainStringToNumber } from "utils";
import { getAzeroBalanceOfAddress } from "utils/contracts";

import RequestListTable from "./Table";
import { getRequestStatus } from "pages/azero-staking/Staking";
import { stakeStatus } from "constants";
import { ClaimRewardsTable } from "pages/azero-staking/components/Table";
import { addressShortener } from "utils";
import { getInwInterestBalance } from "api/azero-staking/azero-staking";
import { getWithdrawableAzeroToStakeToValidator } from "api/azero-staking/azero-staking";
import { doWithdrawAzeroToStake } from "api/azero-staking/azero-staking";
import { useAppContext } from "contexts/AppContext";
import { useDispatch, useSelector } from "react-redux";
import my_azero_staking from "utils/contracts/my_azero_staking";
import { execContractQuery } from "utils/contracts";
import { delay } from "utils";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { isValidAddress } from "pages/launchpad/create/utils";
import { WarningTwoIcon } from "@chakra-ui/icons";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { doWithdrawAzeroEmergency } from "api/azero-staking/azero-staking";

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

  const fetchData = useCallback(async (isMounted) => {
    try {
      setLoading(true);
      const { ret: expirationTime } = await APICall.getExpirationTime();
      setExpirationDuration(expirationTime);

      const azeroStakingContract = await getAzeroStakingContract();

      const azeroBalance = await getAzeroBalanceOfStakingContract();
      const withdrawableAzero = await getWithdrawableAzeroToStakeToValidator(
        expirationTime
      );
      const azeroStakeBalance = await getAzeroStakeBalance();
      const inwInterestBalance = await getInwInterestBalance();

      // console.log("interest::getAzeroStakingContract", azeroStakingContract);
      // console.log("Staking::getAzeroBalance", azeroBalanceOfStakingContract);
      // console.log("Staking::getWithdrawableAzeroToStakeToValidator",withdrawableAzeroToStakeToValidator);
      // console.log("Staking::getAzeroStakeAccount", azeroStakeBalance);
      // console.log("Staking::getInwInterestAccount", inwInterestBalance);

      Promise.all([
        azeroStakingContract,
        azeroBalance,
        azeroStakeBalance,
        withdrawableAzero,
        inwInterestBalance,
      ]).then(
        ([
          azeroStakingContract,
          azeroBalance,
          azeroStakeBalance,
          withdrawableAzero,
          inwInterestBalance,
        ]) => {
          if (!isMounted) {
            return;
          }

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
              title: "Withdrawable AZERO To Stake To Validator",
              value: withdrawableAzero,
              valueFormatted: `${formatNumDynDecimal(withdrawableAzero)} AZERO`,
              hasTooltip: true,
              tooltipContent: "withdrawableAzero",
            },
            {
              title: "INW Interest Balance",
              value: inwInterestBalance,
              valueFormatted: `${formatNumDynDecimal(inwInterestBalance)} INW`,
              hasTooltip: true,
              tooltipContent: "inwInterestBalance",
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
        `Amount must be less than ${info[1]?.value.toFixed(2)} AZERO`
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
          info?.map(({ title, valueFormatted }) => (
            <SimpleGrid columns={[1, 1, 2]} spacing="24px">
              <Text mr="4px">{title}: </Text>
              <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
            </SimpleGrid>
          ))
        )}
      </Box>

      <SimpleGrid columns={[1, 1, 2]} w="full" spacing="24px">
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
                      <FormControl id="receiver" isRequired alignItems="center">
                        <FormLabel
                          display="flex"
                          ml={[0, 1]}
                          htmlFor="receiver"
                        >
                          <Text>Receiver:</Text>
                        </FormLabel>

                        <Input
                          {...field}
                          id="receiver"
                          isDisabled={isSubmitting || !hasWithdrawalManagerRole}
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
                      info && info[1]?.value?.toFixed(2)
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
                          <Text>Receiver Emergency:</Text>
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
                          <Text>Amount:</Text>
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
                                    info && info[1]?.value.toFixed(0)
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
        const interestDistributionContractBalance =
          await getInwBalanceOfAddress({
            address: interestDistributionContract,
          });

        const interestDistributionContractBalanceAZERO =
          await getAzeroBalanceOfAddress({
            address: interestDistributionContract,
          });
        // console.log("Staking::getInterestDistributionContract", interestDistributionContract);
        // console.log("InterestDistributionContract psp22::balanceOf INW", interestDistributionContractBalance);
        // console.log("InterestDistributionContractBalanceAZERO", interestDistributionContractBalanceAZERO);

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
            title: "INW Balance",
            value: interestDistributionContractBalance,
            valueFormatted: `${formatNumDynDecimal(
              interestDistributionContractBalance
            )} INW`,
            hasTooltip: true,
            tooltipContent: "interestDistributionContractBalance",
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
              <SimpleGrid columns={[1, 1, 2]} spacing="24px">
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
                <SimpleGrid columns={[1, 1, 2]} spacing="24px">
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
        {loadingInterest ? (
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
                <SimpleGrid columns={[1, 1, 2]} spacing="24px">
                  <Text mr="4px">{title}: </Text>
                  <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
                </SimpleGrid>
              ))}
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
                <SimpleGrid columns={[1, 1, 2]} spacing="24px">
                  <Text mr="4px">Total Pending </Text>
                  <Text mb={["12px", "12px", "2px"]}>{totalPending} AZERO</Text>
                </SimpleGrid>

                <SimpleGrid columns={[1, 1, 2]} spacing="24px">
                  <Text mr="4px">Total Ready </Text>
                  <Text mb={["12px", "12px", "2px"]}>{totalReady} AZERO</Text>
                </SimpleGrid>

                <SimpleGrid columns={[1, 1, 2]} spacing="24px">
                  <Text mr="4px">Total Unstaked </Text>
                  <Text mb={["12px", "12px", "2px"]}>
                    {totalUnstaked} AZERO
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
