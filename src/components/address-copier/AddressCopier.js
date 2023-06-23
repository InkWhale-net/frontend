import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useClipboard,
} from "@chakra-ui/react";
// import { CopyIcon } from "components/icons/Icons";
import { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { resolveDomain } from "utils";
import { addressShortener } from "utils";
import { ChevronDownIcon, CopyIcon } from "@chakra-ui/icons";

export default function AddressCopier({ address, truncated = true }) {
  const { onCopy } = useClipboard();
  const [azeroID, setAzeroID] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleCopy = (label, text) => {
    toast.success(`${label} copied!`);
    // onCopy(text);
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
              sx={{ display: "flex", flexDirection: "row", fontWeight: "bold" }}
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
        sx={{ fontWeight: "bold" }}
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
