import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { Fragment, useMemo } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { useHistory, useLocation } from "react-router-dom";
import { formatDataCellTable as formatDataCellTableNew } from "./IWPaginationTable";
import { useSelector } from "react-redux";
import { formatChainStringToNumber } from "utils";
import toast from "react-hot-toast";
import { useAppContext } from "contexts/AppContext";
import { doClaimPrincipal } from "api/azero-staking/azero-staking";
import { delay } from "utils";

import { execContractQuery } from "utils/contracts";
import my_azero_staking from "utils/contracts/my_azero_staking";
import { formatNumToBN } from "utils";
import { execContractTx } from "utils/contracts";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import { stakeStatus } from "constants";
import { doCancelRequest } from "api/azero-staking/azero-staking";
import { appChain } from "constants";

export function IWTable({
  tableHeader,
  tableBody,
  mode,
  loading,
  isDisableRowClick = false,
  customURLRowClick = "",
  cb,
}) {
  const history = useHistory();
  const location = useLocation();

  function onClickRowHandler(itemObj) {
    if (isDisableRowClick) return;

    if (customURLRowClick) {
      history.push({
        state: { ...itemObj, mode },
        pathname: `${customURLRowClick}/${itemObj?.poolContract}`,
      });

      return;
    }

    history.push({
      state: { ...itemObj, mode },
      pathname: `${location.pathname}/${itemObj?.poolContract}`,
    });
  }

  const { api } = useAppContext();
  const { currentAccount } = useSelector((s) => s.wallet);

  const azeroBalance = useMemo(() => {
    const azeroBal = formatChainStringToNumber(currentAccount?.balance?.azero);
    return Number(azeroBal);
  }, [currentAccount?.balance?.azero]);

  const inwBalance2 = useMemo(() => {
    const bal = formatChainStringToNumber(currentAccount?.balance?.inw2);
    return Number(bal);
  }, [currentAccount?.balance?.inw2]);

  async function handleClaimPrincipal(index) {
    if (azeroBalance < 0.01) {
      toast.error(`Too low ${appChain?.unit} balance!`);
      return;
    }

    if (inwBalance2 < 5) {
      toast.error(`Too low ${appChain?.inwName} balance!`);
      return;
    }
    try {
      // check approve 5inw
      const allowanceTokenQr = await execContractQuery(
        currentAccount?.address,
        "api",
        psp22_contract_v2.CONTRACT_ABI,
        psp22_contract_v2.CONTRACT_ADDRESS,
        0, //-> value
        "psp22::allowance",
        currentAccount?.address,
        my_azero_staking.CONTRACT_ADDRESS
      );

      const allowanceToken =
        allowanceTokenQr?.toHuman().Ok?.replaceAll(",", "") / 10 ** 12;

      console.log("allowanceToken", allowanceToken);

      if (5 > allowanceToken) {
        toast("Approving fee...");

        await execContractTx(
          currentAccount,
          "api",
          psp22_contract_v2.CONTRACT_ABI,
          psp22_contract_v2.CONTRACT_ADDRESS,
          0, //-> value
          "psp22::approve",
          my_azero_staking.CONTRACT_ADDRESS,
          formatNumToBN(5)
        );
      }
      // End check approve additional portion

      await delay(1000).then(async () => {
        await doClaimPrincipal(api, currentAccount, index);
      });

      delay(1000).then(() => {
        cb && cb();
      });
    } catch (error) {
      console.log("error", error);
    }
  }

  async function handleCancelRequest(index) {
    const foundItem = tableBody?.find((i) => i.requestIndex === index);

    if (!foundItem) {
      toast.error("Invalid Id!");
      return;
    }

    if (parseInt(foundItem.status) !== 0 && parseInt(foundItem.status) !== 1) {
      toast.error("This request can not be cancel!");
      return;
    }

    if (azeroBalance < 0.01) {
      toast.error(`Too low ${appChain?.unit} balance!`);
      return;
    }

    try {
      await doCancelRequest(api, currentAccount, index);

      delay(1000).then(() => {
        cb && cb();
      });
    } catch (error) {
      console.log("error", error);
      toast.error("There is something wrong with your request!");
    }
  }

  return (
    <TableContainer
      w="full"
      color="text.1"
      fontSize="md"
      fontWeight="600"
      lineHeight="20px"
      borderRadius="10px"
      border="1px solid #E3DFF3"
    >
      <Table variant="simple">
        <Thead>
          <Tr>
            {tableHeader?.map(({ name, label, hasTooltip, tooltipContent }) => (
              <Th
                key={name}
                h="60px"
                bg="bg.5"
                color="text.2"
                fontWeight="400"
                fontSize="16px"
                lineHeight="28px"
                textTransform="none"
              >
                <Flex alignItems="center">
                  {label}
                  {hasTooltip && (
                    <Tooltip fontSize="md" label={tooltipContent}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  )}
                </Flex>
              </Th>
            ))}
            {mode === "AZERO_STAKING" && (
              <>
                <Th
                  h="60px"
                  bg="bg.5"
                  color="text.2"
                  fontWeight="400"
                  fontSize="16px"
                  lineHeight="28px"
                  textTransform="none"
                >
                  <Flex
                    display="flex"
                    justifyContent="center"
                    w="full"
                    alignItems="center"
                  >
                    Unstake
                  </Flex>
                </Th>
                <Th
                  h="60px"
                  bg="bg.5"
                  color="text.2"
                  fontWeight="400"
                  fontSize="16px"
                  lineHeight="28px"
                  textTransform="none"
                  textAlign="center"
                >
                  <Flex
                    display="flex"
                    justifyContent="center"
                    w="full"
                    alignItems="center"
                  >
                    Cancel
                  </Flex>
                </Th>
              </>
            )}
          </Tr>
        </Thead>

        <Tbody>
          {loading ? (
            Array.from({ length: 3 }).map((e) => (
              <Tr>
                {tableHeader?.map((_, idx) => (
                  <Td p="0" key={idx}>
                    <Skeleton height="60px" />
                  </Td>
                ))}
              </Tr>
            ))
          ) : (
            <>
              {tableBody?.length === 0 ? (
                <Tr>
                  <Td colSpan={tableHeader?.length} textAlign="center">
                    <Text textAlign="center" w="full">
                      No data found!
                    </Text>
                  </Td>
                </Tr>
              ) : (
                tableBody?.map((itemObj, idx) => {
                  return (
                    <Fragment key={idx}>
                      <Tr
                        h="60px"
                        cursor="pointer"
                        _hover={{ bg: "bg.1" }}
                        onClick={() => onClickRowHandler(itemObj)}
                      >
                        {tableHeader?.map((i, idx) => {
                          return (
                            <Td key={idx}>
                              <FadeIn>
                                {formatDataCellTableNew(
                                  itemObj,
                                  i?.name,
                                  mode,
                                  i?.showTooltipIconContent
                                )}
                              </FadeIn>
                            </Td>
                          );
                        })}
                        {mode === "AZERO_STAKING" && (
                          <>
                            <Td>
                              <FadeIn>
                                <Button
                                  w="full"
                                  size="sm"
                                  disabled={
                                    itemObj["requestStatus"] !==
                                    stakeStatus.READY
                                  }
                                  onClick={() =>
                                    handleClaimPrincipal(
                                      itemObj["requestIndex"]
                                    )
                                  }
                                >
                                  {itemObj["requestStatus"] ===
                                  stakeStatus.UNSTAKED
                                    ? "Unstaked"
                                    : "Unstake"}
                                </Button>
                              </FadeIn>
                            </Td>
                            <Td>
                              <FadeIn>
                                <Button
                                  _hover={{ bg: "indianred" }}
                                  _focus={{ bg: "indianred" }}
                                  _active={{ bg: "indianred" }}
                                  bg="orangered"
                                  color="black"
                                  w="full"
                                  size="sm"
                                  disabled={
                                    itemObj["requestStatus"] !==
                                      stakeStatus.READY &&
                                    itemObj["requestStatus"] !==
                                      stakeStatus.PENDING
                                  }
                                  onClick={() =>
                                    handleCancelRequest(itemObj["requestIndex"])
                                  }
                                >
                                  {itemObj["requestStatus"] !==
                                  stakeStatus.CANCELLED
                                    ? "Cancel"
                                    : "Cancelled"}
                                </Button>
                              </FadeIn>
                            </Td>
                          </>
                        )}
                      </Tr>
                    </Fragment>
                  );
                })
              )}
            </>
          )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
