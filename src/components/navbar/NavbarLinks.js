import {
  Flex,
  Link,
  Text,
  Show,
  Menu,
  MenuButton,
  MenuList,
  Heading,
  MenuItem,
  Box,
} from "@chakra-ui/react";
import IWCard from "components/card/Card";

import { SidebarResponsive } from "components/sidebar/Sidebar";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import routes from "routes.js";
import WalletButton from "components/wallet/WalletButton";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { INWSwap } from "components/INWSwap";
import ChainButton from "components/wallet/ChainButton";

export default function NavbarLinks(props) {
  const { secondary } = props;

  const [currentAnchor, setCurrentAnchor] = useState("");
  const currentAccount = useSelector((s) => s.wallet.currentAccount);

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
    <Flex
      w={{ sm: "100%", md: "auto" }}
      alignItems="center"
      flexDirection="row"
      justifyContent="end"
      bg="transparent"
      flexWrap={secondary ? { base: "wrap", md: "nowrap" } : "unset"}
    >
      <SidebarResponsive routes={routes} />

      <Show above="md">
        <Flex bg="transparent">
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
          {menuListData?.map(({ title, href }) => (
            <Flex
              _hover={{ textDecoration: "none", bg: "bg.1" }}
              p="6px 10px"
              bg={
                (!currentAnchor && href === "#hero") || currentAnchor === href
                  ? "bg.1"
                  : "transparent"
              }
              borderRadius="5px"
              key={title}
              // ml={{ base: "20px", md: "20px" }}
              minW={{ base: null, lg: "80px" }}
            >
              <Link
                to={href}
                as={RouterLink}
                color={"text.1"}
                fontWeight="600"
                bg="transparent"
                textDecoration="none"
                _focus={{ borderWidth: "0px" }}
                _hover={{ textDecoration: "none", bg: "bg.1" }}
                onClick={() => setCurrentAnchor(href)}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text bg="transparent" fontSize="md" textAlign="center">
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
            ]}
          />
          <GroupMenu
            {...groupButtonProps}
            title="Pools"
            path="/pools"
            data={[
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
            // ml={{ base: "20px", md: "20px" }}
            minW={{ base: "0px", lg: "72px" }}
            justify={{ base: "normal", lg: "center" }}
          >
            <Link
              color={"text.1"}
              fontWeight="600"
              bg="transparent"
              textDecoration="none"
              _focus={{ borderWidth: "0px" }}
              _hover={{ textDecoration: "none", bg: "bg.1" }}
              onClick={() =>
                window.open("https://docs.inkwhale.net/", "_blank")
              }
              display="flex"
              alignItems="center"
            >
              <Text bg="transparent" fontSize="md">
                Docs
              </Text>
            </Link>
          </Flex>
        </Flex>
        <INWSwap />
      </Show>

      <Show above="md">
        <Flex>
          <ChainButton />
          <WalletButton />
        </Flex>
      </Show>
    </Flex>
  );
}

NavbarLinks.propTypes = {
  variant: PropTypes.string,
  fixed: PropTypes.bool,
  secondary: PropTypes.bool,
  onOpen: PropTypes.func,
};

export const menuListData = [
  {
    title: "Launchpad",
    href: "/launchpad",
  },
];

export const GroupMenu = ({
  title,
  path,
  data,
  onClose,
  setCurrentAnchor,
  currentAnchor,
}) => {
  return (
    <Menu placement="bottom-end">
      <MenuButton
        p="0px"
        _hover={{ bg: "bg.1" }}
        bg={currentAnchor === path ? "bg.1" : "transparent"}
        borderRadius="5px"
      >
        <Flex
          w="full"
          p="6px 10px"
          borderRadius="5px"
          display="flex"
          justify={{ base: "normal", lg: "center" }}
          minW={{ base: "72px" }}
        >
          <Link color={"text.1"} fontWeight="600" textDecoration="none">
            <Text fontSize="md">{title}</Text>
          </Link>
        </Flex>
      </MenuButton>

      <MenuList
        p="0px"
        m="0px"
        border="none"
        borderRadius="10px"
        boxShadow="0px 10px 21px rgba(0, 0, 0, 0.08)"
      >
        <Flex flexDirection="column" p="20px">
          {data
            ?.map((e) => ({
              ...e,
              onClick: () => {
                if (onClose) onClose();
                setCurrentAnchor(path);
              },
            }))
            .map((item, idx) => (
              <IWCard
                key={idx}
                mb="0px"
                px="-24px"
                alignItems={{ base: "center" }}
                cursor="pointer"
                variant="menuBlank"
                minW={{ base: "full", lg: "180px" }}
              >
                <Link
                  _hover={{ textDecoration: "none" }}
                  to={item?.href}
                  as={item?.href && RouterLink}
                  color={"text.1"}
                  fontWeight="600"
                  bg="transparent"
                  textDecoration="none"
                  _disabled={true}
                  onClick={item?.onClick}
                >
                  <MenuItem
                    _active={{ bg: "transparent" }}
                    _focus={{ bg: "transparent" }}
                  >
                    <Flex
                      w="full"
                      justify={{ base: "start" }}
                      alignItems={{ base: "center" }}
                    >
                      <Heading as="h5" size="h5" ml="10px">
                        {item.label}
                      </Heading>
                    </Flex>
                  </MenuItem>
                </Link>
              </IWCard>
            ))}
        </Flex>
      </MenuList>
    </Menu>
  );
};
