import {
  Box,
  Button,
  Flex,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
} from "@chakra-ui/react";
import { ContractPromise } from "@polkadot/api-contract";
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
import { getGasLimit } from "utils/contracts/dryRun";
import psp22_contract from "utils/contracts/psp22_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import swap_inw2_contract from "utils/contracts/swap_inw2_contract";
import "./styles.css";
import { execContractTx } from "./utils";
import { getSwapGasLimit } from "utils/contracts/dryRun";

export const INWSwap = () => {
  const amountRef = useRef(null);
  const { modalVisible, closeSwapModal, openSwapModal } =
    useSwapV2TokenContext();
  if (isMobile) return null;
  return (
    <Menu
      isOpen={modalVisible}
      onClose={() => closeSwapModal()}
      onOpen={() => openSwapModal()}
      placement="bottom-end"
    >
      {({ isOpen }) => (
        <>
          <MenuButton
            p="0px"
            _hover={{ bg: "bg.1" }}
            borderRadius="5px"
            ml={{ base: "20px", md: "20px" }}
          >
            <Flex w="full" p="6px 10px" borderRadius="5px">
              <Link color={"text.1"} fontWeight="600" textDecoration="none">
                <Text fontSize="md">Swap</Text>
              </Link>
            </Flex>
          </MenuButton>
          <MenuList>
            <SwapModalContent amountRef={amountRef} isOpen={isOpen} />
          </MenuList>
        </>
      )}
    </Menu>
  );
};

// const swapOption = [
//   {
//     name:
//   },
//   {
//     option: "inw2toinw",
//     label: (
//       <Flex align="center" flex={1}>
//         INW V2 <HiMiniChevronRight size="20px" /> INW
//       </Flex>
//     ),
//     from: "INW V2",
//     to: "INW",
//   },
// ];

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

export const SwapModalContent = ({ isOpen, amountRef }) => {
  const [amount, setAmount] = useState("");
  const [amountV2, setAmountV2] = useState("");
  const [fromToken, setFromToken] = useState(supportedToken[0]);
  const [toToken, setToToken] = useState(supportedToken[1]);
  const [gas, setGas] = useState(0);

  const [_isOpen, setIsOpen] = useState(false);
  const { api } = useAppContext();
  const { currentAccount } = useSelector((state) => state.wallet);

  const inwBalance = +currentAccount?.balance?.inw?.replaceAll(",", "");
  const inw2Balance = +currentAccount?.balance?.inw2?.replaceAll(",", "");

  const [step, setStep] = useState(1);

  const dispatch = useDispatch();
  const swapToTokenv2 = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet!");
      }
      if (!(+amount > 0)) {
        toast.error("Please enter valid amount!");
        return;
      }
      if (+inwBalance < +amount) {
        toast.error(
          `Maximum swap amount is ${formatNumDynDecimal(inwBalance)}`
        );
        return;
      }
      toast("Step1: Approve...");
      const allowanceTokenQr = await execContractQuery(
        currentAccount?.address,
        api,
        psp22_contract.CONTRACT_ABI,
        process.env.REACT_APP_INW_TOKEN_ADDRESS,
        0, //-> value
        "psp22::allowance",
        currentAccount?.address,
        swap_inw2_contract.CONTRACT_ADDRESS
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
          process.env.REACT_APP_INW_TOKEN_ADDRESS,
          0, //-> value
          "psp22::approve",
          2,
          swap_inw2_contract.CONTRACT_ADDRESS,
          formatNumToBN(amount)
        );
        if (!approve) return;
      }

      await delay(1500).then(async () => {
        setStep(2);

        toast("Step2: Swap...");
        await execContractTx(
          currentAccount,
          api,
          swap_inw2_contract.CONTRACT_ABI,
          swap_inw2_contract.CONTRACT_ADDRESS,
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
        setGas(0);
      });
    } catch (error) {
      setStep(1);

      console.log(error);
    }
  };
  const swapToTokenv1 = async () => {
    try {
      if (!currentAccount) {
        return toast.error("Please connect wallet!");
      }
      if (!(+amount > 0)) {
        toast.error("Please enter valid amount!");
        return;
      }
      if (+inw2Balance < +amount) {
        toast.error(
          `Maximum swap amount is ${formatNumDynDecimal(inw2Balance)}`
        );
        return;
      }
      const allowanceTokenQr = await execContractQuery(
        currentAccount?.address,
        api,
        psp22_contract_v2.CONTRACT_ABI,
        psp22_contract_v2.CONTRACT_ADDRESS,
        0, //-> value
        "psp22::allowance",
        currentAccount?.address,
        swap_inw2_contract.CONTRACT_ADDRESS
      );
      const allowanceINW = formatQueryResultToNumber(
        allowanceTokenQr
      ).replaceAll(",", "");

      console.log("allowanceINW", allowanceINW);

      if (+allowanceINW < +amount) {
        toast("Step1: Approve...");

        setStep(1);

        let approve = await execContractTx(
          currentAccount,
          api,
          psp22_contract_v2.CONTRACT_ABI,
          psp22_contract_v2.CONTRACT_ADDRESS,
          0, //-> value
          "psp22::approve",
          2,
          swap_inw2_contract.CONTRACT_ADDRESS,
          formatNumToBN(amount)
        );
        if (!approve) return;
      }

      await delay(1500).then(async () => {
        setStep(2);

        toast("Step2: Swap...");
        await execContractTx(
          currentAccount,
          api,
          swap_inw2_contract.CONTRACT_ABI,
          swap_inw2_contract.CONTRACT_ADDRESS,
          0,
          "inwSwapTrait::swapInwV2ToV1",
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
        setGas(0);
      });
    } catch (error) {
      setStep(1);

      console.log(error);
    }
  };
  const { isLoading, mutate } = useMutation(async () => {
    return new Promise((resolve) => {
      if (fromToken.token == "inw") {
        resolve(swapToTokenv2());
      } else {
        resolve(swapToTokenv1());
      }
    });
  }, "swap-to-inw-v2");

  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen == true) {
      amountRef?.current?.focus();
      setAmount("");
      setGas(0);
    }
  }, [_isOpen, fromToken, toToken]);

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

  useEffect(() => {
    console.log("amount", amount);
    // to v2
    const fetchDataGasApproveToV2 = async () => {
      const contract = new ContractPromise(
        api,
        psp22_contract.CONTRACT_ABI,
        process.env.REACT_APP_INW_TOKEN_ADDRESS
      );

      const gasLimitResult = await getSwapGasLimit(
        api,
        currentAccount?.address,
        "psp22::approve",
        contract,
        { value: 0 },
        [swap_inw2_contract.CONTRACT_ADDRESS, formatNumToBN(amount)]
      );

      console.log("Gas Approve To V2", gasLimitResult * 1.688);
      setGasApproveToV2(gasLimitResult * 1.688);
    };

    fetchDataGasApproveToV2();

    const fetchDataGasSwapToV2 = async () => {
      const contract = new ContractPromise(
        api,
        swap_inw2_contract.CONTRACT_ABI,
        swap_inw2_contract.CONTRACT_ADDRESS
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

    fetchDataGasSwapToV2();

    // to v1
    const fetchDataGasApproveToV1 = async () => {
      const contract = new ContractPromise(
        api,
        psp22_contract_v2.CONTRACT_ABI,
        psp22_contract_v2.CONTRACT_ADDRESS
      );

      const gasLimitResult = await getSwapGasLimit(
        api,
        currentAccount?.address,
        "psp22::approve",
        contract,
        { value: 0 },
        [swap_inw2_contract.CONTRACT_ADDRESS, formatNumToBN(amount)]
      );

      console.log("fetchDataGasApproveToV1", gasLimitResult * 1.688);
      setGasApproveToV1(gasLimitResult * 1.688);
    };

    fetchDataGasApproveToV1();

    const fetchDataGasSwapToV1 = async () => {
      const contract = new ContractPromise(
        api,
        swap_inw2_contract.CONTRACT_ABI,
        swap_inw2_contract.CONTRACT_ADDRESS
      );

      const gasLimitResult = await getSwapGasLimit(
        api,
        currentAccount?.address,
        "inwSwapTrait::swapInwV2ToV1",
        contract,
        { value: 0 },
        [formatNumToBN(amount)]
      );
      console.log("fetchDataGasSwapToV1", gasLimitResult * 1.05);
      setGasSwapToV1(gasLimitResult * 1.05);
    };

    fetchDataGasSwapToV1();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount, api, currentAccount?.address, amount, step]);

  return (
    <Box minW={!isMobile && "400px"} px="12px">
      <Flex className="balance-container">
        <Text>Azero balance</Text>
        <Text className="balance-value">{getBalance("azero")}</Text>
      </Flex>

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
          ref={amountRef}
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
          Balance: <p className="balance-value">{getBalance(toToken.token)}</p>
        </Flex>
      </Flex>
      <Flex direction="column" className="swap-amount-container">
        <Input
          value={amount}
          onChange={({ target }) => onChangeValue(target.value)}
          type="number"
          placeholder="0.0"
          className="swap-amount-input"
          ref={amountRef}
        />
      </Flex>
      {console.log("step", step)}
      <Flex justify="end" fontSize="16px">
        {fromToken.name === "INW" ? (
          <Stack>
            {step === 1 ? (
              <Text mr="4px">
                Step 1: Approve Estimated Gas: {gasApproveToV2.toFixed(8)} Azero
              </Text>
            ) : null}
            {step === 2 ? (
              <Text mr="4px">
                Step 2: Swap Estimated Gas: {gasSwapToV2.toFixed(8)} Azero
              </Text>
            ) : null}
          </Stack>
        ) : (
          <Stack>
            {step === 1 ? (
              <Text mr="4px">
                Step 1: Approve Estimated Gas: {gasApproveToV1.toFixed(8)} Azero
              </Text>
            ) : null}
            {step === 2 ? (
              <Text mr="4px">
                Step 2: Swap Estimated Gas: {gasSwapToV1.toFixed(8)} Azero
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
  );
};
