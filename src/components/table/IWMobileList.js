import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Circle,
  Flex,
  Grid,
  Image,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import TokenIcon from "components/TokenIcon";
import AddressCopier from "components/address-copier/AddressCopier";
import IWCountDown from "components/countdown/CountDown";
import ImageCloudFlare from "components/image-cf/ImageCF";
import React, { useEffect } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { GoStar } from "react-icons/go";
import { useHistory, useLocation } from "react-router-dom";
import { formatNumDynDecimal } from "utils";

const getStatusPool = (startTime, duration) => {
  if (startTime + duration * 1000 < new Date()) {
    return "Pool ended!";
  }
  return startTime < new Date() ? "Pool live!" : "Upcoming";
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
      }}
      onClick={() => onClickItemHandler(itemObj)}
    >
      <Grid templateColumns="repeat(2, 1fr)" gap={2}>
        {tableHeader.map(
          ({ name, label, hasTooltip, tooltipContent }, index) => {
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
                  <FadeIn>{formatDataCellTable(itemObj, name, mode)}</FadeIn>
                </Box>
              </React.Fragment>
            );
          }
        )}
      </Grid>
    </Box>
  );
};

export function IWMobileList({
  tableHeader,
  tableBody,
  mode,
  loading,
  isDisableRowClick = false,
  customURLRowClick = "",
}) {
  const history = useHistory();
  const location = useLocation();
  const onClickItemHandler = (itemObj) => {
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
  };
  return (
    <Box w={{ base: "full" }}>
      {loading ? null : tableBody?.length === 0 ? (
        <Text textAlign="center" w="full">
          No data found!
        </Text>
      ) : (
        tableBody?.map((itemObj, idx) => {
          return (
            <ElementCard
              tableHeader={tableHeader}
              itemObj={itemObj}
              mode={mode}
              onClickItemHandler={onClickItemHandler}
            />
          );
        })
      )}
    </Box>
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
          <IWCountDown
            date={
              itemObj[header] < new Date()
                ? itemObj[header] + itemObj["duration"] * 1000
                : itemObj[header]
            }
          />
        </>
      );

    case "status":
      return (
        <>
          <Text>
            {getStatusPool(itemObj["startTime"], itemObj["duration"])}
          </Text>
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
    case "tokenTotalSupply":
      const tokenTotalSupply = itemObj[header].replaceAll(",", "");
      return (
        <>
          <Text>{formatNumDynDecimal(tokenTotalSupply / 10 ** 12)}</Text>
        </>
      );

    case "contractAddress":
      return (
        <>
          <AddressCopier address={itemObj[header]} />
        </>
      );
    case "tokenSymbol":
      return (
        <Flex alignItems={"center"} mr={{ base: "20px" }}>
          <TokenIcon tokenContract={itemObj["tokenContract"]} />
          <Text textAlign="left">{itemObj[header]} </Text>
        </Flex>
      );
    case "Earn":
      return (
        <Flex alignItems={"center"}>
          <TokenIcon tokenContract={itemObj["tokenContract"]} />
          <Text textAlign="left">{itemObj[header]} </Text>
        </Flex>
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
          <AddressCopier address={itemObj[header]} />
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