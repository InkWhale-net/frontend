import {
  Box,
  Button,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";
import { formatNumToBNEther } from "utils";
import { formatChainStringToNumber } from "utils";
import { execContractTxAndCallAPI } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import { launchpad } from "utils/contracts";

const WithdrawAzero = ({
  visible,
  setVisible,
  launchpadData,
  ownerBalance,
}) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const dispatch = useDispatch();
  const [publicSale, setPublicSale] = useState([]);
  const [whitelistSale, setWhiteListSale] = useState([]);
  const phases = launchpadData?.phaseList;

  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);

  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const isPhaseStart =
    Date.now() > formatChainStringToNumber(launchpadData?.startTime);
  const isOwner = launchpadData?.owner === currentAccount?.address;
  const tokenSymbol = launchpadData?.projectInfo?.token?.symbol;
  const tokenAddress = launchpadData?.projectInfo?.token?.tokenAddress;

  // const totalSupply =
  //   formatChainStringToNumber(launchpadData?.totalSupply) /
  //   Math.pow(10, tokenDecimal);

  // const fetchPhaseData = async () => {
  //   const result = await execContractQuery(
  //     currentAccount?.address,
  //     api,
  //     launchpad.CONTRACT_ABI,
  //     launchpadData?.launchpadContract,
  //     0,
  //     "launchpadContractTrait::getAvailableTokenAmount"
  //   );
  //   const availableAmount = result.toHuman().Ok;
  //   setAvailableTokenAmount(formatTokenAmount(availableAmount, tokenDecimal));
  // };

  // useEffect(() => {
  //   if (!visible) {
  //     // setOnCreateNew(false);
  //     // setNewData(null);
  //     // setSelectedPhaseIndex(-1);
  //   } else {
  //     if (launchpadData) fetchPhaseData();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [visible, launchpadData]);

  // const minAllowed = totalSupply - availableTokenAmount;

  // const [tokenBalance, setTokenBalance] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const txRateQuery = await execContractQuery(
        currentAccount?.address,
        api,
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::getTxRate"
      );
      const txRate = +txRateQuery?.toHuman()?.Ok / 10000;
      const publicSaleData = await Promise.all(
        phases?.map(async (phase, index) => {
          const queryResult = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getPublicSaleInfo",
            phase?.phaseID
          );
          const publicInfo = queryResult?.toHuman()?.Ok;
          const queryResult2 = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getPublicSalePrice",
            phase?.phaseID
          );
          const tokenPricee = formatTokenAmount(
            queryResult2?.toHuman()?.Ok,
            appChain?.decimal
          );
          const totalPurchasedAmountPhase = formatTokenAmount(
            publicInfo?.totalPurchasedAmount,
            launchpadData?.projectInfo?.token?.decimals
          );
          return {
            totalAmount: formatTokenAmount(
              publicInfo?.totalAmount,
              launchpadData?.projectInfo?.token?.decimals
            ),
            totalPurchasedAmount: totalPurchasedAmountPhase,
            azeroAmount: tokenPricee * totalPurchasedAmountPhase * (1 - txRate),
          };
        })
      );
      setPublicSale(publicSaleData);
      const WLSaleData = await Promise.all(
        phases?.map(async (phase, index) => {
          const queryResult = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getWhitelistSaleInfo",
            phase?.phaseID
          );
          const WLInfo = queryResult?.toHuman()?.Ok;
          console.log(WLInfo);
          // const queryResult2 = await execContractQuery(
          //   currentAccount?.address,
          //   api,
          //   launchpad.CONTRACT_ABI,
          //   launchpadData?.launchpadContract,
          //   0,
          //   "launchpadContractTrait::getPublicSalePrice",
          //   phase?.phaseID
          // );
          // const tokenPricee = formatTokenAmount(
          //   queryResult2?.toHuman()?.Ok,
          //   appChain?.decimal
          // );
          // const totalPurchasedAmountPhase = formatTokenAmount(
          //   publicInfo?.totalPurchasedAmount,
          //   launchpadData?.projectInfo?.token?.decimals
          // );
          // return {
          //   totalAmount: formatTokenAmount(
          //     publicInfo?.totalAmount,
          //     launchpadData?.projectInfo?.token?.decimals
          //   ),
          //   totalPurchasedAmount: totalPurchasedAmountPhase,
          //   azeroAmount: tokenPricee * totalPurchasedAmountPhase * (1 - txRate),
          // };
        })
      );
      setWhiteListSale(WLSaleData);
      // const
      // setTokenBalance(tokenBal);
    };
    visible && fetchData();
  }, [visible]);
  const ownerWithdrawMutation = useMutation(async () => {
    return new Promise(async (resolve, reject) => {
      toast(`Withdrawing ${ownerBalance} ${appChain?.unit}...`);

      await execContractTxAndCallAPI(
        currentAccount,
        "api",
        launchpad.CONTRACT_ABI,
        launchpadData?.launchpadContract,
        0,
        "launchpadContractTrait::withdraw",
        () => {
          setVisible(false);
          resolve();
        },
        formatNumToBNEther(ownerBalance),
        currentAccount?.address
      );
    });
  });

  return (
    <>
      <Modal
        isOpen={visible}
        isCentered
        size="xl"
        onClose={() => setVisible(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Withdraw {appChain?.unit}</ModalHeader>
          <Box px="24px">
            {phases?.map((obj, index) => {
              return (
                <Box>
                  <Text
                    sx={{
                      fontWeight: 700,
                      color: "#57527E",
                    }}
                  >
                    {obj?.name}
                  </Text>
                  <Divider />
                  <Text fontWeight={700}>Public sale</Text>
                  <SimpleGrid columns={2}>
                    <Box>
                      <Text>Total sale amount</Text>
                      <Text>Total purchased amount</Text>
                      <Text>Total {appChain?.unit}</Text>
                    </Box>
                    <Box>
                      <Text>
                        {formatNumDynDecimal(publicSale[index]?.totalAmount) ||
                          "-"}
                      </Text>
                      <Text>
                        {formatNumDynDecimal(
                          publicSale[index]?.totalPurchasedAmount
                        ) || "-"}
                      </Text>
                      <Text>
                        {formatNumDynDecimal(publicSale[index]?.azeroAmount) ||
                          "-"}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              );
            })}
          </Box>
          <Button
            sx={{
              mx: "24px",
              my: "12px",
            }}
            isLoading={ownerWithdrawMutation.isLoading}
            isDisabled={ownerWithdrawMutation.isLoading}
            onClick={() => ownerWithdrawMutation.mutate()}
          >
            Withdraw {appChain?.unit}
          </Button>
        </ModalContent>
      </Modal>
    </>
  );
};
export default WithdrawAzero;
