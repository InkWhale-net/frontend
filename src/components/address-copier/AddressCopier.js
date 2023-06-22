import { Box, Flex, useClipboard } from "@chakra-ui/react";
import { CopyIcon } from "components/icons/Icons";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { resolveDomain } from "utils";
import { addressShortener } from "utils";

export default function AddressCopier({ address, truncated = true }) {
  const { onCopy } = useClipboard(address);
  const [azeroID, setAzeroID] = useState(null);

  const handleCopy = () => {
    toast.success("Address copied!");
    onCopy();
  };
  useEffect(() => {
    resolveDomain(address).then((domains) => {
      setAzeroID(domains);
    });
  }, [address]);

  return (
    <Flex
      cursor="pointer"
      alignItems="center"
      onClick={handleCopy}
      _hover={{ color: "text.2" }}
    >
      {azeroID || (truncated ? addressShortener(address) : address)}
      <Box ml="4px" mb="8px" w="20px" h="21px" color="#8C86A5">
        <CopyIcon w="20px" h="21px" />
      </Box>
    </Flex>
  );
}
