import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ContractPromise } from "@polkadot/api-contract";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { useSwapV2TokenContext } from "contexts/SwapV2TokenModalContext";
import { useEffect, useRef, useState } from "react";
import { isMobile } from "react-device-detect";
import toast from "react-hot-toast";
import { FaChevronDown } from "react-icons/fa";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import {
  delay,
  formatNumDynDecimal,
  formatNumToBN,
  formatQueryResultToNumber,
  formatTokenAmount,
} from "utils";
import { execContractQuery } from "utils/contracts";
import { getGasLimit, getSwapGasLimit } from "utils/contracts/dryRun";
import psp22_contract from "utils/contracts/psp22_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import swap_inw2_contract from "utils/contracts/swap_inw2_contract";
import "./styles.css";

import { execContractTx } from "./utils";
import { supportedChain } from "constants";
import azero_manager_bridge from "utils/contracts/azero_manager_bridge";
import { formatNumToBNEther } from "utils";
import { APICall } from "api/client";
import { IWTable } from "components/table/IWTable";
import { addressShortener } from "utils";

const BridgeTab = ({ amountRef }) => {
  const supportedChainBridge = supportedChain.filter(
    (e) => e?.bridgeTo?.length > 0
  );
  const [amount, setAmount] = useState("");
  const [amountV2, setAmountV2] = useState("");
  const [fromChain, setFromChain] = useState(supportedChainBridge[0]);
  const [toChain, setToChain] = useState(supportedChainBridge[1]);
  const [gas, setGas] = useState(0);

  const [_isOpen, setIsOpen] = useState(false);
  const { api } = useAppContext();
  const { currentAccount } = useSelector((state) => state.wallet);

  const inwBalance = +currentAccount?.balance?.inw?.replaceAll(",", "");
  const inw2Balance = +currentAccount?.balance?.inw2?.replaceAll(",", "");

  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const [gasSwapToV2, setGasSwapToV2] = useState(0);
  const [gasApproveToV2, setGasApproveToV2] = useState(0);

  const [gasSwapToV1, setGasSwapToV1] = useState(0);
  const [gasApproveToV1, setGasApproveToV1] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const getBalance = (token) =>
    formatNumDynDecimal(currentAccount?.balance?.[token]?.replaceAll(",", ""));
  const fetchTransactions = async () => {
    try {
      const resp = await APICall.getTransactionOfBridge();
      setTransactions(resp || []);
    } catch (error) {
      console.log(error);
    }
  };
  const onChangeValue = (newValue) => {
    console.log('onChangeValue::toChain', toChain);
    console.log('onChangeValue::fromChain', fromChain);
    try {
      
      if (fromChain.key == "alephzero-testnet" && toChain.key == "firechain-testnet") {
        setAmount(newValue);
        setAmountV2(newValue + 1);
      } else if (fromChain.key == "firechain-testnet" && toChain.key == "alephzero-testnet") {
        setAmount(newValue);
        setAmountV2(newValue + 2);
      } else {

      }
      // if (fromToken.token == "inw") {
      //   const valueToUpdate = +newValue > inwBalance ? inwBalance : +newValue;
      //   setAmount(valueToUpdate);
      //   fetchGas(valueToUpdate);
      // } else {
      //   const valueToUpdate = +newValue > inw2Balance ? inw2Balance : +newValue;
      //   setAmount(valueToUpdate);
      //   fetchGas(valueToUpdate);
      // }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTransactions();
  }, [api, currentAccount]);
  const tableData = {
    tableHeader: [
      {
        name: "id",
        hasTooltip: false,
        tooltipContent: "",
        label: "ID",
      },
      {
        name: "bridgestatus",
        hasTooltip: false,
        tooltipContent: "",
        label: "Status",
      },
      {
        name: "account",
        hasTooltip: false,
        tooltipContent: "",
        label: "Trader",
      },
      {
        name: "from",
        hasTooltip: false,
        tooltipContent: "",
        label: "From",
      },
      {
        name: "to",
        hasTooltip: false,
        tooltipContent: "",
        label: "To",
      },
      {
        name: "amount",
        hasTooltip: false,
        tooltipContent: "",
        label: "Amount",
      },
      {
        name: "blockNumber",
        hasTooltip: false,
        tooltipContent: "",
        label: "Block",
      },
    ],

    tableBody: transactions.map((e) => ({
      ...e,
      id: e?.transactionId,
      from: "AlephZero Testnet",
      to: "5ire Testnet",
      amount: formatTokenAmount(e?.amount, 12),
      account: e?.trader,
      bridgestatus: e?.status,
    })),
  };
  return (
    <Flex direction="column" align="center">
      <Box minW={!isMobile && "512px"} maxW="512px" px="12px">
        <Flex className="balance-container">
          <Text>{appChain?.unit} balance</Text>
          <Text className="balance-value">{getBalance("azero")}</Text>
        </Flex>
        <Flex className="balance-container">
          <Text>{appChain?.inwName} balance</Text>
          <Text className="balance-value">{getBalance("inw2")}</Text>
        </Flex>

        <Flex justify="space-between" mt="4px">
          <Menu>
            <MenuButton>
              <Flex align="center">
                <Image
                  className="chain-icon"
                  src={fromChain?.icon}
                  alt={`${fromChain.name} logo`}
                />
                {fromChain.name}{" "}
                <FaChevronDown size="14px" style={{ marginLeft: "4px" }} />
              </Flex>
            </MenuButton>
            <MenuList>
              {console.log(supportedChainBridge)}
              {supportedChainBridge.map((e, index) => (
                <MenuItem
                  key={`token-${e.key}`}
                  onClick={() => {
                    console.log('e1', e);
                    switch (e.key) {
                      case "alephzero-testnet":
                        setToChain(supportedChainBridge[1]);
                        setFromChain(supportedChainBridge[0]);
                        break;
                      case "firechain-testnet":
                        setToChain(supportedChainBridge[0]);
                        setFromChain(supportedChainBridge[1]);
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <Image
                    className="chain-icon"
                    src={e?.icon}
                    alt={`${e.name} logo`}
                  />
                  {e.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Flex>
            Balance:{" "}
            <p className="balance-value">{getBalance(fromChain.token)}</p>
          </Flex>
        </Flex>
        <Flex direction="column" className="swap-amount-container">
          <Box className="max-amount-button">
            max
          </Box>
          <Input
            value={amount}
            onChange={({ target }) => onChangeValue(target.value)}
            type="number"
            placeholder="0.0"
            className="swap-amount-input"
            ref={amountRef}
          />
        </Flex>
        <Flex justify="center" py="12px">
          <Flex
            onClick={() => {
              switch (fromChain.key) {
                case "alephzero-testnet":
                  setFromChain(supportedChainBridge[0]);
                  setToChain(supportedChainBridge[1]);
                  break;
                case "firechain-testnet":
                  setFromChain(supportedChainBridge[1]);
                  setToChain(supportedChainBridge[0]);
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
                <Image
                  className="chain-icon"
                  src={toChain?.icon}
                  alt={`${toChain.name} logo`}
                />
                {toChain.name}
                <FaChevronDown size="14px" style={{ marginLeft: "4px" }} />
              </Flex>
            </MenuButton>
            <MenuList>
              {supportedChainBridge.map((e, index) => (
                <MenuItem
                  key={`token-${e.key}`}
                  onClick={() => {
                    console.log('e2', e);
                    switch (e.key) {
                      case "alephzero-testnet":
                        setToChain(supportedChainBridge[1]);
                        setFromChain(supportedChainBridge[0]);
                        break;
                      case "firechain-testnet":
                        setToChain(supportedChainBridge[0]);
                        setFromChain(supportedChainBridge[1]);
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  <Image
                    className="chain-icon"
                    src={e?.icon}
                    alt={`${e.name} logo`}
                  />
                  {e.name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>{" "}
          <Flex>
            Balance:{" "}
            {/* <p className="balance-value">{getBalance(toChain.token)}</p> */}
          </Flex>
        </Flex>
        <Flex direction="column" className="swap-amount-container">
          <Input
            value={amountV2}
            onChange={({ target }) => onChangeValue(target.value)}
            type="number"
            placeholder="0.0"
            className="swap-amount-input"
            ref={amountRef}
          />
        </Flex>

        <Flex justify="end" fontSize="16px">
          {fromChain.name === "INW" ? (
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
          mt="4px"
          size="md"
          width="full"
        >
          Bridge
        </Button>
      </Box>
      <Box mt="24px">
        <Text my="16px" fontWeight={700} fontSize={24} color="#57527e">
          Transactions
        </Text>
        <IWTable {...tableData} />
      </Box>
    </Flex>
  );
};
export default BridgeTab;