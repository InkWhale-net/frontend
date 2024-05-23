import { Button, Flex, Link, Stack, Text } from "@chakra-ui/react";
import { GroupMenu, menuListData } from "components/navbar/NavbarLinks";

import Brand from "components/sidebar/components/Brand";
import WalletButton from "components/wallet/WalletButton";
import { useSwapV2TokenContext } from "contexts/SwapV2TokenModalContext";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { appChain } from "constants";
import { inwTokenListData } from "components/navbar/NavbarLinks";
import { tokenMenuListData } from "components/navbar/NavbarLinks";
import { poolsMenuListData } from "components/navbar/NavbarLinks";
import { toast } from "react-hot-toast";

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
        {/* {appChain?.allowBuy && ( */}
        <GroupMenu
          {...groupButtonProps}
          title="INW Token"
          path="/inw"
          data={inwTokenListData}
          onClose={onClose}
        />
        {/* )} */}

        <GroupMenu
          {...groupButtonProps}
          title="Token"
          path="/token"
          data={tokenMenuListData}
          onClose={onClose}
        />

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
          title="Pools / Farms "
          path="/pools"
          data={poolsMenuListData}
          onClose={onClose}
        />

        {[
          // {
          //   title: `Stake ${appChain?.unit} `,
          //   href: "/azero-staking",
          // },
        ]?.map(({ title, href }) => (
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

        <Flex
          _hover={{ textDecoration: "none", bg: "bg.1" }}
          p="6px 10px"
          bg={"transparent"}
          borderRadius="5px"
          // ml={{ base: "20px", md: "20px" }}
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
        </Flex>
        <Flex ml="30px" pt="10px" w="full">
          <WalletButton onCloseSidebar={onClose} />
        </Flex>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
