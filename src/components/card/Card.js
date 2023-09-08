import { QuestionOutlineIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Heading,
  Hide,
  HStack,
  Show,
  Square,
  Stack,
  Text,
  Tooltip,
  useStyleConfig,
} from "@chakra-ui/react";
import AddressCopier from "components/address-copier/AddressCopier";
import ImageCloudFlare from "components/image-cf/ImageCF";
import { formatDataCellTable } from "components/table/IWPaginationTable";
import CardSocial from "./CardSocial";

export default function IWCard(props) {
  const { variant, title, children, ...rest } = props;
  const styles = useStyleConfig("IWCard", { variant });
  // const tabsStyles = useStyleConfig("Tabs", { variant });

  return (
    <Box id="iw-card" __css={styles} {...rest}>
      {title && (
        <Heading as="h4" size="h4" lineHeight="25px">
          {title}
        </Heading>
      )}
      <Box
        mt="14px"
        pt="0px"
        borderTop={!title ? "" : "1px solid #E3DFF3"}
        w="full"
      >
        {children}
      </Box>
    </Box>
  );
}

export function BannerCard({ cardData, mode }) {
  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column" }}
    >
      <IWCard
        mt="16px"
        w="full"
        variant="solid"
        border="1px solid #E3DFF3"
        bg="bg.1"
      >
        <Flex
          minH="70px"
          flexDirection={{ base: "column", lg: "row" }}
          justifyContent={{ base: "space-between" }}
        >
          {cardData?.cardHeaderList?.map((item) => {
            const { name, hasTooltip, label, tooltipContent } = item;

            return (
              <Flex
                mt={{ base: "15px", lg: "0px" }}
                w="full"
                key={name}
                justifyContent="center"
                flexDirection={{ base: "row", lg: "column" }}
              >
                <Flex
                  w={{ base: "45%", lg: "full" }}
                  color="text.2"
                  fontWeight="400"
                  fontSize="16px"
                  lineHeight="28px"
                  alignItems="center"
                >
                  {label}
                  {hasTooltip && (
                    <Tooltip fontSize="md" label={tooltipContent}>
                      <QuestionOutlineIcon ml="6px" color="text.2" />
                    </Tooltip>
                  )}
                </Flex>

                <Flex
                  minW={{
                    base: "55%",
                    lg: name === "nftInfo" ? "320px" : "full",
                  }}
                  color="text.1"
                  fontWeight="600"
                  lineHeight="28px"
                  justify={{ base: "start" }}
                  alignItems={{ base: "center" }}
                  w={{ base: "55%", lg: "full" }}
                  fontSize={{ base: "16px", lg: "20px" }}
                >
                  <Text>
                    {formatDataCellTable(cardData?.cardValue, name, mode)}
                  </Text>
                </Flex>
              </Flex>
            );
          })}
        </Flex>
      </IWCard>
    </Stack>
  );
}

export function NFTBannerCard({ cardData, nftInfo }) {
  return (
    <IWCard
      w="full"
      mb={{ base: "24px", lg: "30px" }}
      pt={{ lg: "10px" }}
      pb={{ lg: "24px" }}
    >
      <Flex flexDirection={{ base: "column", md: "row" }}>
        <Square
          mr={{ lg: "24px" }}
          maxW={{ base: "300px", sm: "320px", lg: "160" }}
          maxH={{ base: "300px", sm: "320px", lg: "160" }}
          borderRadius="10px"
          overflow="hidden"
        >
          <ImageCloudFlare
            borderWidth="1px"
            w="full"
            h="full"
            size="500"
            alt={nftInfo?.name}
            borderRadius="5px"
            src={nftInfo?.avatarImage}
          />
        </Square>

        <Stack w="full" alignItems="start">
          <HStack alignItems="center" justifyContent="space-between" w="full">
            <Heading as="h2" size="h2" lineHeight="38px">
              {nftInfo?.name}{" "}
            </Heading>

            {/* Big screen card */}
            <Show above="md">
              <CardSocial
                twitterUrl={nftInfo?.twitter}
                discordUrl={nftInfo?.discord}
                telegramUrl={nftInfo?.telegram}
              />
            </Show>
          </HStack>

          <HStack justifyContent={{ base: "start" }} w="full">
            <Heading as="h4" size="h4" fontWeight="600" lineHeight="25px">
              <AddressCopier address={nftInfo?.nftContractAddress} />
            </Heading>
          </HStack>

          {/* Small screen card */}
          <Hide above="md">
            <CardSocial
              twitterUrl={nftInfo?.twitter}
              discordUrl={nftInfo?.discord}
              telegramUrl={nftInfo?.telegram}
            />
          </Hide>

          <HStack
            justifyContent="space-between"
            w="full"
            pb={{ base: "24px", lg: "0px" }}
          >
            <Flex
              w="full"
              minH="70px"
              flexDirection={{ base: "column", lg: "row" }}
              justifyContent={{ base: "space-between" }}
            >
              {cardData?.cardHeaderList?.map(
                ({ name, hasTooltip, label, tooltipContent }) => {
                  return name === "myStake" ? null : (
                    <Flex
                      key={name}
                      w={{ lg: "fit-content" }}
                      justifyContent="center"
                      mt={{ base: "15px", lg: "0px" }}
                      flexDirection={{ base: "column", lg: "column" }}
                    >
                      <Flex
                        w={{ base: "full" }}
                        color="text.2"
                        fontWeight="400"
                        fontSize="16px"
                        lineHeight="28px"
                        alignItems="center"
                      >
                        {label}
                        {hasTooltip && (
                          <Tooltip fontSize="md" label={tooltipContent}>
                            <QuestionOutlineIcon ml="6px" color="text.2" />
                          </Tooltip>
                        )}
                      </Flex>

                      <Flex
                        w={{ base: "full" }}
                        color="text.1"
                        fontWeight="600"
                        fontSize={{ base: "16px", lg: "20px" }}
                        lineHeight="28px"
                        justify={{ base: "start" }}
                        alignItems={{ base: "center" }}
                      >
                        <Text> {cardData?.cardValue[name]}</Text>{" "}
                      </Flex>
                    </Flex>
                  );
                }
              )}
            </Flex>
          </HStack>
        </Stack>
      </Flex>
    </IWCard>
  );
}
