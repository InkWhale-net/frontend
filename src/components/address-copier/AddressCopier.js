import { Box, Flex, useClipboard } from "@chakra-ui/react";
import { CopyIcon } from "components/icons/Icons";
import { toast } from "react-hot-toast";
import { addressShortener } from "utils";

export default function AddressCopier({ address, truncated = true }) {
  const { onCopy } = useClipboard(address);

  const handleCopy = () => {
    toast.success("Address copied!");
    onCopy();
  };

  return (
    <Flex
      cursor="pointer"
      alignItems="center"
      onClick={handleCopy}
      _hover={{ color: "text.2" }}
    >
      {truncated ? addressShortener(address) : address}{" "}
      <Box ml="4px" mb="8px" w="20px" h="21px" color="#8C86A5">
        <CopyIcon w="20px" h="21px" />
      </Box>
    </Flex>
  );
}
