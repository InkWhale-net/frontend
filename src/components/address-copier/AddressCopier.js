import {
  Box,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
// import { CopyIcon } from "components/icons/Icons";
import { CopyIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { addressShortener, resolveDomain } from "utils";

export default function AddressCopier({
  address,
  truncated = true,
  fontWeight,
}) {
  const [azeroID, setAzeroID] = useState(null);

  const handleCopy = (label, text) => {
    toast.success(`${label} copied!`);
    navigator.clipboard.writeText(text);
  };

  useEffect(() => {
    resolveDomain(address).then((domains) => {
      setAzeroID(domains);
    });
  }, [address]);

  if (azeroID)
    return (
      <Menu>
        {({ isOpen }) => (
          <>
            <MenuButton
              isActive={isOpen}
              _hover={{ color: "text.2" }}
              sx={{
                display: "flex",
                flexDirection: "row",
                fontWeight: fontWeight || "bold",
              }}
            >
              {azeroID || (truncated ? addressShortener(address) : address)}{" "}
              <CopyIcon />
            </MenuButton>
            <MenuList>
              <MenuItem
                fontSize={"16px"}
                onClick={() => handleCopy("Azero ID", azeroID)}
              >
                Copy ID
              </MenuItem>
              <MenuItem
                fontSize={"16px"}
                onClick={() => handleCopy("Address", address)}
              >
                Copy address
              </MenuItem>
            </MenuList>
          </>
        )}
      </Menu>
    );
  return (
    <>
      <Flex
        cursor="pointer"
        alignItems="center"
        onClick={() => handleCopy("Address", address)}
        _hover={{ color: "text.2" }}
        sx={{ fontWeight: fontWeight || "bold" }}
      >
        {azeroID || (truncated ? addressShortener(address) : address)}
        <Box ml="4px" mb="8px" w="20px" h="21px" color="#8C86A5">
          <CopyIcon w="20px" h="21px" />
        </Box>
      </Flex>
    </>
  );
}
// sx={{ fontWeight }}
