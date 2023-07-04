import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Circle,
  CircularProgress,
  Flex,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import TokenIcon from "components/TokenIcon";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCountDown from "components/countdown/CountDown";
import ImageCloudFlare from "components/image-cf/ImageCF";
import { GoStar } from "react-icons/go";
import { addressShortener, formatNumDynDecimal } from "utils";
import { format } from "utils/datetime";

const IWPaginationTable = ({
  tableHeader,
  tableBody,
  setPagination,
  totalData,
  pagination,
  mode,
  isDisableRowClick = false,
  customURLRowClick = "",
  mutation,
}) => {
  const table = useReactTable({
    data: tableBody ?? [],
    columns: tableHeader,
    pageCount: totalData || 0,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    // getPaginationRowModel: getPaginationRowModel(), // If only doing manual pagination, you don't need this
    // debugTable: true,
  });
  return (
    <>
      <TableContainer width="full">
        <Table variant="striped">
          <Thead>
            {table?.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
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
          <Tbody>
            {!mutation?.isLoading &&
              table.getRowModel().rows.map((row, index) => {
                return (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <Td key={cell.id}>
                          {formatDataCellTable(
                            tableBody[index],
                            cell.getContext().column.id
                          )}
                        </Td>
                      );
                    })}
                  </Tr>
                );
              })}
          </Tbody>
        </Table>
      </TableContainer>
      {mutation?.isLoading && (
        <CircularProgress
          alignSelf={"center"}
          isIndeterminate
          size={"40px"}
          color="#93F0F5"
        />
      )}

      <Box
        sx={{
          width: "full",
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <Text sx={{ mr: "20px" }}>
          {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </Text>
        <IconButton
          aria-label="previousPage"
          width={"42px"}
          height={"42px"}
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
          width={"42px"}
          height={"42px"}
          variant={"solid"}
          bg={"#93F0F5"}
          borderRadius={"42px"}
          icon={<ChevronRightIcon size={"80px"} color="#FFF" />}
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        />
        {/* 
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span> */}

        {/* <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
        {/* {dataQuery.isFetching ? "Loading..." : null} */}
      </Box>
    </>
  );
};

export const formatDataCellTable = (itemObj, header, mode) => {
  switch (header) {
    case "totalStaked":
      const extPart = `NFT${itemObj[header] > 1 ? "s" : ""}`;
      return (
        <>
          <Text>
            {formatNumDynDecimal(itemObj[header])}{" "}
            {itemObj["NFTtokenContract"] && extPart}
          </Text>
        </>
      );

    case "multiplier":
      return mode === "TOKEN_FARM" ? (
        <Text>{(itemObj[header] / 10 ** 6).toFixed(2)}</Text>
      ) : mode === "NFT_FARM" ? (
        <Text>{(itemObj[header] / 10 ** 12).toFixed(2)}</Text>
      ) : (
        <></>
      );

    case "rewardPool":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])}</Text>
        </>
      );

    case "startTime":
      return (
        <>
          <IWCountDown date={itemObj[header] + itemObj["duration"] * 1000} />
        </>
      );

    case "apy":
      return (
        <>
          <Text>{itemObj[header] / 100}%</Text>
        </>
      );

    case "poolName":
      return (
        <>
          <Flex
            w="full"
            justify={{ base: "start" }}
            alignItems={{ base: "center" }}
          >
            <Circle w="30px" h="30px" bg="white">
              <Image src={itemObj["poolLogo"]} alt="logo-subwallet" />
            </Circle>

            <Text ml="8px">{itemObj[header]}</Text>
          </Flex>
        </>
      );

    case "nftInfo":
      return (
        <>
          <Flex
            w="full"
            justify={{ base: "start" }}
            alignItems={{ base: "center" }}
          >
            <ImageCloudFlare
              borderWidth="1px"
              w="40px"
              h="40px"
              size="500"
              alt={header}
              borderRadius="5px"
              src={itemObj[header]?.avatarImage}
            />
            <Text ml="8px">{itemObj[header]?.name}</Text>
          </Flex>
        </>
      );

    case "poolNameNFT":
      return (
        <>
          <Flex
            w="full"
            justify={{ base: "start" }}
            alignItems={{ base: "center" }}
          >
            <Circle w="30px" h="30px" bg="white">
              <Image src={itemObj["poolLogo"]} alt="logo-subwallet" />
            </Circle>

            <Text ml="8px">{itemObj[header]}</Text>
          </Flex>
        </>
      );

    case "stakeInfo":
      const numberStakeInfo =
        itemObj[header] &&
        formatNumDynDecimal(itemObj[header].stakedValue / 10 ** 12);

      const numberNFTStakeInfo =
        itemObj[header] && formatNumDynDecimal(itemObj[header].stakedValue);

      return (
        <>
          {itemObj[header] ? (
            itemObj["NFTtokenContract"] ? (
              <Flex alignItems="center">
                <Text mr="8px">{numberNFTStakeInfo}</Text>
                <GoStar color="#FFB800" />
              </Flex>
            ) : (
              <Flex alignItems="center">
                <Text mr="8px">{numberStakeInfo}</Text>
                <GoStar color="#FFB800" />
              </Flex>
            )
          ) : (
            ""
          )}
        </>
      );

    case "myStake":
      return (
        <>
          <Flex alignItems="center">
            <Text mr="8px">{itemObj[header]}</Text>
            {itemObj["isMyStake"] && <GoStar color="#FFB800" />}
          </Flex>
        </>
      );

    case "totalSupply":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])}</Text>
        </>
      );

    case "duration":
      return (
        <>
          <Text>{itemObj[header] / 86400} days</Text>
        </>
      );
    case "tokenSymbol":
      return (
        <Flex alignItems={"center"} mr={{ base: "20px" }}>
          <TokenIcon tokenContract={itemObj["tokenContract"]} />
          <Text textAlign="left">{itemObj[header]} </Text>
        </Flex>
      );
    case "tokenTotalSupply":
      const tokenTotalSupply = itemObj[header].replaceAll(",", "");
      return (
        <>
          <Text>{formatNumDynDecimal(tokenTotalSupply / 10 ** 12)}</Text>
        </>
      );
    case "time":
      return (
        <>
          <Text>{format(itemObj[header], "MMMM Do YYYY, h:mm:ss a")}</Text>
        </>
      );

    case "contractAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} fontWeight="none" />
        </>
      );
    case "tokenContract":
      return (
        <>
          <AddressCopier address={itemObj[header]} fontWeight="none" />
        </>
      );
    case "fromAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} fontWeight="none" />
        </>
      );
    case "toAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} fontWeight="none" />
        </>
      );
    case "amount":
      return (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {itemObj?.amountIcon}
            {itemObj[header]}{" "}
          </Box>
        </>
      );
    case "tokenIconUrl":
      return itemObj[header] ? (
        <Image
          w="38px"
          borderRadius={"10px"}
          src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${itemObj[header]}`}
          alt="logo"
        />
      ) : (
        ""
      );
    case "owner":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );

    case "poolContract":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );

    case "creator":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );

    case "mintTo":
      return (
        <>
          <Text>{addressShortener(itemObj[header])}</Text>
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

export default IWPaginationTable;