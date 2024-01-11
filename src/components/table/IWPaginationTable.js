import {
  ChevronLeftIcon,
  ChevronRightIcon,
  QuestionOutlineIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Circle,
  CircularProgress,
  Flex,
  Grid,
  IconButton,
  Image,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useBreakpointValue,
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
import IWInput from "components/input/Input";
import React, { useEffect, useState } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { toast } from "react-hot-toast";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { GoStar } from "react-icons/go";
import { formatTokenAmount } from "utils";
import { roundDown } from "utils";
import { addressShortener, formatNumDynDecimal } from "utils";
import { format } from "utils/datetime";
const getStatusPool = (startTime, duration) => {
  if (startTime + duration * 1000 < new Date()) {
    return "Pool ended!";
  }
  return startTime < new Date() ? "Pool live!" : "Upcoming";
};

const MODE = {
  pool: "STAKING_POOL",
  NFTPool: "NFT_FARM",
  farming: "TOKEN_FARM",
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
      onClick={() => onClickItemHandler && onClickItemHandler(itemObj)}
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {tableHeader.map(
          (
            { name, label, hasTooltip, tooltipContent, showTooltipIconContent },
            index
          ) => {
            return (
              <React.Fragment key={index}>
                <Flex alignItems="center">
                  {label}
                  {hasTooltip && (
                    <Tooltip fontSize="md" label={tooltipContent}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  )}
                </Flex>
                <Box
                  p={{ base: "4px" }}
                  color={{ base: "#57527E" }}
                  fontWeight={{ base: "bold" }}
                >
                  <FadeIn>
                    {formatDataCellTable(
                      itemObj,
                      name,
                      mode,
                      showTooltipIconContent
                    )}
                  </FadeIn>
                </Box>
              </React.Fragment>
            );
          }
        )}
      </Grid>
    </Box>
  );
};

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

  const [pageIndexInput, setPageIndexInput] = useState(
    table.getState().pagination.pageIndex + 1
  );
  const isSmallerThanMd = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    setPageIndexInput(table.getState().pagination.pageIndex + 1);
  }, [table.getState().pagination.pageIndex]);

  return (
    <>
      <TableContainer width="full">
        <Table variant="striped">
          {!isSmallerThanMd && (
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
          )}

          <Tbody>
            {!mutation?.isLoading &&
              table.getRowModel().rows.map((row, index) => {
                if (isSmallerThanMd)
                  return (
                    <ElementCard
                      itemObj={tableBody[index]}
                      tableHeader={table
                        ?.getHeaderGroups()[0]
                        .headers.map((e) => {
                          return {
                            label: e.column.columnDef.header,
                            name: e.id,
                          };
                        })}
                    />
                  );
                else
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
        <Box sx={{ width: "64px", ml: "8px" }}>
          <IWInput
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
            }}
            type="number"
            value={pageIndexInput}
            onChange={(event) => {
              setPageIndexInput(parseInt(event.target.value));
            }}
          />
        </Box>{" "}
        <Text sx={{ mr: "20px", ml: "8px" }}>of {table.getPageCount()}</Text>
        <Button
          disabled={
            pageIndexInput === table.getState().pagination.pageIndex + 1
          }
          onClick={() => {
            if (pageIndexInput > 0 && pageIndexInput <= table.getPageCount())
              table.setPageIndex(pageIndexInput - 1);
            else toast.error("invalid page number");
          }}
        >
          Go
        </Button>
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

export const formatDataCellTable = (
  itemObj,
  header,
  mode,
  showTooltipIconContent = false
) => {
  switch (header) {
    case "totalStaked":
      const extPart = `NFT${itemObj[header] > 1 ? "s" : ""}`;
      return (
        <Flex alignItems="center">
          <Text>
            {formatNumDynDecimal(itemObj[header])}{" "}
            {itemObj["NFTtokenContract"] && extPart}
          </Text>
          {itemObj?.isMaxStakingAmount && showTooltipIconContent && (
            <Tooltip fontSize="md" label="Max staking amount reached">
              <span style={{ marginLeft: "6px" }}>
                <AiOutlineExclamationCircle ml="6px" color="text.1" />
              </span>
            </Tooltip>
          )}
        </Flex>
      );

    case "multiplier":
      return mode == "TOKEN_FARM" ? (
        <Text>{roundDown(itemObj[header], 6)}</Text>
      ) : mode === "NFT_FARM" ? (
        <Text>
          {formatTokenAmount(itemObj[header], +itemObj?.tokenDecimal)}
        </Text>
      ) : (
        <></>
      );
    case "status":
      return (
        <>
          <Text>
            {getStatusPool(itemObj["startTime"], itemObj["duration"])}
          </Text>
        </>
      );
    case "rewardPool":
      return (
        <>
          {/* <Text>{itemObj[header]}</Text> */}
          <Text>{formatNumDynDecimal(itemObj[header], 2)}</Text>
        </>
      );
    case "purchasedAmount":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])}</Text>
        </>
      );
    case "claimedAmount":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])}</Text>
        </>
      );
    case "amount":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])}</Text>
        </>
      );
    case "price":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])}</Text>
        </>
      );

    case "startTime":
      if (itemObj[header] > new Date())
        return <IWCountDown date={itemObj[header]} />;
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
      if (mode == MODE.pool) {
        const decimal = +itemObj?.tokenDecimal;
        const numberStakeInfo = itemObj[header]?.stakedValue;
        const stakedValue = formatTokenAmount(numberStakeInfo, decimal);
        return (
          +stakedValue > 0 && (
            <Flex alignItems="center">
              <Text mr="8px">{formatNumDynDecimal(stakedValue)}</Text>
              <GoStar color="#FFB800" />
            </Flex>
          )
        );
      }
      if (mode == MODE.farming) {
        const decimal = +itemObj?.lptokenDecimal;
        const numberStakeInfo = itemObj[header]?.stakedValue;
        const stakedValue = formatTokenAmount(numberStakeInfo, decimal);
        return (
          +stakedValue > 0 && (
            <Flex alignItems="center">
              <Text mr="8px">{formatNumDynDecimal(stakedValue)}</Text>
              <GoStar color="#FFB800" />
            </Flex>
          )
        );
      }
      if (mode == MODE.NFTPool) {
        const numberStakeInfo = itemObj[header]?.stakedValue;
        return (
          +numberStakeInfo > 0 && (
            <Flex alignItems="center">
              <Text mr="8px">{formatNumDynDecimal(numberStakeInfo)}</Text>
              <GoStar color="#FFB800" />
            </Flex>
          )
        );
      }
      return <></>;
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
          <Text>
            {formatNumDynDecimal(itemObj[header])} {itemObj?.tokenSymbol}
            {/* {itemObj[header]} */}
          </Text>
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
        <Flex alignItems={"center"}>
          <Box
            w={{ base: null, lg: "42px" }}
            sx={{
              h: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TokenIcon tokenContract={itemObj["tokenContract"]} />
          </Box>
          <Text textAlign="left">{itemObj[header]} </Text>
        </Flex>
      );
    case "tokenName":
      return (
        <Flex alignItems={"center"}>
          {/* <Box
            w={{ base: null, lg: "42px" }}
            sx={{
              h: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TokenIcon tokenContract={itemObj["tokenContract"]} />
          </Box> */}
          <Text textAlign="left">{itemObj[header]} </Text>
        </Flex>
      );
    case "lptokenSymbol":
      return (
        <Flex alignItems={"center"} mr={{ base: "20px" }}>
          <Box
            w={{ base: null, lg: "42px" }}
            sx={{
              h: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TokenIcon tokenContract={itemObj["lptokenContract"]} />
          </Box>
          <Text textAlign="left">{itemObj[header]} </Text>
        </Flex>
      );
    case "lptokenName":
      return (
        <Flex alignItems={"center"} mr={{ base: "20px" }}>
          <Box
            w={{ base: null, lg: "42px" }}
            sx={{
              h: "42px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TokenIcon tokenContract={itemObj["lptokenContract"]} />
          </Box>
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
    case "account":
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

    // AZERO STAKING
    case "requestIndex":
      return (
        <>
          <Text>#{itemObj[header]}</Text>
        </>
      );

    case "withdrawalAmount":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header])} AZERO</Text>
        </>
      );

    case "azeroReward":
      return (
        <>
          <Text>{formatNumDynDecimal(itemObj[header], 6)} AZERO</Text>
          <Text>{formatNumDynDecimal(itemObj["inwReward"], 6)} INW</Text>
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
