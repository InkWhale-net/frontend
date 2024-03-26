import { Heading, Stack, Box,
  Button,
  Flex,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text, } from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import { ContractPromise } from "@polkadot/api-contract";
import IWCard from "components/card/Card";
import IWCardOneColumn from "components/card/CardOneColumn";
import IWInput from "components/input/Input";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { delay, formatChainStringToNumber, formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
  formatTokenAmount, } from "utils";
import { execContractTx } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import MyAccountTab from "./myAccount";
import { appChain } from "constants";
import { FaChevronDown } from "react-icons/fa";
import swap_inw2_contract from "utils/contracts/swap_inw2_contract";
import { getGasLimit, getSwapGasLimit } from "utils/contracts/dryRun";
import { useMutation } from "react-query";
import { execContractQuery } from "utils/contracts";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import { useAppContext } from "contexts/AppContext";
const supportedToken = [
  {
    token: "inw",
    name: "INW",
  },
  {
    token: "inw2",
    name: "INW V2",
  },
];

const TokensTabSwapToken = ({
  mode,
  address,
  balance,
  tokenInfo,
  selectedContractAddr,
  loadTokenInfo,
  ...rest
}) => {
  const { api } = useAppContext();
  const { currentAccount } = useSelector((s) => s.wallet);
  const dispatch = useDispatch();

  const [amount, setAmount] = useState("");
  const [amountV2, setAmountV2] = useState("");
  const [fromToken, setFromToken] = useState(supportedToken[0]);
  const [toToken, setToToken] = useState(supportedToken[1]);
  const [gas, setGas] = useState(0);

  const [_isOpen, setIsOpen] = useState(false);

  const inwBalance = +currentAccount?.balance?.inw?.replaceAll(",", "");
  const inw2Balance = +currentAccount?.balance?.inw2?.replaceAll(",", "");

  const [step, setStep] = useState(1);
  const { isLoading, mutate } = useMutation(async () => {
    return new Promise((resolve) => {
      if (fromToken.token == "inw") {
        resolve(swapToTokenv2());
      } else {
        resolve(swapToTokenv1());
      }
    });
  }, "swap-to-inw-v2");

  const updateMaxAmount = () => {
    const _value = fromToken.token == "inw" ? inwBalance : inw2Balance;
    setAmount(_value);
    fetchGas(_value);
  };
  const getBalance = (token) =>
    formatNumDynDecimal(currentAccount?.balance?.[token]?.replaceAll(",", ""));

  const fetchGas = async (_amount) => {
    try {
      if (+_amount == 0) {
        setGas(0);
        return;
      }
      console.log('swap_inw2_contract.CONTRACT_ADDRESS', swap_inw2_contract.CONTRACT_ADDRESS);
      const contract = new ContractPromise(
        api,
        swap_inw2_contract.CONTRACT_ABI,
        swap_inw2_contract.CONTRACT_ADDRESS
      );
      let gasLimitResultSwap;
      if (fromToken.token == "inw") {
        gasLimitResultSwap = await getGasLimit(
          api,
          currentAccount?.address,
          "inwSwapTrait::swap",
          contract,
          { value: 0 },
          [formatNumToBN(_amount)],
          1.05
        );
      } else {
        gasLimitResultSwap = await getGasLimit(
          api,
          currentAccount?.address,
          "inwSwapTrait::swapInwV2ToV1",
          contract,
          { value: 0 },
          [formatNumToBN(_amount)],
          1.05
        );
      }

      if (!gasLimitResultSwap.ok) {
        console.log(gasLimitResultSwap.error);
        return;
      }
      const gasLimit = JSON.parse(gasLimitResultSwap?.value);
      const gasLimitValue = formatNumDynDecimal(
        formatTokenAmount(gasLimit?.refTime, 12)
      );
      setGas(gasLimitValue);
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeValue = (newValue) => {
    try {
      if (fromToken.token == "inw") {
        const valueToUpdate = +newValue > inwBalance ? inwBalance : +newValue;
        setAmount(valueToUpdate);
        fetchGas(valueToUpdate);
      } else {
        const valueToUpdate = +newValue > inw2Balance ? inw2Balance : +newValue;
        setAmount(valueToUpdate);
        fetchGas(valueToUpdate);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==================================
  const [gasSwapToV2, setGasSwapToV2] = useState(0);
  const [gasApproveToV2, setGasApproveToV2] = useState(0);

  const [gasSwapToV1, setGasSwapToV1] = useState(0);
  const [gasApproveToV1, setGasApproveToV1] = useState(0);
  const swapToTokenv2 = async () => {
    setStep(2);
  };
  const swapToTokenv1 = async () => {
    setStep(2);
  };

  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <MyAccountTab address={address} balance={balance} tokenInfo={tokenInfo} />

      <IWCard
        w="full"
        variant="outline"
        title={`Swap ${tokenInfo?.title} Tokens`}
      >
        <IWCard mt="16px" w="full" variant="solid">
        <Flex justify="center">
          <Box minW={!isMobile && "600px"} maxW="600px" px="12px">
            <Flex justify="space-between" mt="4px">
              <Menu>
                <MenuButton>
                  <Flex align="center">
                    {fromToken.name}{" "}
                    <FaChevronDown size="14px" style={{ marginLeft: "4px" }} />
                  </Flex>
                </MenuButton>
                <MenuList>
                  {supportedToken.map((e, index) => (
                    <MenuItem
                      key={`token-${index}`}
                      onClick={() => {
                        switch (e.token) {
                          case "inw":
                            setFromToken(supportedToken[0]);
                            setToToken(supportedToken[1]);
                            break;
                          case "inw2":
                            setFromToken(supportedToken[1]);
                            setToToken(supportedToken[0]);
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      {e.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              <Flex>
                Balance:{" "}
                <p className="balance-value">{getBalance(fromToken.token)}</p>
              </Flex>
            </Flex>
            <Flex direction="column" className="swap-amount-container">
              <Box className="max-amount-button" onClick={() => updateMaxAmount()}>
                max
              </Box>
              <Input
                value={amount}
                onChange={({ target }) => onChangeValue(target.value)}
                type="number"
                placeholder="0.0"
                className="swap-amount-input"
              />
            </Flex>
            <Flex justify="center" py="12px">
              <Flex
                onClick={() => {
                  switch (fromToken.token) {
                    case "inw":
                      setFromToken(supportedToken[1]);
                      setToToken(supportedToken[0]);
                      break;
                    case "inw2":
                      setFromToken(supportedToken[0]);
                      setToToken(supportedToken[1]);
                      break;
                    default:
                      break;
                  }
                }}
                className="change-swap-option-button"
              >
                <FaChevronDown />
              </Flex>
            </Flex>
            <Flex justify="space-between">
              <Menu>
                <MenuButton>
                  <Flex align="center">
                    {toToken.name}
                    <FaChevronDown size="14px" style={{ marginLeft: "4px" }} />
                  </Flex>
                </MenuButton>
                <MenuList>
                  {supportedToken.map((e, index) => (
                    <MenuItem
                      key={`token-${index}`}
                      onClick={() => {
                        switch (e.token) {
                          case "inw":
                            setToToken(supportedToken[0]);
                            setFromToken(supportedToken[1]);
                            break;
                          case "inw2":
                            setToToken(supportedToken[1]);
                            setFromToken(supportedToken[0]);
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      {e.name}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>{" "}
              <Flex>
                Balance:{" "}
                <p className="balance-value">{getBalance(toToken.token)}</p>
              </Flex>
            </Flex>
            <Flex direction="column" className="swap-amount-container">
              <Input
                value={amount}
                onChange={({ target }) => onChangeValue(target.value)}
                type="number"
                placeholder="0.0"
                className="swap-amount-input"
              />
            </Flex>

            <Flex justify="end" fontSize="16px">
              {fromToken.name === "INW" ? (
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
              ) : (
                <Stack>
                  {step === 1 ? (
                    <Text mr="4px">
                      Step 1: Approve Estimated Gas: {gasApproveToV1.toFixed(8)}{" "}
                      {appChain?.unit}
                    </Text>
                  ) : null}
                  {step === 2 ? (
                    <Text mr="4px">
                      Step 2: Swap Estimated Gas: {gasSwapToV1.toFixed(8)}{" "}
                      {appChain?.unit}
                    </Text>
                  ) : null}
                </Stack>
              )}
            </Flex>
            <Button
              isLoading={isLoading}
              mt="4px"
              size="md"
              width="full"
              onClick={() => mutate()}
            >
              SWAP NOW
            </Button>
          </Box>
        </Flex>
        </IWCard>
      </IWCard>
    </Stack>
  );
};

export default TokensTabSwapToken;
