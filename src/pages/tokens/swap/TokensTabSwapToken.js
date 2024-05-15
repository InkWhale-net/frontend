import { Stack, Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { ContractPromise } from "@polkadot/api-contract";
import IWCard from "components/card/Card";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  delay,
  formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
} from "utils";
import { execContractTx } from "./utils.js";

import MyAccountTab from "./myAccount";
import { appChain } from "constants";
import { FaChevronDown } from "react-icons/fa";
import swap_inw2_contract from "utils/contracts/swap_inw2_contract";
import { useMutation } from "react-query";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import { useAppContext } from "contexts/AppContext";
import { formatTextAmount } from "utils/index.js";
import { getSwapGasLimit } from "utils/contracts/dryRun.js";

const TokensTabSwapToken = ({
  address,
  balance,
  tokenInfo,
  tokenV2Info,
  supportedToken,
  swapTokenContractAddress,
}) => {
  const { api } = useAppContext();
  const { currentAccount } = useSelector((s) => s.wallet);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");

  const [step, setStep] = useState(1);
  const { isLoading, mutate } = useMutation(async () => {
    return new Promise((resolve) => {
      resolve(swapToTokenv2());
    });
  }, "swap-to-inw-v2");

  const updateMaxAmount = () => {
    const _value = tokenInfo?.balance;
    setAmount(_value);
  };

  const onChangeValue = (newValue) => {
    try {
      const valueToUpdate =
        +newValue > +tokenInfo?.balance ? +tokenInfo?.balance : +newValue;

      setAmount(valueToUpdate);
    } catch (error) {
      console.log(error);
    }
  };

  // ==================================
  const [gasSwapToV2, setGasSwapToV2] = useState(0);
  const [gasApproveToV2, setGasApproveToV2] = useState(0);

  const swapToTokenv2 = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet!");
      }
      if (!(+amount > 0)) {
        toast.error("Please enter valid amount!");
        return;
      }

      if (+tokenInfo?.balance < +amount) {
        toast.error(
          `Maximum swap amount is ${formatNumDynDecimal(tokenInfo?.balance)}`
        );
        return;
      }
      toast("Step1: Approve...");
      const allowanceTokenQr = await execContractQuery(
        currentAccount?.address,
        api,
        psp22_contract.CONTRACT_ABI,
        supportedToken[0]?.contractAddress,
        0, //-> value
        "psp22::allowance",
        currentAccount?.address,
        swapTokenContractAddress
      );
      const allowanceINW = formatQueryResultToNumber(
        allowanceTokenQr
      ).replaceAll(",", "");

      console.log("allowanceINW", allowanceINW);

      if (+allowanceINW < +amount) {
        setStep(1);
        let approve = await execContractTx(
          currentAccount,
          api,
          psp22_contract.CONTRACT_ABI,
          supportedToken[0]?.contractAddress,
          0, //-> value
          "psp22::approve",
          2,
          swapTokenContractAddress,
          formatNumToBN(amount)
        );
        if (!approve) return;
      }

      await delay(2000).then(async () => {
        setStep(2);

        toast("Step2: Swap...");
        await execContractTx(
          currentAccount,
          api,
          swap_inw2_contract.CONTRACT_ABI,
          swapTokenContractAddress,
          0,
          "inwSwapTrait::swap",
          2,
          formatNumToBN(amount)
        );
      });

      await delay(1500).then(() => {
        setStep(1);

        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
        }
        setAmount("");
      });
    } catch (error) {
      setStep(1);

      console.log(error);
    }
  };

  useEffect(() => {
    // to v2
    const fetchDataGasApproveToV2 = async () => {
      const contract = new ContractPromise(
        api,
        psp22_contract.CONTRACT_ABI,
        supportedToken[0]?.contractAddress
      );

      const gasLimitResult = await getSwapGasLimit(
        api,
        currentAccount?.address,
        "psp22::approve",
        contract,
        { value: 0 },
        [swapTokenContractAddress, formatNumToBN(amount)]
      );

      console.log("Gas Approve To V2", gasLimitResult * 1.688);
      setGasApproveToV2(gasLimitResult * 1.688);
    };

    api && fetchDataGasApproveToV2();

    const fetchDataGasSwapToV2 = async () => {
      const contract = new ContractPromise(
        api,
        swap_inw2_contract.CONTRACT_ABI,
        swapTokenContractAddress
      );

      const gasLimitResult = await getSwapGasLimit(
        api,
        currentAccount?.address,
        "inwSwapTrait::swap",
        contract,
        { value: 0 },
        [formatNumToBN(amount)]
      );
      console.log("Gas Swap To V2", gasLimitResult * 1.05);
      setGasSwapToV2(gasLimitResult * 1.05);
    };

    api && fetchDataGasSwapToV2();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, api, currentAccount?.address, amount, step]);

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <MyAccountTab
        address={address}
        balance={balance}
        tokenInfo={tokenInfo}
        tokenV2Info={tokenV2Info}
      />

      <IWCard
        w="full"
        variant="outline"
        title={`Swap ${tokenInfo?.title} Tokens`}
      >
        <Box justify="center">
          <IWCard mt="16px" w="full" variant="solid">
            <Flex justify="space-between" mt="4px">
              <Flex>
                Balance:{" "}
                {tokenInfo?.balance && (
                  <Text className="balance-value">
                    {formatNumDynDecimal(formatTextAmount(tokenInfo?.balance))}{" "}
                    {tokenInfo?.title} (old)
                  </Text>
                )}
              </Flex>
              <Button size="sm" onClick={() => updateMaxAmount()}>
                max
              </Button>
            </Flex>
            <Flex direction="column" className="swap-amount-container">
              <Input
                textAlign="right"
                value={amount}
                onKeyDown={(e) => {
                  if (e.key === "e" || e.key === "-") {
                    e.preventDefault();
                  }
                }}
                onChange={({ target }) => {
                  onChangeValue(target.value);
                }}
                type="number"
                placeholder="0"
                // className="swap-amount-input"
              />
            </Flex>
          </IWCard>

          <Flex justify="center" py="12px">
            <Flex className="change-swap-option-button">
              <FaChevronDown />
            </Flex>
          </Flex>

          <IWCard mt="4px" w="full" variant="solid">
            <Flex justify="space-between" mt="4px">
              <Flex>
                Balance:
                {tokenInfo?.balance && (
                  <Text className="balance-value">
                    {formatNumDynDecimal(
                      formatTextAmount(tokenV2Info?.balance)
                    )}{" "}
                    {tokenInfo?.title}
                  </Text>
                )}
              </Flex>
            </Flex>
            <Flex
              direction="column"
              // className="swap-amount-container"
            >
              <Input
                textAlign="right"
                value={amount}
                onChange={({ target }) => onChangeValue(target.value)}
                type="number"
                placeholder="0"
                // className="swap-amount-input"
              />
            </Flex>
          </IWCard>

          <Flex justify="end" fontSize="16px">
            <Stack>
              {step === 1 ? (
                <Text mr="4px">
                  Step 1: Approve Estimated Gas: {gasApproveToV2.toFixed(8)}{" "}
                  {appChain?.unit}
                </Text>
              ) : null}
              {step === 2 ? (
                <Text mr="4px">
                  Step 2: Swap Estimated Gas: {gasSwapToV2.toFixed(8)}{" "}
                  {appChain?.unit}
                </Text>
              ) : null}
            </Stack>
          </Flex>
          <Button
            isDisabled={!amount}
            isLoading={isLoading}
            mt="16px"
            size="md"
            width="full"
            onClick={() => mutate()}
          >
            Swap Now
          </Button>
        </Box>
      </IWCard>
    </Stack>
  );
};

export default TokensTabSwapToken;
