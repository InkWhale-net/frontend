import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Circle,
  Flex,
  Image,
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
import IWCountDown from "components/countdown/CountDown";
import { Fragment } from "react";
import { GoStar } from "react-icons/go";
import { useHistory, useLocation } from "react-router-dom";
import { formatNumDynDecimal } from "utils";
import ImageCloudFlare from "components/image-cf/ImageCF";
import { addressShortener } from "utils";
import FadeIn from "react-fade-in/lib/FadeIn";
import InfiniteScroll from "react-infinite-scroll-component";
import AddressCopier from "components/address-copier/AddressCopier";
import TokenIcon from "components/TokenIcon";
import { format } from "utils/datetime";

export function InfiniteTable({
  tableHeader,
  tableBody,
  mode,
  loading,
  getNext,
  hasMore,
  isDisableRowClick = false,
  customURLRowClick = "",
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
      <InfiniteScroll
        dataLength={tableBody?.length}
        next={getNext}
        hasMore={hasMore}
        loader={<h4>Loading</h4>}
      >
        <Table variant="simple">
          <Thead>
            <Tr>
              {tableHeader?.map(
                ({ name, label, hasTooltip, tooltipContent }) => (
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
                )
              )}
            </Tr>
          </Thead>

          <Tbody>
            {loading ? (
              <>
                <Tr>
                  {tableHeader?.map((_, idx) => (
                    <Td p="0" key={idx}>
                      <Skeleton height="60px" />
                    </Td>
                  ))}
                </Tr>
                <Tr>
                  {tableHeader?.map((_, idx) => (
                    <Td p="0" key={idx}>
                      <Skeleton height="60px" />
                    </Td>
                  ))}
                </Tr>
                <Tr>
                  {tableHeader?.map((_, idx) => (
                    <Td p="0" key={idx}>
                      <Skeleton height="60px" />
                    </Td>
                  ))}
                </Tr>
              </>
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
                                  {formatDataCellTable(itemObj, i?.name, mode)}
                                </FadeIn>
                              </Td>
                            );
                          })}
                        </Tr>
                      </Fragment>
                    );
                  })
                )}
              </>
            )}
          </Tbody>
        </Table>
      </InfiniteScroll>
    </TableContainer>
  );
}

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
          <AddressCopier address={itemObj[header]} />
        </>
      );
    case "tokenContract":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );
    case "fromAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );
    case "toAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
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
