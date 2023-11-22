import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { getWithdrawableInw } from "api/azero-staking/azero-staking";
import { getApy } from "api/azero-staking/azero-staking";
import { getInwMultiplier } from "api/azero-staking/azero-staking";
import { getPayableAzero } from "api/azero-staking/azero-staking";
import { getInwBalanceOfAddress } from "api/azero-staking/azero-staking";
import { doUpdateInwMultiplier } from "api/azero-staking/azero-staking";
import { getIsLocked } from "api/azero-staking/azero-staking";
import { doUpdateAzeroApy } from "api/azero-staking/azero-staking";
import { getMaxWaitingTime } from "api/azero-staking/azero-staking";
import { APICall } from "api/client";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCard from "components/card/Card";
import { useAppContext } from "contexts/AppContext";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { formatNumDynDecimal } from "utils";
import { formatChainStringToNumber } from "utils";
import { delay } from "utils";
import { getAzeroBalanceOfAddress } from "utils/contracts";
import { execContractQuery } from "utils/contracts";

import my_azero_staking from "utils/contracts/my_azero_staking";
const INW_NAME = "INW";

export default function AzeroStakingAdmin() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { api } = useAppContext();

  const [contractInfo, setContractInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          status,
          message,
          ret: expirationDuration,
        } = await APICall.getExpirationTime({});

        if (status !== "OK") {
          return toast.error(message);
        }

        const [maxWaitingTime, waitingListInfo, payableAzero, withdrawableInw] =
          await Promise.all([
            getMaxWaitingTime(),
            APICall.getWaitingListInfo({ expirationDuration }),
            getPayableAzero(),
            getWithdrawableInw(),
          ]);

        setContractInfo({
          contractAddress: {
            title: "Contract address",
            valueFormat: (
              <AddressCopier address={my_azero_staking.CONTRACT_ADDRESS} />
            ),
          },
          maxWaitingTime: {
            title: "Withdrawal Waiting Time",
            value: maxWaitingTime,
            valueFormat: `${maxWaitingTime / 60000} mins`,
          },
          expirationTime: {
            title: "Expiration Time",
            value: expirationDuration,
            valueFormat: `${expirationDuration / 60000} mins`,
          },
          contractTotalAzero: {
            title: "Total AZERO for pending list within expiration time",
            value: (
              formatChainStringToNumber(waitingListInfo?.totalAzero) /
              Math.pow(10, 12)
            ).toFixed(4),
            valueFormat: `${(
              formatChainStringToNumber(waitingListInfo?.totalAzero) /
              Math.pow(10, 12)
            ).toFixed(4)} AZERO`,
          },
          payableAzero: {
            title: "Contract Payable Azero Amount",
            value: payableAzero,
            valueFormat: `${payableAzero} AZERO`,
          },
          contractTotalInw: {
            title: `Total ${INW_NAME} for pending list within expiration time`,
            value: (
              formatChainStringToNumber(waitingListInfo?.totalInw) /
              Math.pow(10, 12)
            ).toFixed(4),
            valueFormat: `${(
              formatChainStringToNumber(waitingListInfo?.totalInw) /
              Math.pow(10, 12)
            ).toFixed(4)} ${INW_NAME}`,
          },
          withdrawableInw: {
            title: `Contract Payable ${INW_NAME} Amount`,
            value: withdrawableInw,
            valueFormat: `${withdrawableInw} ${INW_NAME}`,
          },
        });
      } catch (error) {
        console.error("Error Fetching Contract Info:", error);
        toast.error("Error Fetching Contract Info:", error);
      }
    };

    fetchData();
  }, []);

  const [walletInfo, setWalletInfo] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          status: azeroStatus,
          message: azeroMessage,
          ret: azeroWalletAddress,
        } = await APICall.getAzeroWallet({});

        const {
          status: inwStatus,
          message: inwMessage,
          ret: inwWalletAddress,
        } = await APICall.getInwWallet({});

        if (azeroStatus !== "OK" || inwStatus !== "OK") {
          return toast.error(inwMessage || azeroMessage);
        }

        const [
          inwWalletInwBalance,
          inwWalletAzeroBalance,
          azeroWalletAzeroBalance,
        ] = await Promise.all([
          getInwBalanceOfAddress({ address: inwWalletAddress }),
          getAzeroBalanceOfAddress({ address: inwWalletAddress }),
          getAzeroBalanceOfAddress({ address: azeroWalletAddress }),
        ]);

        setWalletInfo({
          azeroWalletAddress: {
            title: "AZERO Wallet Address",
            valueFormat: <AddressCopier address={azeroWalletAddress} />,
          },
          azeroWalletAzeroBalance: {
            title: "AZERO Wallet Balance",
            value: azeroWalletAzeroBalance,
            valueFormat: `${formatNumDynDecimal(
              azeroWalletAzeroBalance
            )} AZERO`,
          },
          inwWalletAddress: {
            title: `${INW_NAME} Wallet Address`,
            valueFormat: <AddressCopier address={inwWalletAddress} />,
          },
          inwWalletInwBalance: {
            title: `${INW_NAME} Wallet: ${INW_NAME} Balance`,
            value: inwWalletInwBalance,
            valueFormat: `${formatNumDynDecimal(
              inwWalletInwBalance
            )} ${INW_NAME}`,
          },
          inwWalletAzeroBalance: {
            title: `${INW_NAME} Wallet: AZERO Balance`,
            value: inwWalletAzeroBalance,
            valueFormat: `${formatNumDynDecimal(inwWalletAzeroBalance)} AZERO`,
          },
        });
      } catch (error) {
        console.error("Error Fetching Wallet Info:", error);
        toast.error("Error Fetching Wallet Info:", error);
      }
    };

    fetchData();
  }, []);

  const insufficientAzeroAmount = useMemo(
    () =>
      parseInt(walletInfo?.azeroWalletAzeroBalance?.value) +
      parseInt(formatChainStringToNumber(contractInfo?.payableAzero?.value)) -
      parseInt(contractInfo?.contractTotalAzero?.value),
    [
      contractInfo?.contractTotalAzero?.value,
      contractInfo?.payableAzero?.value,
      walletInfo?.azeroWalletAzeroBalance?.value,
    ]
  );

  const insufficientInwAmount = useMemo(
    () =>
      parseInt(walletInfo?.inwWalletAzeroBalance?.value) +
      parseInt(
        formatChainStringToNumber(contractInfo?.withdrawableInw?.value)
      ) -
      parseInt(contractInfo?.contractTotalInw?.value),
    [
      contractInfo?.contractTotalInw?.value,
      contractInfo?.withdrawableInw?.value,
      walletInfo?.inwWalletAzeroBalance?.value,
    ]
  );

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
  const [hasAdminRole, setHasAdminRole] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const isLocked = await getIsLocked();
      setIsLocked(isLocked);

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

    await doUpdateAzeroApy(api, currentAccount, newApy * 100);

    delay(1000).then(() => {
      fetchApyAndMultiplier();
      setNewApy("");
    });
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

  return (
    <>
      <Heading as="h4" size="h4" mb="5" fontWeight="600" lineHeight="25px">
        You are {hasAdminRole ? "" : "Not"} owner
      </Heading>
      <IWCard mb="24px" w="full" variant="outline" title={`Contract Info`}>
        {Object.entries(contractInfo)?.map(([k, v]) => (
          <Flex flexDirection={["column", "column", "row"]} key={k} my="8px">
            <Text mr="4px">{v?.title}: </Text> {v?.valueFormat}
          </Flex>
        ))}
      </IWCard>

      <IWCard mb="24px" w="full" variant="outline" title={`Wallet Info`}>
        {Object.entries(walletInfo)?.map(([k, v]) => (
          <Flex flexDirection={["column", "column", "row"]} key={k} my="8px">
            <Text mr="4px">{v?.title}:</Text> {v?.valueFormat}
          </Flex>
        ))}
      </IWCard>

      <IWCard mb="24px" w="full" variant="outline" title={`Topup Request`}>
        <Flex my="8px" flexDirection={["column", "column", "row"]}>
          <Text mr="4px">
            {insufficientAzeroAmount > 0 ? "Excessive" : "Insufficient"} AZERO
            Amount:
          </Text>{" "}
          {formatNumDynDecimal(insufficientAzeroAmount)} AZERO
        </Flex>
        <Flex my="8px" flexDirection={["column", "column", "row"]}>
          <Text mr="4px">
            {`${insufficientInwAmount > 0 ? "Excessive" : "Insufficient"}
            ${INW_NAME}
            Amount:`}
          </Text>
          {formatNumDynDecimal(insufficientInwAmount)} {INW_NAME}
        </Flex>

        {insufficientAzeroAmount < 0 || insufficientInwAmount < 0 ? (
          <Alert status="warning">
            <Stack>
              <Flex alignItems="center">
                <AlertIcon />
                <Text>Note:</Text>
              </Flex>

              <Flex>
                Please kindly topup to staking contract: <br />
              </Flex>

              <Stack>
                {insufficientAzeroAmount < 0 ? (
                  <Flex flexDirection={["column", "column", "row"]}>
                    <Text mr="4px">Insufficient AZERO Amount: </Text>
                    {formatNumDynDecimal(insufficientAzeroAmount)} AZERO
                  </Flex>
                ) : null}

                {insufficientInwAmount < 0 ? (
                  <Flex flexDirection={["column", "column", "row"]}>
                    <Text mr="4px">Insufficient {INW_NAME} Amount: </Text>
                    {formatNumDynDecimal(insufficientInwAmount)} {INW_NAME}
                  </Flex>
                ) : null}
              </Stack>
            </Stack>
          </Alert>
        ) : null}
      </IWCard>

      <Stack
        w="full"
        mt="24px"
        spacing="24px"
        alignItems="start"
        direction={{ base: "column", lg: "row" }}
      >
        {/* apy */}
        <IWCard
          w="full"
          variant="outline"
          title={
            <Flex>
              <Text as="span">AZERO APY</Text>
              <Spacer />
              <Text as="span">{apy || 0} %/year</Text>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Flex flexDirection={["column-reverse", "column-reverse", "row"]}>
              <Button
                mx={["0px", "0px", "16px"]}
                w={["full", "full", "40%"]}
                mt={["16px", "16px", "0px"]}
                isDisabled={!newApy || !hasAdminRole}
                onClick={handleUpdateAzeroApy}
              >
                Update APY
              </Button>

              <InputGroup w={["full", "full", "60%"]}>
                <InputRightElement
                  right={["10px", "10px", "30px"]}
                  justifyContent="end"
                  children={"%/year"}
                />
                <Input
                  isDisabled={!hasAdminRole}
                  type="number"
                  pr="80px"
                  placeholder="0"
                  textAlign="right"
                  mx={["0px", "0px", "16px"]}
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
            <Flex>
              <Text as="span">INW Multiplier</Text>
              <Spacer />
              <Text as="span">{inwMultiplier || 0} INW/day</Text>
            </Flex>
          }
        >
          <IWCard mt="16px" w="full" variant="solid">
            <Flex flexDirection={["column-reverse", "column-reverse", "row"]}>
              <Button
                mx={["0px", "0px", "16px"]}
                w={["full", "full", "40%"]}
                mt={["16px", "16px", "0px"]}
                isDisabled={!newInwMultiplier || !hasAdminRole}
                onClick={handleUpdateInwMultiplier}
              >
                Update Multiplier
              </Button>
              <InputGroup w={["full", "full", "60%"]}>
                <InputRightElement
                  right={["10px", "10px", "30px"]}
                  justifyContent="end"
                  children={"INW/day"}
                />
                <Input
                  isDisabled={!hasAdminRole}
                  type="number"
                  pr="90px"
                  placeholder="0"
                  textAlign="right"
                  mx={["0px", "0px", "16px"]}
                  value={newInwMultiplier}
                  onChange={({ target }) => setNewInwMultiplier(target.value)}
                />
              </InputGroup>
            </Flex>
          </IWCard>
        </IWCard>
      </Stack>
    </>
  );
}
