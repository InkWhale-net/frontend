import {
  Box,
  Button,
  Divider,
  Flex,
  Input,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from "react-redux";
import { MdWallet } from "react-icons/md";
import "./styles.css";
import { useMutation } from "react-query";
import { execContractTx } from "utils/contracts";
import { useAppContext } from "contexts/AppContext";
import swap_inw2_contract from "utils/contracts/swap_inw2_contract";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import { formatNumToBN } from "utils";
import toast from "react-hot-toast";
import { delay } from "utils";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { execContractQuery } from "utils/contracts";
import psp22_contract from "utils/contracts/psp22_contract";
import { formatQueryResultToNumber } from "utils";
import { formatNumDynDecimal } from "utils";
export const INWSwap = () => {
  const amountRef = useRef(null);
  if (isMobile) return null;
  return (
    <Menu placement="bottom-end">
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

export const SwapModalContent = ({ isOpen, amountRef }) => {
  const [amount, setAmount] = useState("");
  const [_isOpen, setIsOpen] = useState(false);
  const { api } = useAppContext();
  const { currentAccount } = useSelector((state) => state.wallet);

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
      const inwBalance = +currentAccount?.balance?.inw?.replaceAll(",", "");
      if (+inwBalance < +amount) {
        toast.error(
          `Maximum swap amount is ${formatNumDynDecimal(inwBalance)}`
        );
        return;
      }
      toast("Approve...");
      const allowanceTokenQr = await execContractQuery(
        currentAccount?.address,
        "api",
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
      console.log(allowanceINW);
      if (+allowanceINW < +amount) {
        let approve = await execContractTx(
          currentAccount,
          "api",
          psp22_contract.CONTRACT_ABI,
          process.env.REACT_APP_INW_TOKEN_ADDRESS,
          0, //-> value
          "psp22::approve",
          swap_inw2_contract.CONTRACT_ADDRESS,
          formatNumToBN(Number.MAX_SAFE_INTEGER)
        );
        if (!approve) return;
      }
      toast("Swap...");
      await execContractTx(
        currentAccount,
        api,
        swap_inw2_contract.CONTRACT_ABI,
        swap_inw2_contract.CONTRACT_ADDRESS,
        0,
        "inwSwapTrait::swap",
        formatNumToBN(amount)
      );
      await delay(500).then(() => {
        if (currentAccount) {
          dispatch(fetchUserBalance({ currentAccount, api }));
        }
        setAmount("");
      });
    } catch (error) {
      console.log(error);
    }
  };
  const { isLoading, mutate } = useMutation(async () => {
    return new Promise((resolve) => resolve(swapToTokenv2()));
  }, "swap-to-inw-v2");
  useEffect(() => {
    setIsOpen(isOpen);
  }, [isOpen]);
  useEffect(() => {
    if (isOpen == true) {
      amountRef?.current?.focus();
      setAmount("");
    }
  }, [_isOpen]);
  return (
    <Box minW={!isMobile && "400px"} p="12px">
      <Flex direction="column">
        <Flex className="balance-container">
          <Flex pr="20px">
            <MdWallet size="32px" />
          </Flex>
          <Flex direction={isMobile ? "column" : "row"} alignItems="end">
            <Flex justify="space-between">
              <Text className="balance-text">
                {formatNumDynDecimal(
                  currentAccount?.balance?.inw?.replaceAll(",", "")
                )}
              </Text>
              <Text
                className="balance-text-unit"
                w={isMobile && "64px"}
                textAlign="end"
              >
                INW
              </Text>
            </Flex>
            <Box className="divider-balance" />
            <Flex>
              <Text className="balance-text">
                {formatNumDynDecimal(currentAccount?.balance?.inw2)}
              </Text>
              <Text
                className="balance-text-unit"
                w={isMobile && "64px"}
                textAlign="end"
              >
                INW V2
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" className="swap-amount-container">
        <Box
          className="max-amount-button"
          onClick={() =>
            setAmount(currentAccount?.balance?.inw?.replaceAll(",", ""))
          }
        >
          max
        </Box>
        <Input
          value={amount}
          onChange={({ target }) => setAmount(target.value)}
          type="number"
          placeholder="0.0"
          className="swap-amount-input"
          ref={amountRef}
        />
      </Flex>
      <Flex justify="end" fontSize="16px">
        <Text mr="4px">You will recieve</Text>
        <Text mr="4px" fontWeight="700" color="#57527e">
          {formatNumDynDecimal(amount)}
        </Text>
        <Text>INW V2</Text>
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
