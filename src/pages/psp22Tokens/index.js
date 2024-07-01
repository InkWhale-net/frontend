import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionOutlineIcon,
  SearchIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Grid,
  IconButton,
  Image,
  SimpleGrid,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import IconQuestionMark from "assets/img/question-mark.png";
import AddressCopier from "components/address-copier/AddressCopier";
import SectionContainer from "components/container/SectionContainer";
import IWInput from "components/input/Input";
import { useAppContext } from "contexts/AppContext";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import FadeIn from "react-fade-in/lib/FadeIn";
import {
  formatNumDynDecimal,
  formatTokenAmountNumber,
  moveINWToBegin,
  roundUp,
} from "utils";
import { execContractQuery } from "utils/contracts";
import psp22_contract_v2 from "utils/contracts/psp22_contract_V2";

const PAGINATION_AMOUNT = 12;

const formatDataCellTable = (
  itemObj,
  header,
  mode,
  showTooltipIconContent = false
) => {
  switch (header) {
    case "contractAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} fontWeight="bold" />
        </>
      );
    case "creator":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );
    case "name":
      return (
        <>
          <Text fontWeight="bold" color="#57527E">
            {itemObj[header]}
          </Text>
        </>
      );
    case "tokenIconUrl":
      return (
        <Image
          fallbackSrc={IconQuestionMark}
          w="48px"
          h="48px"
          borderRadius={"8px"}
          src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${itemObj[header]}`}
          alt="logo"
          objectFit="cover"
        />
      );
    case "totalSupply":
      return (
        <>
          <Text>
            {formatNumDynDecimal(itemObj[header])} {itemObj?.tokenSymbol}
          </Text>
        </>
      );

    default:
      return (
        <>
          <Text textAlign="left">{itemObj[header]} </Text>
        </>
      );
  }
};
const ElementCard = ({ tableHeader, itemObj, mode, onClickItemHandler }) => {
  return (
    <Box
      w={{ base: "full" }}
      minH={{ base: "20px" }}
      mb={{ base: "14px" }}
      borderWidth={{ base: "2px" }}
      borderRadius={{ base: "10px" }}
      padding={{ base: "14px" }}
      _hover={{
        borderColor: "#93F0F5",
        backgroundColor: "#E8FDFF",
      }}
      onClick={() => onClickItemHandler(itemObj)}
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {tableHeader.map(({ header, accessorKey }, index) => {
          return (
            <React.Fragment key={index}>
              <Flex alignItems="center">{header}</Flex>
              <Box
                p={{ base: "4px" }}
                color={{ base: "#57527E" }}
                fontWeight={{ base: "bold" }}
                fontSize={["16px", "18px"]}
              >
                <FadeIn>{formatDataCellTable(itemObj, accessorKey)}</FadeIn>
              </Box>
            </React.Fragment>
          );
        })}
      </Grid>
    </Box>
  );
};
export default function PSP22Tokens() {
  const { currentAccount } = useSelector((s) => s.wallet);
  const { allTokensList } = useSelector((s) => s.allPools);
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });
  const { api } = useAppContext();
  const [listToken, setListToken] = useState([]);
  const [listTokenFiltered, setListTokenFiltered] = useState([]);
  const [keywords, setKeywords] = useState("");
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
      console.log(listToken[0], keywords);
      setListTokenFiltered(
        listToken?.filter(
          (e) =>
            e?.contractAddress?.toLowerCase() == keywords?.toLowerCase() ||
            e?.creator?.toLowerCase() == keywords?.toLowerCase() ||
            e?.name?.toLowerCase() == keywords?.toLowerCase() ||
            e?.symbol?.toLowerCase() == keywords?.toLowerCase()
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
              <ElementCard tableHeader={tableData.columns} itemObj={rowData} />
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
