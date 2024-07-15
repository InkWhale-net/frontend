import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import IconQuestionMark from "assets/img/question-mark.png";
import AddressCopier from "components/address-copier/AddressCopier";
import React from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { formatNumDynDecimal } from "utils";

export const formatDataCellTable = (
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
          objectFit="contain"
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
export const ElementCard = ({
  tableHeader,
  itemObj,
  mode,
  onClickItemHandler,
}) => {
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
