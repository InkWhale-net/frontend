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
  Stack,
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
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumDynDecimal, formatTokenAmount } from "utils";
import { execContractQuery } from "utils/contracts";
import launchpad from "utils/contracts/launchpad";
import AddSingleWL from "./AddSingle";
import { AiFillExclamationCircle } from "react-icons/ai";

const WLEditMode = [
  "Single add Whitelist",
  "Bulk add Whitelist",
  "Clear Whitelist",
];

const EditWL = ({ visible, setVisible, launchpadData }) => {
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { api } = useAppContext();
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedMode, setSelectedMode] = useState(0);
  const [availableTokenAmount, setAvailableTokenAmount] = useState(0);
  const [queries, setQueries] = useState(null);
  const tokenDecimal = parseInt(launchpadData?.projectInfo?.token?.decimals);
  const whitelist = launchpadData?.phaseList[selectedPhase]?.whitelist?.map(
    (e) => ({
      ...e,
      amount: formatNumDynDecimal(formatTokenAmount(e?.amount, tokenDecimal)),
      purchasedAmount: formatNumDynDecimal(
        formatTokenAmount(e?.purchasedAmount, tokenDecimal)
      ),
      claimedAmount: formatNumDynDecimal(
        formatTokenAmount(e?.claimedAmount, tokenDecimal)
      ),
      price: formatTokenAmount(e?.price, 12),
    })
  );
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
  const isPhaseEditable = () => {
    if (selectedPhase >= 0) {
      const phaseData = launchpadData?.phaseList[selectedPhase];
      const phaseDataParse = {
        ...phaseData,
        startDate: new Date(parseInt(phaseData?.startTime?.replace(/,/g, ""))),
        endDate: new Date(parseInt(phaseData?.endTime?.replace(/,/g, ""))),
      };

      if (
        phaseDataParse?.endDate < new Date() ||
        phaseDataParse?.startDate < new Date()
      )
        return false;
    } else {
      return true;
    }
  };
  const table = useReactTable({
    ...tableData,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
  });
  useEffect(() => {
    if (launchpadData) fetchPhaseData();
  }, [launchpadData]);

  useEffect(() => {
    if (table) table.setPageSize(4);
  }, [table]);
  return (
    <Modal
      onClose={() => setVisible(false)}
      isOpen={visible}
      isCentered
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Whitelist</ModalHeader>
        <ModalCloseButton onClick={() => setVisible(false)} />
        <ModalBody sx={{ pb: "28px" }}>
          <Box sx={{ display: "flex" }}>
            <Box sx={{ width: "320px", minW: "320px" }}>
              <Text>
                Available token amount:{" "}
                {`${formatNumDynDecimal(availableTokenAmount)} 
                ${launchpadData?.projectInfo?.token?.symbol}`}
              </Text>
              {!isPhaseEditable() && (
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
              <Stack spacing={1}>
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
                {isPhaseEditable() && (
                  <>
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
                  </>
                )}
              </Stack>

              {isPhaseEditable() && selectedMode == 0 ? (
                <AddSingleWL
                  launchpadData={launchpadData}
                  selectedPhase={selectedPhase}
                />
              ) : null}
            </Box>
            {/* <Divider orientation="vertical" /> */}
            <Box sx={{ flex: 1, px: "20px" }}>
              <IWInput
                size="md"
                value={queries?.keyword}
                width={{ base: "full" }}
                onChange={({ target }) =>
                  setQueries({ ...queries, keyword: target.value })
                }
                placeholder="Search with From/To"
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
                <Table variant="striped">
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
                            <Tr key={row.id}>
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
                              value={table.getState().pagination.pageIndex + 1}
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
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
export default EditWL;
