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
import { BN, BN_BILLION, BN_MILLION } from "@polkadot/util";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBalance } from "redux/slices/walletSlice";
import { formatTokenAmount } from "utils";
import { formatNumDynDecimal } from "utils";
import { formatNumToBNEther } from "utils";
import { multipleFloat } from "utils";
import { formatQueryResultToNumberEthers } from "utils";
import { formatChainStringToNumber } from "utils";
import { execContractTxAndCallAPI } from "utils/contracts";
import { execContractQuery } from "utils/contracts";
import { launchpad } from "utils/contracts";

const DECIMALS = 3;
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
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);

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
          const totalPurchasedAmountPhase =
            publicInfo?.totalPurchasedAmount &&
            formatTokenAmount(
              publicInfo?.totalPurchasedAmount,
              launchpadData?.projectInfo?.token?.decimals
            );
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
          return {
            totalAmount:
              publicInfo?.totalAmount &&
              formatTokenAmount(
                publicInfo?.totalAmount,
                launchpadData?.projectInfo?.token?.decimals
              ),
            totalPurchasedAmount: totalPurchasedAmountPhase,
            azeroAmount: multipleFloat(
              multipleFloat(tokenPricee, totalPurchasedAmountPhase),
              1 - txRate
            ),
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
          const totalPurchasedAmountPhase =
            WLInfo?.totalPurchasedAmount &&
            formatTokenAmount(
              WLInfo?.totalPurchasedAmount,
              launchpadData?.projectInfo?.token?.decimals
            );
          const queryCountWL = await execContractQuery(
            currentAccount?.address,
            api,
            launchpad.CONTRACT_ABI,
            launchpadData?.launchpadContract,
            0,
            "launchpadContractTrait::getWhitelistAccountCount",
            phase?.phaseID
          );
          const countWL = queryCountWL?.toHuman()?.Ok;
          const WLList = await Promise.all(
            new Array(+countWL).fill(0).map(async (e, index) => {
              const queryWLAccount = await execContractQuery(
                currentAccount?.address,
                api,
                launchpad.CONTRACT_ABI,
                launchpadData?.launchpadContract,
                0,
                "launchpadContractTrait::getWhitelistAccount",
                phase?.phaseID,
                index
              );
              const WLAccount = queryWLAccount?.toHuman()?.Ok;
              const queryWLAccountDetail = await execContractQuery(
                currentAccount?.address,
                api,
                launchpad.CONTRACT_ABI,
                launchpadData?.launchpadContract,
                0,
                "launchpadContractTrait::getWhitelistBuyer",
                phase?.phaseID,
                WLAccount
              );
              const WLAccountDetail = queryWLAccountDetail?.toHuman()?.Ok;
              const formatedAccountBuyer = {
                price: formatTokenAmount(
                  WLAccountDetail?.price,
                  appChain?.decimals
                ),
                purchasedAmount: formatTokenAmount(
                  WLAccountDetail?.purchasedAmount,
                  tokenDecimal
                ),
              };
              return formatedAccountBuyer;
            })
          );
          const totalSaledAzero = WLList.reduce((acc, current) => {
            return (
              acc + multipleFloat(current?.price, current?.purchasedAmount)
            );
          }, 0);
          return {
            totalAmount:
              WLInfo?.totalAmount &&
              formatTokenAmount(
                WLInfo?.totalAmount,
                launchpadData?.projectInfo?.token?.decimals
              ),
            totalPurchasedAmount: totalPurchasedAmountPhase,
            azeroAmount: multipleFloat(totalSaledAzero, 1 - txRate),
          };
        })
      );
      setWhiteListSale(WLSaleData);
    };
    visible && fetchData();
  }, [visible]);
  const ownerWithdrawMutation = useMutation(async () => {
    return new Promise(async (resolve, reject) => {
      try {
        if (ownerBalance < 0.0001) {
          resolve();
          return toast.error("Balance is zero!");
        }
        toast(`Withdrawing ${ownerBalance} ${appChain?.unit}...`);

        const result = await execContractTxAndCallAPI(
          currentAccount,
          "api",
          launchpad.CONTRACT_ABI,
          launchpadData?.launchpadContract,
          0,
          "launchpadContractTrait::withdraw",
          async () => {
            dispatch(fetchUserBalance({ currentAccount, api }));
            await setVisible(false);
            resolve();
          },
          formatNumToBNEther(ownerBalance),
          currentAccount?.address
        );
        if (!result) reject("WITHDRAW FAIL");
      } catch (error) {
        reject("WITHDRAW FAIL");
      }
    });
  });

  return (
    <>
      <Modal
        isOpen={visible}
        isCentered
        size="4xl"
        onClose={() => setVisible(false)}
      >
        <ModalOverlay />
        <ModalContent
          sx={{
            maxH: "calc(100vh - 100px)",
          }}
          overflow="auto"
        >
          <ModalHeader color="#57527E">Withdraw {appChain?.unit}</ModalHeader>
          <Box px="24px">
            {phases?.map((obj, index) => {
              return (
                <Box mt={index > 0 && "20px"}>
                  <Text
                    sx={{
                      fontWeight: 700,
                      color: "#57527E",
                    }}
                  >
                    {obj?.name?.toUpperCase()}
                  </Text>
                  <Box h="1px" bg="rgba(0, 0, 0, 0.2)" />
                  <Text fontWeight={700}>Public sale</Text>
                  <SimpleGrid columns={2}>
                    <Box>
                      <Text>Total sale amount</Text>
                      <Text>Total purchased amount</Text>
                      <Text>Total {appChain?.unit} amount</Text>
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
                  <Text fontWeight={700}>Whitelist sale</Text>
                  <SimpleGrid columns={2}>
                    <Box>
                      <Text>Total sale amount</Text>
                      <Text>Total purchased amount</Text>
                      <Text>Total {appChain?.unit} amount</Text>
                    </Box>
                    <Box>
                      <Text>
                        {formatNumDynDecimal(
                          whitelistSale[index]?.totalAmount
                        ) || "-"}
                      </Text>
                      <Text>
                        {formatNumDynDecimal(
                          whitelistSale?.[index]?.totalPurchasedAmount
                        ) || "-"}
                      </Text>
                      <Text>
                        {formatNumDynDecimal(
                          whitelistSale[index]?.azeroAmount
                        ) || "-"}
                      </Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              );
            })}
          </Box>
          <Box px="24px">
            <Box h="1px" bg="rgba(0, 0, 0, 0.2)" my="8px" />
            <SimpleGrid columns={2}>
              <Box>
                <Text>Launchpad {appChain?.unit} Balance</Text>
              </Box>
              <Box>
                <Text>{formatNumDynDecimal(ownerBalance) || "-"}</Text>
              </Box>
            </SimpleGrid>
          </Box>

          <Button
            sx={{
              mx: "24px",
              my: "12px",
              minH: "40px",
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
