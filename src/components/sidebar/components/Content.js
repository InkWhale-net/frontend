import { Flex, Link, Stack, Text } from "@chakra-ui/react";
import { GroupMenu, menuListData } from "components/navbar/NavbarLinks";

import Brand from "components/sidebar/components/Brand";
import WalletButton from "components/wallet/WalletButton";
import { useSwapV2TokenContext } from "contexts/SwapV2TokenModalContext";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { appChain } from "constants";

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
  const groupButtonProps = { setCurrentAnchor, currentAnchor };
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
        {appChain?.allowBuy && (
          <GroupMenu
            {...groupButtonProps}
            title="INW Token"
            path="/inw"
            data={[
              {
                label: "Claim INW",
                href: "/acquire-inw",
              },
              {
                label: "INW V2",
                href: "/inw-v2",
              },
            ]}
          />
        )}

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
            ml={{ base: "0px" }}
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
        <GroupMenu
          {...groupButtonProps}
          title="Token"
          path="/token"
          data={[
            {
              label: "Interaction",
              href: "/tokens/interaction",
            },
            {
              label: "Transactions",
              href: "/tokens/transaction",
            },
            {
              label: "CommonFi Token Swap",
              href: "/tokens/swap",
            },
          ]}
        />
        <GroupMenu
          {...groupButtonProps}
          title="Pools"
          path="/pools"
          data={[
            {
              label: "AZERO Staking",
              href: "/azero-staking",
            },
            {
              label: "Token Pools",
              href: "/pools",
            },
            { label: "Farming", href: "/farming" },
            { label: "NFT Pools", href: "/farms" },
          ]}
        />
        <GroupMenu
          {...groupButtonProps}
          title="Create"
          path="/create"
          data={[
            {
              label: "Token",
              href: "/create/token",
            },
            {
              label: "Token Staking Pool",
              href: "/create/stake-pool",
            },
            {
              label: "Token Farming",
              href: "/create/farming",
            },
            {
              label: "NFT Staking Pool",
              href: "/create/nft-lp",
            },
          ]}
        />
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
        {isMobile && appChain?.allowSwap && (
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
