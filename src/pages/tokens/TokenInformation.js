import { Stack } from "@chakra-ui/react";

import AddressCopier from "components/address-copier/AddressCopier";
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
        title={tokenInfo?.name || ""}
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
