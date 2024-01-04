import {
  Box,
  Flex,
  Image,
  Menu,
  MenuButton,
  MenuList,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useChainContext } from "contexts/ChainContext";
import { supportedChain } from "constants";

const ChainButton = () => {
  const { currentChain, switchChain } = useChainContext();
  const { isOpen, onToggle } = useDisclosure();
  return (
    <Menu placement="bottom-end" isOpen={isOpen}>
      <MenuButton onClick={() => onToggle()}>
        <Box
          sx={{
            h: "52px",
            w: "52px",
            display: "flex",
            aspectRatio: 1,
            justifyContent: "center",
            alignItems: "center",
            border: "2px solid #93F0F5",
            mr: "4px",
            borderRadius: "4px",
          }}
        >
          <Image
            sx={{ w: "28px", height: "28px" }}
            src={currentChain?.icon}
            alt="logo-chain"
          />
        </Box>
      </MenuButton>
      <MenuList
        p="0px"
        m="0px"
        border="none"
        borderRadius="10px"
        boxShadow="0px 10px 21px rgba(0, 0, 0, 0.08)"
      >
        <Flex flexDirection="column" p="20px">
          <Text sx={{ fontWeight: "bold" }}>Select chain</Text>
          {supportedChain.map((obj, index) => (
            <Flex
              sx={{
                py: "4px",
                px: "8px",
                cursor: "pointer",
                userSelect: "none",
                borderRadius: "4px",
              }}
              _hover={{
                bg: "#E8FDFF",
              }}
              onClick={() => {
                window.open(obj?.url || "", "_blank");
              }}
            >
              <Image
                src={obj.icon}
                sx={{ w: "28px", height: "28px" }}
                alt={`logo-chain-${obj.key}`}
              />
              <Text
                sx={{
                  marginLeft: "4px",
                }}
              >
                {obj.name}
              </Text>
            </Flex>
          ))}
          {/* {supportWallets
            .filter((el) => !el.isMobile)
            .map((item, idx) => (
              <IWCard
                key={idx}
                mb="0px"
                px="-24px"
                alignItems={{ base: "start" }}
                cursor="pointer"
                variant="menuBlank"
                minW={{ base: "full", lg: "180px" }}
              >
                <Flex
                  w="full"
                  mt="-6px"
                  justify={{ base: "start" }}
                  alignItems={{ base: "center" }}
                  onClick={() => connectWallet(item)}
                >
                  <MenuItem
                    pl="0"
                    mt="-6px"
                    justifyContent="start"
                    _active={{ bg: "transparent" }}
                    _focus={{ bg: "transparent" }}
                  >
                    <Circle
                      w="44px"
                      h="44px"
                      borderWidth="1px"
                      borderColor="border"
                      bg="white"
                    >
                      <Image
                        w="26px"
                        h="26px"
                        alt={item.name}
                        src={item.icon}
                      />
                    </Circle>
                    <Heading as="h5" size="h5" ml="10px">
                      {item.name}
                    </Heading>
                  </MenuItem>
                </Flex>
              </IWCard>
            ))} */}
        </Flex>
      </MenuList>
    </Menu>
  );
};

export default ChainButton;
