import { Flex, Stack, Link, Text } from "@chakra-ui/react";
import { INWSwap } from "components/INWSwap";
import { TokenMenuDropdown } from "components/navbar/NavbarLinks";
import { StakeMenuDropdown } from "components/navbar/NavbarLinks";
import { CreateMenuDropdown } from "components/navbar/NavbarLinks";
import { menuListData } from "components/navbar/NavbarLinks";

import Brand from "components/sidebar/components/Brand";
import WalletButton from "components/wallet/WalletButton";
import { useSwapV2TokenContext } from "contexts/SwapV2TokenModalContext";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

function SidebarContent({ onClose }) {
  const [currentAnchor, setCurrentAnchor] = useState("");
  const currentAccount = useSelector((s) => s.wallet.currentAccount);
  const { openSwapModal } = useSwapV2TokenContext();

  useEffect(() => {
    const href = window.location.href;
    const index = href.indexOf("#");
    const length = href.length;

    const shortenUrl = href.slice(index, length);

    shortenUrl === "#/"
      ? setCurrentAnchor("")
      : setCurrentAnchor(shortenUrl.replace("/", ""));
  }, []);

  return (
    <Flex direction="column" height="100%" pt="25px" borderRadius="30px">
      <Brand />

      <Stack
        direction="column"
        alignItems={"start"}
        mb="auto"
        mt="8px"
        px="20px"
      >
        {menuListData?.map(({ title, href }) => (
          <Flex
            w={"full"}
            p="6px 10px"
            bg={
              (!currentAnchor && href === "#hero") || currentAnchor === href
                ? "bg.1"
                : "transparent"
            }
            borderRadius="5px"
            key={title}
            ml={{ base: "0px", md: "20px" }}
          >
            <Link
              to={href}
              as={RouterLink}
              onClick={() => {
                onClose();
                setCurrentAnchor(href);
              }}
              bg="transparent"
              textDecoration="none"
              fontWeight="600"
              color={"text.1"}
              href={href}
            >
              <Text bg="transparent" fontSize="md">
                {title}
              </Text>
            </Link>
          </Flex>
        ))}

        {/* {!currentAccount ? null : (
          <Flex
            _hover={{ textDecoration: "none", bg: "bg.1" }}
            p="6px 10px"
            bg={currentAnchor === "/account" ? "bg.1" : "transparent"}
            borderRadius="5px"
            ml={{ base: "20px", md: "20px" }}
          >
            <Link
              to="/account"
              as={RouterLink}
              color={"text.1"}
              fontWeight="600"
              bg="transparent"
              textDecoration="none"
              _hover={{ textDecoration: "none", bg: "bg.1" }}
              onClick={() => setCurrentAnchor('"/account"')}
            >
              <Text bg="transparent" fontSize="md">
                My Account
              </Text>
            </Link>
          </Flex>
        )} */}
        <TokenMenuDropdown
          onClose={onClose}
          setCurrentAnchor={setCurrentAnchor}
          currentAnchor={currentAnchor}
        />
        <StakeMenuDropdown
          onClose={onClose}
          setCurrentAnchor={setCurrentAnchor}
          currentAnchor={currentAnchor}
        />
        <CreateMenuDropdown onClose={onClose} />
        {/* <Flex
          _hover={{ textDecoration: "none", bg: "bg.1" }}
          p="6px 10px"
          bg={"transparent"}
          borderRadius="5px"
          ml={{ base: "20px", md: "20px" }}
        >
          <Link
            color={"text.1"}
            fontWeight="600"
            bg="transparent"
            textDecoration="none"
            _focus={{ borderWidth: "0px" }}
            _hover={{ textDecoration: "none", bg: "bg.1" }}
            onClick={() => toast.success("Coming soon!")}
          >
            <Text bg="transparent" fontSize="md">
              Launchpad
            </Text>
          </Link>
        </Flex> */}
        <Flex
          _hover={{ textDecoration: "none", bg: "bg.1" }}
          p="6px 10px"
          bg={"transparent"}
          borderRadius="5px"
          ml={{ base: "20px", md: "20px" }}
        >
          <Link
            color={"text.1"}
            fontWeight="600"
            bg="transparent"
            textDecoration="none"
            _focus={{ borderWidth: "0px" }}
            _hover={{ textDecoration: "none", bg: "bg.1" }}
            onClick={() => toast.success("Coming soon!")}
          >
            <Text bg="transparent" fontSize="md">
              Orderbook Dex
            </Text>
          </Link>
        </Flex>
        <Flex
          _hover={{ textDecoration: "none", bg: "bg.1" }}
          p="6px 10px"
          bg={"transparent"}
          borderRadius="5px"
          ml={{ base: "20px", md: "20px" }}
        >
          <Link
            color={"text.1"}
            fontWeight="600"
            bg="transparent"
            textDecoration="none"
            _focus={{ borderWidth: "0px" }}
            _hover={{ textDecoration: "none", bg: "bg.1" }}
            onClick={() => window.open("https://docs.inkwhale.net/", "_blank")}
          >
            <Text bg="transparent" fontSize="md">
              Docs
            </Text>
          </Link>
        </Flex>
        {isMobile && (
          <Flex
            _hover={{ textDecoration: "none", bg: "bg.1" }}
            p="6px 10px"
            bg={"transparent"}
            borderRadius="5px"
            ml={{ base: "20px", md: "20px" }}
          >
            <Link
              color={"text.1"}
              fontWeight="600"
              bg="transparent"
              textDecoration="none"
              _focus={{ borderWidth: "0px" }}
              _hover={{ textDecoration: "none", bg: "bg.1" }}
              onClick={() => {
                if (onClose) onClose();
                openSwapModal();
              }}
            >
              <Text bg="transparent" fontSize="md">
                Swap
              </Text>
            </Link>
          </Flex>
        )}
        <Flex ml="30px" pt="10px" w="full">
          <WalletButton onCloseSidebar={onClose} />
        </Flex>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
