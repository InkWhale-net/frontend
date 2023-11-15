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
              ml={{ base: "20px", md: "20px" }}
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
              >
                <Text bg="transparent" fontSize="md">
                  {title}
                </Text>
              </Link>
            </Flex>
          ))}
          <TokenMenuDropdown
            setCurrentAnchor={setCurrentAnchor}
            currentAnchor={currentAnchor}
          />
          <StakeMenuDropdown
            setCurrentAnchor={setCurrentAnchor}
            currentAnchor={currentAnchor}
          />

          {/* {!currentAccount ? null : (
            <Flex
              _hover={{ textDecoration: "none", bg: "bg.1" }}
              p="6px 10px"
              bg={currentAnchor === "/my-pools" ? "bg.1" : "transparent"}
              borderRadius="5px"
              ml={{ base: "20px", md: "20px" }}
            >
              <Link
                to="/my-pools"
                as={RouterLink}
                color={"text.1"}
                fontWeight="600"
                bg="transparent"
                textDecoration="none"
                _focus={{ borderWidth: "0px" }}
                _hover={{ textDecoration: "none", bg: "bg.1" }}
                onClick={() => setCurrentAnchor("/my-pools")}
              >
                <Text bg="transparent" fontSize="md">
                  My Account
                </Text>
              </Link>
            </Flex>
          )} */}

          <CreateMenuDropdown
            setCurrentAnchor={setCurrentAnchor}
            currentAnchor={currentAnchor}
          />

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
              onClick={() =>
                window.open("https://docs.inkwhale.net/", "_blank")
              }
            >
              <Text bg="transparent" fontSize="md">
                Docs
              </Text>
            </Link>
          </Flex>
        </Flex>
        {/* <INWSwap /> */}
      </Show>

      <Show above="md">
        <Flex ml="30px">
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
    title: "Acquire INW",
    href: "/acquire-inw",
  },
  // {
  //   title: "Azero Staking",
  //   href: "/azero-staking",
  // },
  // {
  //   title: "Launchpad",
  //   href: "/launchpad",
  // },
];

export const CreateMenuDropdown = ({
  onClose,
  setCurrentAnchor,
  currentAnchor,
}) => {
  const history = useHistory();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        p="0px"
        _hover={{ bg: "bg.1" }}
        bg={currentAnchor === "/create" ? "bg.1" : "transparent"}
        borderRadius="5px"
        ml={{ base: "20px", md: "20px" }}
      >
        <Flex w="full" p="6px 10px" borderRadius="5px">
          <Link color={"text.1"} fontWeight="600" textDecoration="none">
            <Text fontSize="md">Create</Text>
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
          {[
            {
              label: "Token",
              onClick: () => {
                if (onClose) onClose();
              },
              href: "/create/token",
            },
            {
              label: "Token Staking Pool",
              href: "/create/stake-pool",
              onClick: () => {
                if (onClose) onClose();
              },
            },
            {
              label: "Token Farming",
              href: "/create/farming",
              onClick: () => {
                if (onClose) onClose();
              },
            },
            {
              label: "NFT Staking Pool",
              onClick: () => {
                if (onClose) onClose();
              },
              href: "/create/nft-lp",
            },
            // {
            //   label: "Launchpad",
            //   onClick: () => {
            //     if (onClose) {
            //       onClose();
            //     }
            //   },
            //   href: "/launchpad/create",
            // },
            // { label: "Token Yield Farm", href: "/create/farming" },
          ].map((item, idx) => (
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

export const StakeMenuDropdown = ({
  onClose,
  setCurrentAnchor,
  currentAnchor,
}) => {
  const history = useHistory();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        p="0px"
        _hover={{ bg: "bg.1" }}
        bg={currentAnchor === "/stake" ? "bg.1" : "transparent"}
        borderRadius="5px"
        ml={{ base: "20px", md: "20px" }}
      >
        <Flex w="full" p="6px 10px" borderRadius="5px">
          <Link color={"text.1"} fontWeight="600" textDecoration="none">
            <Text fontSize="md">Pools</Text>
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
          {[
            {
              label: "Token Pools",
              href: "/pools",
            },
            { label: "Farming", href: "/farming" },
            { label: "NFT Pools", href: "/farms" },
            // { label: "NFT Yield Farm", href: "/create/nft-lp" },
            // { label: "Token Yield Farm", href: "/create/farming" },
          ].map((item, idx) => (
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
                to={item.href}
                as={RouterLink}
                color={"text.1"}
                fontWeight="600"
                bg="transparent"
                textDecoration="none"
                onClick={() => {
                  history.push(item.href);
                  setCurrentAnchor("/pools");
                  if (onClose) onClose();
                }}
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

export const TokenMenuDropdown = ({
  onClose,
  setCurrentAnchor,
  currentAnchor,
}) => {
  const history = useHistory();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        p="0px"
        _hover={{ bg: "bg.1" }}
        bg={currentAnchor === "/create" ? "bg.1" : "transparent"}
        borderRadius="5px"
        ml={{ base: "20px", md: "20px" }}
      >
        <Flex w="full" p="6px 10px" borderRadius="5px">
          <Link color={"text.1"} fontWeight="600" textDecoration="none">
            <Text fontSize="md">Token</Text>
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
          {[
            {
              label: "Interaction",
              onClick: () => {
                if (onClose) onClose();
              },
              href: "/tokens/interaction",
            },
            {
              label: "Transactions",
              href: "/tokens/transaction",
              onClick: () => {
                if (onClose) onClose();
              },
            },
          ].map((item, idx) => (
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
