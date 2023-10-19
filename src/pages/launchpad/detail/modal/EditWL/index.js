import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import IWInput from "components/input/Input";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useMemo, useState } from "react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { useSelector } from "react-redux";
import { formatNumDynDecimal, formatTokenAmount } from "utils";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import AddBulk from "./AddBulk";
import AddSingleWL from "./AddSingle";
import { formatQueryResultToNumber } from "utils";

const EditWL = ({ visible, setVisible, launchpadData }) => {
  const WLEditMode = [
    `${launchpadData?.requireKyc ? "Edit Whitelist" : "Single add Whitelist"}`,
    `${
      launchpadData?.requireKyc ? "Import KYC address" : "Bulk add Whitelist"
    }`,
    "Clear Whitelist",
  ];

  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedMode, setSelectedMode] = useState(0);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const [queries, setQueries] = useState(null);
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const [selectedWL, setSelectedWL] = useState(null);

  const whitelist = useMemo(() => {
    return launchpadData?.phaseList[selectedPhase]?.whitelist?.map((e) => ({
      ...e,
      amount: formatTokenAmount(e?.amount, tokenDecimal),
      purchasedAmount: formatTokenAmount(e?.purchasedAmount, tokenDecimal),
      claimedAmount: formatTokenAmount(e?.claimedAmount, tokenDecimal),
      price: formatTokenAmount(e?.price, 12),
    }));
  }, [launchpadData?.phaseList, selectedPhase, tokenDecimal]);
  const fetchPhaseData = async () => {
    const result = await execContractQuery(
      currentAccount?.address,
      api,
      launchpad.CONTRACT_ABI,
      launchpadData?.launchpadContract,
      0,
      "launchpadContractTrait::getAvailableTokenAmount"
    );
    const availableAmount = result.toHuman().Ok;

    setAvailableTokenAmount(formatTokenAmount(availableAmount, tokenDecimal));
  };
  const tableData = {
    columns: [
      {
        accessorKey: "account",
        header: "Address",
      },
      {
        accessorKey: "amount",
        header: "Amount",
      },
      {
        accessorKey: "purchasedAmount",
        header: "Purchased",
      },
      {
        accessorKey: "claimedAmount",
        header: "Claimed",
      },
      {
        accessorKey: "price",
        header: "Price",
      },
    ],
    data: whitelist || [],
  };
  const isPhaseEditable = useMemo(() => {
    if (selectedPhase >= 0) {
      const phaseData = launchpadData?.phaseList[selectedPhase];
      const phaseDataParse = {
        ...phaseData,
        startDate: new Date(parseInt(phaseData?.startTime?.replace(/,/g, ""))),
        endDate: new Date(parseInt(phaseData?.endTime?.replace(/,/g, ""))),
      };

      if (phaseDataParse?.endDate < new Date()) return false;
      else return true;
    } else {
      return true;
    }
  }, [launchpadData?.phaseList, selectedPhase]);
  const table = useReactTable({
    ...tableData,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    // debugTable: true,
  });
  useEffect(() => {
    if (launchpadData) fetchPhaseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [launchpadData]);

  useEffect(() => {
    if (selectedMode !== 0) setSelectedWL(null);
  }, [selectedMode]);

  useEffect(() => {
    if (table) table.setPageSize(4);
  }, [table]);
  useEffect(() => {
    if (!visible) {
      setSelectedWL(null);
      setSelectedPhase(0);
      setSelectedMode(0);
    }
  }, [visible]);

  const phaseHeaderInfo = useMemo(() => {
    const capAmountBN = launchpadData?.phaseList[selectedPhase]?.capAmount;
    const decimals = launchpadData?.projectInfo?.token?.decimals;

    const currPhaseInfo = launchpadData?.phaseList[selectedPhase];
    const currWLPhaseInfo = currPhaseInfo?.whitelist;
    const currPLPhaseInfo = currPhaseInfo?.publicSaleInfor;

    const whitelistTotalAmount = currWLPhaseInfo?.reduce((prev, curr) => {
      return prev + curr?.amount?.replaceAll(",", "") / 10 ** decimals;
    }, 0);

    const whitelistTotalPurchasedAmount = currWLPhaseInfo?.reduce(
      (prev, curr) =>
        prev + curr?.purchasedAmount?.replaceAll(",", "") / 10 ** decimals,
      0
    );

    const whitelistTotalClaimedAmount = currWLPhaseInfo?.reduce(
      (prev, curr) =>
        prev + curr?.claimedAmount?.replaceAll(",", "") / 10 ** decimals,
      0
    );

    return {
      capAmount: capAmountBN?.replaceAll(",", "") / 10 ** decimals,

      isPublic: currPLPhaseInfo?.isPublic,
      publicTotalAmount: currPLPhaseInfo?.totalAmount,
      publicTotalPurchasedAmount: currPLPhaseInfo?.totalPurchasedAmount,
      publicTotalClaimedAmount: currPLPhaseInfo?.totalClaimedAmount,

      whitelistTotalAmount,
      whitelistTotalPurchasedAmount,
      whitelistTotalClaimedAmount,
    };
  }, [
    launchpadData?.phaseList,
    launchpadData?.projectInfo?.token?.decimals,
    selectedPhase,
  ]);

  return (
    <Modal
      onClose={() => setVisible(false)}
      isOpen={visible}
      isCentered
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={["2xl", "3xl"]}>
          {launchpadData?.requireKyc
            ? "Update KYC Whitelist"
            : "Update Whitelist"}
        </ModalHeader>
        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody pt="0" sx={{ pb: "28px" }}>
          <Box
            display={[
              "block",
              launchpadData?.requireKyc && selectedMode == 1 ? "block" : "flex",
            ]}
          >
            <Box
              sx={{
                maxWidth:
                  launchpadData?.requireKyc && selectedMode == 1
                    ? "100%"
                    : "320px",
                minW: "320px",
              }}
              mr={["0px", "20px"]}
            >
              <Flex>
                <Box w={launchpadData?.requireKyc && selectedMode == 1 ? "50%" : "100%"}>
                  <Text>
                    Available token amount:{" "}
                    <Text as="span" fontWeight={600}>
                      {`${formatNumDynDecimal(availableTokenAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
                    </Text>
                  </Text>
                  <Text>
                    Phase cap amount:{" "}
                    <Text as="span" fontWeight={600}>
                      {`${formatNumDynDecimal(phaseHeaderInfo?.capAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
                    </Text>
                  </Text>
                </Box>
                {launchpadData?.requireKyc && selectedMode == 1 && (
                  <Flex
                    w="full"
                    p="10px"
                    borderRadius={8}
                    border="1px solid #E3DFF3"
                    bg="#F6F6FC"
                  >
                    <PhaseHeaderInfo
                      phaseHeaderInfo={phaseHeaderInfo}
                      launchpadData={launchpadData}
                    />
                  </Flex>
                )}
              </Flex>
              {!isPhaseEditable && (
                <Box
                  sx={{
                    bg: "#FED1CA",
                    display: "flex",
                    alignItems: "center",
                    px: "10px",
                    py: "8px",
                    mt: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <AiFillExclamationCircle />
                  <Text sx={{ ml: "8px" }}>You can not edit this phase!</Text>
                </Box>
              )}
              <Flex
                display="flex"
                flexDir={[
                  "column",
                  launchpadData?.requireKyc && selectedMode == 1
                    ? "row"
                    : "column",
                ]}
                alignItems="center"
                w={[
                  "full",
                  launchpadData?.requireKyc && selectedMode == 1
                    ? "50%"
                    : "full",
                ]}
              >
                <Box
                  w={[
                    "full",
                    launchpadData?.requireKyc && selectedMode == 1
                      ? "50%"
                      : "full",
                  ]}
                  mr={[
                    "0px",
                    launchpadData?.requireKyc && selectedMode == 1
                      ? "20px"
                      : "0px",
                  ]}
                >
                  <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                    Choose Phase
                  </Text>
                  <Select
                    variant="filled"
                    size="md"
                    onChange={({ target }) => {
                      setSelectedPhase(target.value);
                    }}
                    value={selectedPhase}
                  >
                    {launchpadData?.phaseList.map((item, index) => (
                      <option key={index} value={index}>
                        {item.name}
                      </option>
                    ))}
                  </Select>
                </Box>
                {isPhaseEditable && (
                  <Box
                    w={[
                      "full",
                      launchpadData?.requireKyc && selectedMode == 1
                        ? "50%"
                        : "full",
                    ]}
                  >
                    <Text sx={{ fontWeight: "700", color: "#57527E" }}>
                      Choose Mode
                    </Text>
                    <Select
                      variant="filled"
                      size="md"
                      onChange={({ target }) => {
                        setSelectedMode(target.value);
                      }}
                      value={selectedMode}
                    >
                      {WLEditMode.map((item, index) => (
                        <option key={index} value={index}>
                          {item}
                        </option>
                      ))}
                    </Select>
                  </Box>
                )}
              </Flex>
              {isPhaseEditable &&
                (selectedMode == 0 ? (
                  <AddSingleWL
                    launchpadData={launchpadData}
                    selectedPhase={selectedPhase}
                    selectedWL={selectedWL}
                    setSelectedWL={setSelectedWL}
                    availableTokenAmount={availableTokenAmount}
                  />
                ) : null)}
            </Box>
            {/* <Divider orientation="vertical" /> */}
            {selectedMode == 1 ? (
              <AddBulk
                launchpadData={launchpadData}
                selectedPhase={selectedPhase}
                availableTokenAmount={availableTokenAmount}
                setSelectedMode={setSelectedMode}
              />
            ) : (
              <Box sx={{ flex: 1, pt: "1px" }}>
                <Flex
                  w="full"
                  p="10px"
                  mb="10px"
                  borderRadius={8}
                  border="1px solid #E3DFF3"
                  bg="#F6F6FC"
                >
                  <PhaseHeaderInfo
                    phaseHeaderInfo={phaseHeaderInfo}
                    launchpadData={launchpadData}
                  />
                </Flex>
                <IWInput
                  size="md"
                  value={queries?.keyword}
                  width={{ base: "full" }}
                  onChange={({ target }) =>
                    setQueries({ ...queries, keyword: target.value })
                  }
                  placeholder="Search"
                  inputRightElementIcon={<SearchIcon color="#57527E" />}
                />
                <TableContainer
                  width="full"
                  sx={{
                    my: "18px",
                    border: "1px solid #E3DFF3",
                    borderRadius: 8,
                  }}
                >
                  <Table variant="simple">
                    <Thead>
                      {table?.getHeaderGroups().map((headerGroup) => (
                        <Tr w="full" key={headerGroup.id}>
                          {headerGroup.headers.map((header) => {
                            return (
                              <Th key={header.id} colSpan={header.colSpan}>
                                {
                                  <div>
                                    {flexRender(
                                      header.column.columnDef.header,
                                      header.getContext()
                                    )}
                                  </div>
                                }
                              </Th>
                            );
                          })}
                        </Tr>
                      ))}
                    </Thead>

                    {whitelist?.length > 0 ? (
                      <>
                        <Tbody>
                          {table.getRowModel().rows.map((row, index) => {
                            return (
                              <Tr
                                key={row.id}
                                cursor="pointer"
                                border="1px solid transparent"
                                _hover={{
                                  border: "1px solid #93F0F5",
                                  background: "#E8FDFF",
                                }}
                                onClick={() => setSelectedWL(whitelist[index])}
                              >
                                {row.getVisibleCells().map((cell) => {
                                  return (
                                    <Td key={cell.id}>
                                      {formatDataCellTable(
                                        whitelist[index],
                                        cell.getContext().column.id
                                      )}
                                    </Td>
                                  );
                                })}
                              </Tr>
                            );
                          })}
                        </Tbody>
                        <Tfoot sx={{ display: "flex" }}>
                          <Box
                            sx={{
                              width: "full",
                              display: "flex",
                              // justifyContent: "flex-end",
                              alignItems: "center",
                              py: "8px",
                              pl: "8px",
                            }}
                          >
                            <IconButton
                              aria-label="previousPage"
                              width={"40px"}
                              height={"40px"}
                              variant={"solid"}
                              bg={"#93F0F5"}
                              borderRadius={"42px"}
                              icon={
                                <ChevronLeftIcon size={"80px"} color="#FFF" />
                              }
                              onClick={() => table.previousPage()}
                              isDisabled={!table.getCanPreviousPage()}
                            />
                            <IconButton
                              ml={"4px"}
                              aria-label="previousPage"
                              width={"40px"}
                              height={"40px"}
                              variant={"solid"}
                              bg={"#93F0F5"}
                              borderRadius={"42px"}
                              icon={
                                <ChevronRightIcon size={"80px"} color="#FFF" />
                              }
                              onClick={() => table.nextPage()}
                              isDisabled={!table.getCanNextPage()}
                            />
                            <Box sx={{ width: "64px", ml: "8px" }}>
                              <IWInput
                                size="md"
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  textAlign: "center",
                                }}
                                type="number"
                                value={
                                  table.getState().pagination.pageIndex + 1
                                }
                                onChange={(e) => {
                                  const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                  table.setPageIndex(page);
                                }}
                              />
                            </Box>{" "}
                            <Text sx={{ mr: "20px", ml: "8px" }}>
                              of {table.getPageCount()}
                            </Text>
                            {/* <Button
                          disabled={
                            pageIndexInput ===
                            table.getState().pagination.pageIndex + 1
                          }
                          onClick={() => {
                            if (
                              pageIndexInput > 0 &&
                              pageIndexInput <= table.getPageCount()
                            )
                              table.setPageIndex(pageIndexInput - 1);
                            else toast.error("invalid page number");
                          }}
                        >
                          Go
                        </Button> */}
                          </Box>
                        </Tfoot>
                      </>
                    ) : (
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <div style={{ fontSize: 14 }}>
                          No Whitelist added to this phase
                        </div>
                      </Box>
                    )}
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditWL;

export function PhaseHeaderInfo({ phaseHeaderInfo, launchpadData }) {
  return (
    <>
      <Box w={"50%"}>
        <Text>
          PL Total Amount:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(phaseHeaderInfo?.publicTotalAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          PL Total Purchased:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(
              phaseHeaderInfo?.publicTotalPurchasedAmount
            )}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          PL Total Claimed:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(phaseHeaderInfo?.publicTotalClaimedAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
      </Box>
      <Box w={"50%"}>
        <Text>
          WL Total Amount:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(phaseHeaderInfo?.whitelistTotalAmount)}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          WL Total Purchased:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(
              phaseHeaderInfo?.whitelistTotalPurchasedAmount
            )}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
        <Text>
          WL Total Claimed:{" "}
          <Text as="span" fontWeight={600}>
            {`${formatNumDynDecimal(
              phaseHeaderInfo?.whitelistTotalClaimedAmount
            )}
                ${launchpadData?.projectInfo?.token?.symbol}`}
          </Text>
        </Text>
      </Box>
    </>
  );
}
