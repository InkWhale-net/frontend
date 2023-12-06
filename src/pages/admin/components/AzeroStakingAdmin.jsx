import {
  Box,
  Checkbox,
  Divider,
  Flex,
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
import { getTotalAzeroStaked } from "api/azero-staking/azero-staking";
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

const INW_NAME = "INW";

export default function AzeroStakingAdmin() {
  return (
    <>
      <ContractBalanceSection />
      <RewardsBalanceSection />
      <WithdrawalRequestListSection />
      <ValidatorRewardsSection />
    </>
  );
}

function ContractBalanceSection() {
  const [loading, setLoading] = useState(true);

  const [info, setInfo] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async (isMounted) => {
      try {
        setLoading(true);

        const azeroStakingContract = await getAzeroStakingContract();

        const azeroBalanceOfStakingContract =
          await getAzeroBalanceOfStakingContract();
        const totalAzeroStaked = await getTotalAzeroStaked();
        const azeroStakeBalance = await getAzeroStakeBalance();

        // console.log("interest::getAzeroStakingContract",azeroStakingContract);
        // console.log("Staking::getAzeroBalance",azeroBalanceOfStakingContract);
        // console.log("Staking::getTotalAzeroStaked", totalAzeroStaked);
        // console.log("Staking::getAzeroStakeAccount", azeroStakeBalance);

        Promise.all([
          azeroStakingContract,
          azeroBalanceOfStakingContract,
          azeroStakeBalance,
          totalAzeroStaked,
        ]).then(
          ([
            azeroStakingContract,
            azeroBalanceOfStakingContract,
            azeroStakeBalance,
            totalAzeroStaked,
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
                value: azeroBalanceOfStakingContract,
                valueFormatted: `${formatNumDynDecimal(
                  azeroBalanceOfStakingContract
                )} AZERO`,
                hasTooltip: true,
                tooltipContent: "azeroBalanceOfStakingContract",
              },
              {
                title: "Azero Stake Balance",
                value: azeroStakeBalance,
                valueFormatted: `${formatNumDynDecimal(
                  azeroStakeBalance
                )} AZERO`,
                hasTooltip: true,
                tooltipContent: "azeroStakeBalance",
              },
              {
                title: "Total Azero Staked",
                value: totalAzeroStaked,
                valueFormatted: `${formatNumDynDecimal(
                  totalAzeroStaked
                )} AZERO`,
                hasTooltip: true,
                tooltipContent: "totalAzeroStaked",
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
    };

    fetchData(isMounted);

    return () => (isMounted = false);
  }, []);

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
            <SimpleGrid columns={[1, 1, 2]}>
              <Text mr="4px">{title}: </Text>
              <Text mb={["12px", "12px", "2px"]}>{valueFormatted} </Text>
            </SimpleGrid>
          ))
        )}
      </Box>
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
        console.log("interest::getInwContract", inwContract);

        const inwContractBalanceINW = await getInwBalanceOfAddress({
          address: inwContract,
        });
        console.log("InwContract psp22::balanceOf INW", inwContractBalanceINW);

        const inwContractBalanceAZERO = await getAzeroBalanceOfAddress({
          address: inwContract,
        });
        console.log("InwContractBalanceAZERO", inwContractBalanceAZERO);

        const inkContractInfoData = [
          {
            title: "INW Contract",
            value: inwContract,
            valueFormatted: <AddressCopier address={inwContract} />,
            hasTooltip: true,
            tooltipContent: "inwContract",
          },
          {
            title: "INW Balance",
            value: inwContractBalanceINW,
            valueFormatted: `${formatNumDynDecimal(inwContractBalanceINW)} INW`,
            hasTooltip: true,
            tooltipContent: "inwContractBalanceINW",
          },
          {
            title: "AZERO Balance",
            value: inwContractBalanceAZERO,
            valueFormatted: `${formatNumDynDecimal(
              inwContractBalanceAZERO
            )} AZERO`,
            hasTooltip: true,
            tooltipContent: "inwContractBalanceAZERO",
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
        console.log("interest::getMasterAccount", masterAccount);

        const masterAccountBalanceINW = await getInwBalanceOfAddress({
          address: masterAccount,
        });
        console.log(
          "MasterAccount psp22::balanceOf INW",
          masterAccountBalanceINW
        );
        const masterAccountBalanceAZERO = await getAzeroBalanceOfAddress({
          address: masterAccount,
        });
        console.log("MasterAccountBalanceAZERO", masterAccountBalanceAZERO);

        const masterAccountInfoData = [
          {
            title: "Master Account Address",
            value: masterAccount,
            valueFormatted: <AddressCopier address={masterAccount} />,
            hasTooltip: true,
            tooltipContent: "masterAccount",
          },
          {
            title: "INW Balance",
            value: masterAccountBalanceINW,
            valueFormatted: `${formatNumDynDecimal(
              masterAccountBalanceINW
            )} INW`,
            hasTooltip: true,
            tooltipContent: "masterAccountBalanceINW",
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
        console.log(
          "Staking::getInterestDistributionContract",
          interestDistributionContract
        );
        const interestDistributionContractBalance =
          await getInwBalanceOfAddress({
            address: interestDistributionContract,
          });
        console.log(
          "InterestDistributionContract psp22::balanceOf INW",
          interestDistributionContractBalance
        );
        const interestDistributionContractBalanceAZERO =
          await getAzeroBalanceOfAddress({
            address: interestDistributionContract,
          });
        console.log(
          "InterestDistributionContractBalanceAZERO",
          interestDistributionContractBalanceAZERO
        );

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
              <SimpleGrid columns={[1, 1, 2]}>
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
                <SimpleGrid columns={[1, 1, 2]}>
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
                <SimpleGrid columns={[1, 1, 2]}>
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
                <SimpleGrid columns={[1, 1, 2]}>
                  <Text mr="4px">Total Pending </Text>
                  <Text mb={["12px", "12px", "2px"]}>{totalPending} AZERO</Text>
                </SimpleGrid>

                <SimpleGrid columns={[1, 1, 2]}>
                  <Text mr="4px">Total Ready </Text>
                  <Text mb={["12px", "12px", "2px"]}>{totalReady} AZERO</Text>
                </SimpleGrid>

                <SimpleGrid columns={[1, 1, 2]}>
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
