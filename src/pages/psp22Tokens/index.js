import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  IconButton,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatTokenAmountNumber, moveINWToBegin, roundUp } from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";
import { ElementCard, formatDataCellTable } from "./ElementCard";
import { useHistory } from "react-router-dom";

const PAGINATION_AMOUNT = 12;

export default function PSP22Tokens() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);
  const history = useHistory();
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });
  const { api } = useAppContext();
  const [listToken, setListToken] = useState([]);
  const [listTokenFiltered, setListTokenFiltered] = useState([]);
  const [keywords, setKeywords] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const addTotalSupply = async (_allTokensList) => {
    const processedTokenList = await Promise.all(
      _allTokensList.map(async (e) => {
        let queryResult = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract_v2.CONTRACT_ABI,
          e?.contractAddress,
          0,
          "psp22::totalSupply"
        );
        const rawTotalSupply = queryResult.toHuman().Ok;
        let queryResult1 = await execContractQuery(
          currentAccount?.address,
          "api",
          psp22_contract_v2.CONTRACT_ABI,
          e?.contractAddress,
          0,
          "psp22Metadata::tokenDecimals"
        );
        const decimals = queryResult1.toHuman().Ok;
        const totalSupply = roundUp(
          +formatTokenAmountNumber(rawTotalSupply, decimals),
          0
        );
        return {
          ...e,
          totalSupply,
        };
      })
    );
    const listTK = moveINWToBegin(processedTokenList);
    setListToken(listTK);
    setListTokenFiltered(listTK);
  };

  useEffect(() => {
    if (allTokensList?.length > 0 && !!api) addTotalSupply(allTokensList);
  }, [allTokensList, api, currentAccount]);

  useEffect(() => {
    if (!keywords?.length > 0) {
      setListTokenFiltered(listToken);
    }
  }, [keywords]);

  const searchTokens = async () => {
    try {
      setListTokenFiltered(
        listToken?.filter(
          (e) =>
            e?.contractAddress
              ?.toLowerCase()
              .includes(keywords?.toLowerCase()) ||
            e?.creator?.toLowerCase().includes(keywords?.toLowerCase()) ||
            e?.name?.toLowerCase().includes(keywords?.toLowerCase()) ||
            e?.symbol?.toLowerCase().includes(keywords?.toLowerCase())
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const tableData = {
    columns: [
      {
        accessorKey: "contractAddress",
        header: "Contract Address",
      },
      {
        accessorKey: "creator",
        header: "Owner",
      },
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        accessorKey: "symbol",
        header: "Symbol",
      },
      {
        accessorKey: "tokenIconUrl",
        header: "Icon",
      },
      {
        accessorKey: "decimal",
        header: "Decimal",
      },
      {
        accessorKey: "totalSupply",
        header: "Total supply",
      },
    ],
    data: listTokenFiltered || [],
  };
  const table = useReactTable({
    ...tableData,
    getCoreRowModel: getCoreRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });
  useEffect(() => {
    if (table) table.setPageSize(PAGINATION_AMOUNT);
  }, [table]);
  const tableHeaders = table?.getHeaderGroups()[0]?.headers.map((e) => e?.id);
  const fetchTokenPools = async () => {};
  return (
    <SectionContainer
      mt={{ base: "0px", xl: "8px" }}
      title="PSP22 Tokens"
      description="Standard PSP22 (ERC20) tokens"
      maxW="1800px"
    >
      <SimpleGrid columns={isSmallerThanMd ? 1 : 2}>
        <Box sx={{ display: "flex" }}>
          <IWInput
            value={keywords?.queryAddress}
            width={{ base: "full" }}
            onChange={({ target }) => setKeywords(target.value)}
            placeholder="Enter keyword"
            inputRightElementIcon={<SearchIcon color="#57527E" />}
            onKeyPress={(event) => {
              if (event.key === "Enter") {
                searchTokens();
              }
            }}
          />
          {!isSmallerThanMd && (
            <Button
              sx={{ ml: "10px" }}
              isDisabled={false}
              onClick={() => {
                searchTokens();
              }}
            >
              Search
            </Button>
          )}
        </Box>
        <Box></Box>
      </SimpleGrid>
      {isSmallerThanMd && (
        <Button
          sx={{ mt: "8px" }}
          isDisabled={false}
          onClick={() => {
            searchTokens();
          }}
        >
          Search
        </Button>
      )}
      {isSmallerThanMd ? (
        <Box mt="8px">
          {table.getRowModel().rows.map((row, index) => {
            const rowData = row.original;
            return (
              <ElementCard
                onClickItemHandler={(updateValue) => {
                  console.log("demo");
                }}
                tableHeader={tableData.columns}
                itemObj={rowData}
              />
            );
          })}
          <Box
            sx={{
              width: "full",
              display: "flex",
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
              icon={<ChevronLeftIcon size={"80px"} color="#FFF" />}
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
              icon={<ChevronRightIcon size={"80px"} color="#FFF" />}
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
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </Box>{" "}
            <Text sx={{ mr: "20px", ml: "8px" }}>
              of {table.getPageCount()}
            </Text>
          </Box>
        </Box>
      ) : (
        <TableContainer
          // mt="18px"
          width="full"
          sx={{
            mt: "18px",
            mb: "18px",
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

            {listToken?.length > 0 ? (
              <>
                <Tbody>
                  {table.getRowModel().rows.map((row, index) => {
                    const rowData = row.original;
                    return (
                      <Tr
                        key={row.id}
                        border="1px solid transparent"
                        _hover={{
                          border: "1px solid #93F0F5",
                          background: "#E8FDFF",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          // setSelectedToken(rowData);
                          history.push(`/tokens/${rowData?.contractAddress}`);
                        }}
                      >
                        {row.getVisibleCells().map((cell) => {
                          return (
                            <Td key={cell.id}>
                              {formatDataCellTable(
                                rowData,
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
                      icon={<ChevronLeftIcon size={"80px"} color="#FFF" />}
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
                      icon={<ChevronRightIcon size={"80px"} color="#FFF" />}
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
                  </Box>
                </Tfoot>
              </>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <div style={{ fontSize: 14 }}>No token data</div>
              </Box>
            )}
          </Table>
        </TableContainer>
      )}
    </SectionContainer>
  );
}
