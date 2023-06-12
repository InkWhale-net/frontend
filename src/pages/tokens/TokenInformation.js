import { Box, Image, Stack } from "@chakra-ui/react";

import AddressCopier from "components/address-copier/AddressCopier";
import CardThreeColumn from "components/card/CardThreeColumn";
import CardTwoColumn from "components/card/CardTwoColumn";
const TokenInformation = ({ tokenInfo }) => {
  return (
    <Stack
      w="full"
      spacing="30px"
      alignItems="start"
      direction={{ base: "column", lg: "row" }}
    >
      <CardTwoColumn
        w={{ base: "full" }}
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {tokenInfo?.tokenIconUrl && (
              <Image
                mr="8px"
                h="42px"
                w="42px"
                borderRadius={"10px"}
                src={`${process.env.REACT_APP_IPFS_PUBLIC_URL}${tokenInfo?.tokenIconUrl}`}
                alt="logo"
              />
            )}
            {tokenInfo?.name}
          </Box>
        }
        data={[
          tokenInfo?.title && {
            title: "Token Symbol",
            content: tokenInfo?.title,
          },
          tokenInfo?.totalSupply && {
            title: "Total supply",
            content: tokenInfo?.totalSupply,
          },
          tokenInfo?.decimals && {
            title: "Decimals",
            content: tokenInfo?.decimals,
          },
          tokenInfo?.owner && {
            title: "Owner",
            content: <AddressCopier address={tokenInfo?.owner} />,
          },
        ].filter((e) => !!e)}
      />
    </Stack>
  );
};

export default TokenInformation;
