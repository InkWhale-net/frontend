import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
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
import { Fragment } from "react";
import FadeIn from "react-fade-in/lib/FadeIn";
import { useHistory, useLocation } from "react-router-dom";
import { formatDataCellTable as formatDataCellTableNew } from "./IWPaginationTable";

const getStatusPool = (startTime, duration) => {
  if (startTime + duration * 1000 < new Date()) {
    return "Pool ended!";
  }
  return startTime < new Date() ? "Pool live!" : "Upcoming";
};

export function IWTable({
  tableHeader,
  tableBody,
  mode,
  loading,
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
                                {formatDataCellTableNew(itemObj, i?.name, mode)}
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
    </TableContainer>
  );
}

// export const formatDataCellTable = (itemObj, header, mode) => {
//   switch (header) {
//     case "totalStaked":
//       const extPart = `NFT${itemObj[header] > 1 ? "s" : ""}`;
//       return (
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Text>
//             {mode == "NFT_FARM"
//               ? itemObj[header]
//               : mode === "TOKEN_FARM"
//               ? formatNumDynDecimal(
//                   formatTokenAmount(itemObj[header], itemObj?.lptokenDecimal)
//                 )
//               : formatNumDynDecimal(
//                   formatTokenAmount(itemObj[header], itemObj?.tokenDecimal)
//                 )}{" "}
//             {itemObj["NFTtokenContract"] && extPart}
//           </Text>
//           {itemObj?.hasTooltip}
//         </Box>
//       );

//     case "multiplier":
//       return mode === "TOKEN_FARM" ? (
//         <Text>{itemObj[header]?.toFixed(2)}</Text>
//       ) : mode === "NFT_FARM" ? (
//         // <Text>{(itemObj[header] / 10 ** 12).toFixed(2)}</Text>
//         <Text>
//           {formatNumDynDecimal(
//             formatTokenAmount(itemObj[header], itemObj?.tokenDecimal)
//           )}
//         </Text>
//       ) : (
//         <></>
//       );

//     case "rewardPool":
//       return (
//         <>
//           <Text>{formatNumDynDecimal(itemObj[header])}</Text>
//         </>
//       );

//     case "startTime":
//       return (
//         <>
//           <IWCountDown
//             date={
//               itemObj[header] < new Date()
//                 ? itemObj[header] + itemObj["duration"] * 1000
//                 : itemObj[header]
//             }
//           />
//         </>
//       );

//     case "status":
//       return (
//         <>
//           <Text>
//             {getStatusPool(itemObj["startTime"], itemObj["duration"])}
//           </Text>
//         </>
//       );

//     case "apy":
//       return (
//         <>
//           <Text>{itemObj[header] / 100}%</Text>
//         </>
//       );

//     case "poolName":
//       return (
//         <>
//           <Flex
//             w="full"
//             justify={{ base: "start" }}
//             alignItems={{ base: "center" }}
//           >
//             <Circle w="30px" h="30px" bg="white">
//               <Image src={itemObj["poolLogo"]} alt="logo-subwallet" />
//             </Circle>

//             <Text ml="8px">{itemObj[header]}</Text>
//           </Flex>
//         </>
//       );

//     case "nftInfo":
//       return (
//         <>
//           <Flex
//             w="full"
//             justify={{ base: "start" }}
//             alignItems={{ base: "center" }}
//           >
//             <ImageCloudFlare
//               borderWidth="1px"
//               w="40px"
//               h="40px"
//               size="500"
//               alt={header}
//               borderRadius="5px"
//               src={itemObj[header]?.avatarImage}
//             />
//             <Text ml="8px">{itemObj[header]?.name}</Text>
//           </Flex>
//         </>
//       );

//     case "poolNameNFT":
//       return (
//         <>
//           <Flex
//             w="full"
//             justify={{ base: "start" }}
//             alignItems={{ base: "center" }}
//           >
//             <Circle w="30px" h="30px" bg="white">
//               <Image src={itemObj["poolLogo"]} alt="logo-subwallet" />
//             </Circle>

//             <Text ml="8px">{itemObj[header]}</Text>
//           </Flex>
//         </>
//       );

//     case "stakeInfo":
//       const numberStakeInfo =
//         itemObj[header] &&
//         formatNumDynDecimal(
//           formatTokenAmount(
//             itemObj[header].stakedValue,
//             mode === "TOKEN_FARM"
//               ? itemObj?.lptokenDecimal
//               : itemObj?.tokenDecimal
//           )
//         );

//       const numberNFTStakeInfo =
//         itemObj[header] && formatNumDynDecimal(itemObj[header].stakedValue);
//       return (
//         <>
//           {itemObj[header] ? (
//             itemObj["NFTtokenContract"] ? (
//               <Flex alignItems="center">
//                 <Text mr="8px">{numberNFTStakeInfo}</Text>
//                 <GoStar color="#FFB800" />
//               </Flex>
//             ) : (
//               parseFloat(numberStakeInfo) > 0 && (
//                 <Flex alignItems="center">
//                   <Text mr="8px">{numberStakeInfo}</Text>
//                   <GoStar color="#FFB800" />
//                 </Flex>
//               )
//             )
//           ) : (
//             ""
//           )}
//         </>
//       );

//     case "myStake":
//       return (
//         <>
//           <Flex alignItems="center">
//             <Text mr="8px">{itemObj[header]}</Text>
//             {itemObj["isMyStake"] && <GoStar color="#FFB800" />}
//           </Flex>
//         </>
//       );

//     case "totalSupply":
//       return (
//         <>
//           <Text>{formatNumDynDecimal(itemObj[header])}</Text>
//         </>
//       );

//     case "duration":
//       return (
//         <>
//           <Text>{itemObj[header] / 86400} days</Text>
//         </>
//       );
//     case "tokenIconUrl":
//       return itemObj[header] ? (
//         <Image
//           w="38px"
//           borderRadius={"10px"}
//           src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${itemObj[header]}`}
//           alt="logo"
//         />
//       ) : (
//         ""
//       );
//     case "name":
//       if (itemObj?.showIcon)
//         return (
//           <>
//             <Flex
//               w="full"
//               justify={{ base: "start" }}
//               alignItems={{ base: "center" }}
//             >
//               <Circle w="30px" h="30px" bg="white">
//                 <Image
//                   w="38px"
//                   borderRadius={"10px"}
//                   src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${itemObj["tokenIconUrl"]}`}
//                   alt="logo"
//                 />
//               </Circle>

//               <Text ml="8px">{itemObj[header]}</Text>
//             </Flex>
//           </>
//         );
//       else return itemObj[header];
//     case "tokenTotalSupply":
//       const tokenTotalSupply = itemObj[header].replaceAll(",", "");
//       return (
//         <>
//           <Text>{formatNumDynDecimal(tokenTotalSupply / 10 ** 12)}</Text>
//         </>
//       );

//     case "contractAddress":
//       return (
//         <>
//           <AddressCopier address={itemObj[header]} />
//         </>
//       );
//     case "tokenSymbol":
//       return (
//         <Flex alignItems={"center"} mr={{ base: "20px" }}>
//           <TokenIcon tokenContract={itemObj["tokenContract"]} />
//           <Text textAlign="left">{itemObj[header]} </Text>
//         </Flex>
//       );
//     case "Earn":
//       return (
//         <Flex alignItems={"center"}>
//           <TokenIcon tokenContract={itemObj["tokenContract"]} />
//           <Text textAlign="left">{itemObj[header]} </Text>
//         </Flex>
//       );
//     case "owner":
//       return (
//         <>
//           <AddressCopier address={itemObj[header]} />
//         </>
//       );

//     case "poolContract":
//       return (
//         <>
//           <AddressCopier address={itemObj[header]} />
//         </>
//       );

//     case "creator":
//       return (
//         <>
//           <AddressCopier address={itemObj[header]} />
//         </>
//       );

//     case "mintTo":
//       return (
//         <>
//           <AddressCopier address={itemObj[header]} />
//         </>
//       );

//     default:
//       return (
//         <>
//           <Text textAlign="left">{itemObj[header]} </Text>
//         </>
//       );
//   }
// };
