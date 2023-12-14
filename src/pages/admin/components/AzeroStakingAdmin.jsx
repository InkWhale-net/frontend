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
  Spacer,
  Stack,
  Text,
  Circle,
  useMediaQuery,
} from "@chakra-ui/react";
import {
  getAzeroStakingContract,
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
import { getApy } from "api/azero-staking/azero-staking";
import { getInwMultiplier } from "api/azero-staking/azero-staking";
import { getIsLocked } from "api/azero-staking/azero-staking";
import { doUpdateAzeroApy } from "api/azero-staking/azero-staking";
import { doUpdateInwMultiplier } from "api/azero-staking/azero-staking";
import { getBalanceOfBondAddress } from "utils/contracts";
import { doUpdateLockedStatus } from "api/azero-staking/azero-staking";
import styles from "./style.module.scss";
import Steps from "rc-steps";

import { CheckIcon } from "@chakra-ui/icons";
import { doDistributeAzero } from "api/azero-staking/azero-staking";

export default function AzeroStakingAdmin() {
  const { currentAccount } = useSelector((s) => s.wallet);

  const [hasWithdrawalManagerRole, setHasWithdrawalManagerRole] =
    useState(false);
  const [hasAdminRole, setHasAdminRole] = useState(false);
  useEffect(() => {
    const fetchRoleData = async () => {
      // WITHDRAW_TO_STAKE RoleType = 3333445727
      const hasWithdrawRole = await execContractQuery(
        currentAccount?.address,
        "api",
        my_azero_staking.CONTRACT_ABI,
        my_azero_staking.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        3333445727,
        currentAccount?.address
      );

      setHasWithdrawalManagerRole(hasWithdrawRole?.toHuman()?.Ok);

      // ADMINER RoleType = 3739740293
      const hasAdminRole = await execContractQuery(
        currentAccount?.address,
        "api",
        my_azero_staking.CONTRACT_ABI,
        my_azero_staking.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        3739740293,
        currentAccount?.address
      );

      setHasAdminRole(hasAdminRole?.toHuman()?.Ok);
    };

    fetchRoleData();
  }, [currentAccount?.address]);

  return (
    <>
      <ContractBalanceSection
        hasWithdrawalManagerRole={hasWithdrawalManagerRole}
      />
      <ApyAndMultiplierSection hasAdminRole={hasAdminRole} />
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
        maxWaitingTime,
        waitingListInfo,
        payableAzero,
      ]).then(
        ([
          azeroStakingContract,
          azeroBalance,
          azeroStakeBalance,
          withdrawableAzero,
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

  async function handleWithdrawAzeroToStake({ receiver, amount }) {
    if (!hasWithdrawalManagerRole) {
      toast.error("This account don't have Withdrawal Manager Role!");
      return;
    }

    if (!expirationDuration || !receiver || !amount) {
      toast.error("Invalid input!");
      return;
    }

    if (!isValidAddress(receiver)) {
      toast.error("Invalid receiver wallet format!");
      return;
    }

    if (info && info[3]?.value < amount) {
      toast.error(
        `Amount must be less than ${info[3]?.value.toFixed(4)} AZERO`
      );
      return;
    }

    try {
      await doWithdrawAzeroToStake(
        api,
        currentAccount,
        expirationDuration,
        receiver,
        amount
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
  // rewards section
  const [loadingInterest, setLoadingInterest] = useState(true);
  const [interestDistAccountInfo, setInterestDistAccountInfo] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted) => {
      try {
        setLoadingInterest(true);

        const interestDistributionContract =
          await getInterestDistributionContract();

        const inwInterestBalance = await getInwInterestBalance();
        const azeroInterestBalance = await getAzeroInterestBalance();

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
            title: "INW Interest Balance",
            value: inwInterestBalance,
            valueFormatted: `${formatNumDynDecimal(inwInterestBalance)} INW`,
            hasTooltip: true,
            tooltipContent: "inwInterestBalance",
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
              formatChainStringToNumber(info?.unclaimedAzeroReward || 0) /
              Math.pow(10, 12);

            const unclaimedInw =
              formatChainStringToNumber(info?.unclaimedInwReward || 0) /
              Math.pow(10, 12);

            return {
              unclaimedAzero,
              unclaimedInw,
            };
          })
        );
        console.log("listInfo", listInfo);
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
        console.log("totalUnclaimedRewards", totalUnclaimedRewards);
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
    (interestDistAccountInfo && interestDistAccountInfo[1]?.value) -
    unclaimedRewardsData?.inw;

  const insufficientAzeroRewardsAmount =
    (interestDistAccountInfo && interestDistAccountInfo[2]?.value) -
    unclaimedRewardsData?.azero;

  // ==============

  // END rewards section

  return (
    <IWCard mb="24px" w="full" variant="outline" title="Staking & Rewards">
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
              {idx === 4 && <Divider my="16px" />}
            </>
          ))
        )}

        <Divider my="16px" />

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
              {interestDistAccountInfo
                ?.slice(0, 1)
                ?.map(({ title, valueFormatted }) => (
                  <SimpleGrid
                    key={title}
                    columns={[1, 1, 2]}
                    spacing={["0px", "0px", "24px"]}
                  >
                    <Text mr="4px">{title}: </Text>
                    <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
                  </SimpleGrid>
                ))}
            </Box>
          </>
        )}

        <Divider my="16px" />
        <SimpleGrid columns={[1, 1, 2]} spacing={["0px", "0px", "40px"]}>
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
                {interestDistAccountInfo
                  ?.slice(1, 2)
                  ?.map(({ title, valueFormatted }) => (
                    <SimpleGrid
                      columns={[1, 1, 2]}
                      spacing={["0px", "0px", "24px"]}
                    >
                      <Text mr="4px">{title}: </Text>
                      <Text
                        mb={["12px", "12px", "2px"]}
                        textAlign={["left", "left", "right"]}
                      >
                        {valueFormatted}{" "}
                      </Text>
                    </SimpleGrid>
                  ))}

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">Unclaimed INW Rewards: </Text>
                  <Text
                    mb={["12px", "12px", "2px"]}
                    textAlign={["left", "left", "right"]}
                  >
                    {formatNumDynDecimal(unclaimedRewardsData?.inw)} INW
                  </Text>
                </SimpleGrid>

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">
                    {insufficientInwRewardsAmount > 0
                      ? "Excessive"
                      : "Insufficient"}{" "}
                    INW Amount:
                  </Text>
                  <Flex
                    justifyContent={["start", "start", "end"]}
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
              </Box>
            </>
          )}

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
              <Box mt={["24px", "24px", 0]}>
                {interestDistAccountInfo
                  ?.slice(-1)
                  ?.map(({ title, valueFormatted }) => (
                    <SimpleGrid
                      columns={[1, 1, 2]}
                      spacing={["0px", "0px", "24px"]}
                    >
                      <Text mr="4px">{title}: </Text>
                      <Text
                        mb={["12px", "12px", "2px"]}
                        textAlign={["left", "left", "right"]}
                      >
                        {valueFormatted}{" "}
                      </Text>
                    </SimpleGrid>
                  ))}

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">Unclaimed AZERO Rewards: </Text>
                  <Text
                    mb={["12px", "12px", "2px"]}
                    textAlign={["left", "left", "right"]}
                  >
                    {formatNumDynDecimal(unclaimedRewardsData?.azero)} AZERO
                  </Text>
                </SimpleGrid>

                <SimpleGrid
                  columns={[1, 1, 2]}
                  spacing={["0px", "0px", "24px"]}
                >
                  <Text mr="4px">
                    {insufficientInwRewardsAmount > 0
                      ? "Excessive"
                      : "Insufficient"}{" "}
                    AZERO Amount:
                  </Text>
                  <Flex
                    alignItems="center"
                    justifyContent={["start", "start", "end"]}
                    color={
                      insufficientAzeroRewardsAmount < 0 ? "#EA4A61" : "#8C86A5"
                    }
                  >
                    {insufficientAzeroRewardsAmount < 0 ? (
                      <WarningTwoIcon color="#EA4A61" mr="8px" />
                    ) : (
                      <CheckCircleIcon color="lightgreen" mr="8px" />
                    )}
                    {formatNumDynDecimal(insufficientAzeroRewardsAmount)} AZERO
                  </Flex>
                </SimpleGrid>
              </Box>
            </>
          )}
        </SimpleGrid>
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
                  amount: Yup.number("Amount must be a number.")
                    .max(
                      info && info[3]?.value,
                      `Amount must be less than or equal to ${
                        info && info[3]?.value?.toFixed(4)
                      } AZERO`
                    )
                    .required("This field is a required"),
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

                    <Field name="amount">
                      {({ field, form, meta }) => (
                        <FormControl isRequired id="amount" alignItems="center">
                          <FormLabel
                            display="flex"
                            ml={[0, 1]}
                            htmlFor="amount"
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
                                      info && info[3]?.value.toFixed(4)
                                    );
                                  }}
                                >
                                  Max
                                </Button>
                              }
                            />
                            <Input
                              {...field}
                              id="amount"
                              isDisabled={
                                isSubmitting || !hasWithdrawalManagerRole
                              }
                              onChange={({ target }) => {
                                form.setFieldValue(field.name, target.value);
                              }}
                              value={form.values.amount}
                              placeholder="0"
                              type="number"
                              max={info && info[3]?.value}
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

  const [loadingMasterAccount, setLoadingMasterAccount] = useState(true);
  const [masterAccountInfo, setMasterAccountInfo] = useState([]);

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
        const validatorAccountAddress =
          process.env.REACT_APP_ADMIN_BOND_WALLET_ADDRESS ||
          "5ERKXxAH8gqgMPzNtRpojrpndokD96EvMUG9obfwa6uDreM6";

        const { freeBal, frozenBal } = await getBalanceOfBondAddress({
          address: validatorAccountAddress,
        });

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
          {
            title: "Validator Account Address",
            value: validatorAccountAddress,
            valueFormatted: <AddressCopier address={validatorAccountAddress} />,
            hasTooltip: true,
            tooltipContent: "Validator Account",
          },
          {
            title: "Total Balance",
            value: freeBal,
            valueFormatted: `${formatNumDynDecimal(freeBal)} AZERO`,
            hasTooltip: true,
            tooltipContent: "freeBal",
          },
          {
            title: " - Frozen Amount",
            value: frozenBal,
            valueFormatted: `${formatNumDynDecimal(frozenBal)} AZERO`,
            hasTooltip: true,
            tooltipContent: "frozenBal",
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

  const [hasAdminRole, setHasAdminRole] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const hasAdminRole = await execContractQuery(
        currentAccount?.address,
        "api",
        my_azero_staking.CONTRACT_ABI,
        my_azero_staking.CONTRACT_ADDRESS,
        0,
        "accessControl::hasRole",
        3739740293,
        currentAccount?.address
      );
      setHasAdminRole(hasAdminRole.toHuman().Ok);
    };

    fetchData();
  }, [currentAccount?.address]);

  async function handleDistributeAzero() {
    // check role
    if (!hasAdminRole) {
      toast.error("This account don't have Admin Role!");
      return;
    }

    try {
      await doDistributeAzero(api, currentAccount);
    } catch (error) {
      console.log("Error", error);
      toast.error("Error", error);
    }
  }

  return (
    <IWCard mb="24px" w="full" variant="outline" title="Distribution">
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
            </Box>
            <Flex mt="16px">
              <Button
                size="sm"
                mt={["16px", "16px", "0px"]}
                isDisabled={!hasAdminRole}
                onClick={handleDistributeAzero}
              >
                Distribute Azero
              </Button>
            </Flex>
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

function stepIcon({ status, node }) {
  const isFinish = status === "finish";
  return !isFinish ? (
    node
  ) : (
    <Circle size="38px" bg="#E8FDFF" border={"1px solid #93F0F5"} color="white">
      <CheckIcon color={"#93F0F5"} />
    </Circle>
  );
}

function ApyAndMultiplierSection({ hasAdminRole }) {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const [apy, setApy] = useState(null);
  const [inwMultiplier, setInwMultiplier] = useState(null);

  const fetchApyAndMultiplier = useCallback(async () => {
    const apy = await getApy();
    // 5 ~ 5% // 500 ~500%
    setApy(apy);
    const inwMultiplier = await getInwMultiplier();

    // 10 ~ 10 INW/day
    setInwMultiplier(inwMultiplier);
  }, []);

  useEffect(() => {
    api && fetchApyAndMultiplier();
  }, [api, fetchApyAndMultiplier]);

  const [isLocked, setIsLocked] = useState(false);

  const fetchLockedStatusData = useCallback(async () => {
    const isLocked = await getIsLocked();
    setIsLocked(isLocked);
  }, []);

  useEffect(() => {
    api && fetchLockedStatusData();
  }, [api, currentAccount.address, fetchLockedStatusData]);

  const [newApy, setNewApy] = useState("");

  async function handleUpdateAzeroApy() {
    if (!hasAdminRole) {
      toast.error("You don't have Admin Role!");
      return;
    }

    if (!isLocked) {
      toast.error("Contract is not locked!");
      return;
    }

    try {
      await doUpdateAzeroApy(api, currentAccount, newApy * 100);

      delay(1000).then(() => {
        fetchApyAndMultiplier();
        setNewApy("");
      });
    } catch (error) {
      console.log("Error", error);
      toast.error("Error", error);
    }
  }

  const [newInwMultiplier, setNewInwMultiplier] = useState("");

  async function handleUpdateInwMultiplier() {
    if (!hasAdminRole) {
      toast.error("You don't have Admin Role!");
      return;
    }

    if (!isLocked) {
      toast.error("Contract is not locked!");
      return;
    }

    await doUpdateInwMultiplier(api, currentAccount, newInwMultiplier * 10000);

    delay(1000).then(() => {
      fetchApyAndMultiplier();
      setNewInwMultiplier("");
    });
  }
  // ========================

  const [stepNum, setStepNum] = useState(0);
  useEffect(() => {
    if (isLocked) {
      setStepNum(1);
    }
  }, [isLocked]);

  async function handleUpdateLockedStatus(status) {
    // check role
    if (!hasAdminRole) {
      toast.error("This account don't have Admin Role!");
      return;
    }

    await doUpdateLockedStatus(api, currentAccount, status);

    delay(1000).then(() => {
      !status ? setStepNum(0) : setStepNum(1);
      fetchLockedStatusData();
      fetchApyAndMultiplier();
    });
  }

  /*
  step 1 => Unlocked
  step 2 => Waiting BE update
  step 3 => Update APY & Multiplier
  step 4 => Locked
   */

  const itemSteps = [
    {
      title: "Lock contract",
      description: "Before update APY & Multiplier",
      content: <Text></Text>,
    },
    {
      title: "Waiting BE update",
      description: "Waiting BE update",
    },
    {
      title: "Update APY & Multiplier",
      description: "After BE updated",
    },
    {
      title: "Unlock contract",
      description: "After APY & Multiplier updated",
    },
  ];

  const [isBigScreen] = useMediaQuery("(min-width: 480px)");

  return (
    <>
      <Stack mb="24px">
        <Flex>
          <Text mr="6px">Contract status: </Text>
          <Text fontWeight="semibold"> {isLocked ? "Locked" : "Unlocked"}</Text>
        </Flex>

        <Text fontWeight="semibold">
          {!hasAdminRole ? "You don't have Admin Role" : "Your role is Admin"}
        </Text>
      </Stack>
      <Box className={styles.step_block}>
        <Steps
          direction={!isBigScreen ? "vertical" : "horizontal"}
          className={styles.step_create}
          current={stepNum}
          items={itemSteps}
          stepIcon={stepIcon}
        />
      </Box>
      <Stack
        w="full"
        my="24px"
        spacing="24px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        {/* Update Locked Status */}
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex fontSize="lg">
              <Text as="span">Update status</Text>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Button
              size="sm"
              w={["full"]}
              mt={["16px", "16px", "0px"]}
              isDisabled={isLocked || !hasAdminRole}
              onClick={() => handleUpdateLockedStatus(true)}
            >
              Lock
            </Button>
          </IWCard>
        </IWCard>

        {/* apy */}
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex fontSize="lg">
              <Text as="span">APY</Text>
              <Spacer />
              <Text as="span">{formatNumDynDecimal(apy) || 0} %/year</Text>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Flex flexDirection={["column-reverse"]}>
              <Button
                size="sm"
                mt={["16px", "16px", "0px"]}
                isDisabled={!isLocked || !newApy || !hasAdminRole}
                onClick={handleUpdateAzeroApy}
              >
                Update APY
              </Button>

              <InputGroup w={["full"]}>
                <InputRightElement
                  right={["10px", "10px", "6px"]}
                  justifyContent="end"
                  children={"%/year"}
                />
                <Input
                  isDisabled={!isLocked || !hasAdminRole}
                  type="number"
                  pr="70px"
                  placeholder="0"
                  textAlign="right"
                  mb={["0px", "0px", "16px"]}
                  value={newApy}
                  onChange={({ target }) => setNewApy(target.value)}
                />
              </InputGroup>
            </Flex>
          </IWCard>
        </IWCard>

        {/* inwMultiplier */}
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex fontSize="lg">
              <Text as="span">Multiplier</Text>
              <Spacer />
              <Text as="span">
                {formatNumDynDecimal(inwMultiplier) || 0} INW/day
              </Text>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Flex flexDirection={["column-reverse"]}>
              <Button
                size="sm"
                mt={["16px", "16px", "0px"]}
                isDisabled={!isLocked || !newInwMultiplier || !hasAdminRole}
                onClick={handleUpdateInwMultiplier}
              >
                Update Multiplier
              </Button>
              <InputGroup w={["full"]}>
                <InputRightElement
                  right={["10px", "10px", "6px"]}
                  justifyContent="end"
                  children={"INW/day"}
                />
                <Input
                  isDisabled={!hasAdminRole}
                  type="number"
                  pr="80px"
                  placeholder="0"
                  textAlign="right"
                  mb={["0px", "0px", "16px"]}
                  value={newInwMultiplier}
                  onChange={({ target }) => setNewInwMultiplier(target.value)}
                />
              </InputGroup>
            </Flex>
          </IWCard>
        </IWCard>

        {/* Update Locked Status */}
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex>
              <Text fontSize="lg" as="span">
                Update status
              </Text>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Button
              size="sm"
              w={["full"]}
              mt={["16px", "16px", "0px"]}
              isDisabled={!isLocked || !hasAdminRole}
              onClick={() => handleUpdateLockedStatus(false)}
            >
              Unlock
            </Button>
          </IWCard>
        </IWCard>
      </Stack>{" "}
    </>
  );
}
