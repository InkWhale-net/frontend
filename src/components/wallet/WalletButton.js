import {
  Box,
  Button,
  Circle,
  Collapse,
  Flex,
  Heading,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Square,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import IWCard from "components/card/Card";
import {
  MenuIconBackground,
  MenuIconBorder,
  MyLPFarmsIcon,
  MyNFTFarmsIcon,
  MyPoolsIcon,
} from "components/icons/Icons";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { updateAccountsList } from "redux/slices/walletSlice";
import { addressShortener, formatNumDynDecimal } from "utils";

import AddressCopier from "components/address-copier/AddressCopier";
import { appChain, supportWallets } from "constants";
import { useAppContext } from "contexts/AppContext";
import { useMemo } from "react";
import { isMobile } from "react-device-detect";
import { setCurrentAccount } from "redux/slices/walletSlice";
import { resolveDomain } from "utils";
import WalletModal from "./WalletModal";
import useLongPress from "./useLongPress";

export default function WalletButton({ onCloseSidebar }) {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentAccount, allAccounts } = useSelector((state) => state.wallet);

  const loadListAccount = async () => {};
  useEffect(() => {
    if (currentAccount) {
      loadListAccount();
    } else dispatch(updateAccountsList([]));
  }, [currentAccount]);

  const onClickSwitch = async () => {
    if (currentAccount && allAccounts?.length > 1) onOpen();
  };

  return (
    <>
      <WalletModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

      {!currentAccount ? (
        <WalletNotConnect onClose={onCloseSidebar} />
      ) : (
        <WalletConnect onClose={onCloseSidebar} onClickSwitch={onClickSwitch} />
      )}
    </>
  );
}

const WalletNotConnect = ({ onClose }) => {
  const { walletConnectHandler } = useAppContext();
  const dispatch = useDispatch();
  const { isOpen, onToggle } = useDisclosure();
  const [showDetailMenu, setShowDetailMenu] = useState(false);
  const clearCache = async () => {
    // try {
    await caches.keys().then(async (names) => {
      await Promise.all(names.map((name) => caches.delete(name)));
    });
    await window.location.reload();
    // } catch (error) {
    //   toast.error("Can not clear cache");
    // }
  };
  const backspaceLongPress = useLongPress(() => setShowDetailMenu(true), 4000);

  const connectWallet = async (ext) => {
    if (onClose) onClose();
    const accounts = await walletConnectHandler(ext);
    if (accounts?.length > 0) {
      dispatch(updateAccountsList(accounts));
      dispatch(setCurrentAccount(accounts[0]));
      localStorage.setItem("localCurrentAccount", JSON.stringify(accounts[0]));
    }
  };

  if (isMobile)
    return (
      <Box w="full">
        <Button
          w="full"
          onClick={() => {
            onToggle();
            setShowDetailMenu(false);
          }}
          {...backspaceLongPress}
        >
          <Text>Connect Wallet</Text>
        </Button>
        <Collapse in={showDetailMenu} animateOpacity>
          <Button
            w="full"
            variant="outline"
            mt="8px"
            onClick={() => clearCache()}
          >
            Empty cache
          </Button>
        </Collapse>
        <Collapse in={isOpen} animateOpacity>
          <Box color="white" mt="8px" mb="60px">
            {supportWallets.map((item, idx) => (
              <IWCard
                key={idx}
                mb="4px"
                px="-24px"
                alignItems={{ base: "start" }}
                cursor="pointer"
                variant="menuBlank"
                minW={{ base: "full", lg: "180px" }}
                border="1px solid rgba(0, 0, 0, 0.1)"
              >
                <Flex
                  w="full"
                  mt="-6px"
                  justify={{ base: "start" }}
                  alignItems={{ base: "center" }}
                  onClick={() => connectWallet(item)}
                >
                  <Circle
                    w="44px"
                    h="44px"
                    borderWidth="1px"
                    borderColor="border"
                    bg="white"
                  >
                    <Image w="26px" h="26px" alt={item.name} src={item.icon} />
                  </Circle>
                  <Heading as="h5" size="h5" ml="10px">
                    {item.name}
                  </Heading>
                </Flex>
              </IWCard>
            ))}
          </Box>
        </Collapse>
      </Box>
    );
  return (
    <Menu placement="bottom-end">
      <MenuButton
        p="0px"
        w="full"
        as={Button}
        minW={{ base: "full", lg: "170px" }}
      >
        Connect Wallet
      </MenuButton>
      <MenuList
        p="0px"
        m="0px"
        border="none"
        borderRadius="10px"
        boxShadow="0px 10px 21px rgba(0, 0, 0, 0.08)"
      >
        <Flex flexDirection="column" p="20px">
          {supportWallets
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
            ))}
        </Flex>
      </MenuList>
    </Menu>
  );
};

export const WalletConnect = ({ onClose, onClickSwitch }) => {
  const history = useHistory();
  const location = useLocation();
  const [domain, setDomain] = useState(null);
  const { currentAccount, allAccounts } = useSelector((state) => state.wallet);
  const { walletDisconnectHandler } = useAppContext();
  
  useEffect(() => {
    resolveDomain(currentAccount?.address).then((domainValue) =>
      setDomain(domainValue)
    );
  }, [currentAccount?.address]);

  const currentWallet = useMemo(() => {
    if (currentAccount) {
      return supportWallets.find(
        (e) => e?.extensionName == currentAccount?.meta?.source
      );
    }
  }, [allAccounts]);
  
  return (
    <Menu placement="bottom-end">
      <MenuButton p="0px">
        <Flex w="full" alignItems="center" minW={{ base: "full", lg: "170px" }}>
          <Circle
            w="44px"
            h="44px"
            borderWidth="1px"
            bg="transparent"
            borderColor="border"
          >
            <Image
              w="26px"
              h="26px"
              src={currentWallet?.icon}
              alt={currentWallet?.meta?.source}
            />
          </Circle>
          <Heading w="full" as="h5" size="h5" ml="10px">
            {domain || addressShortener(currentAccount?.address)}
          </Heading>
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
          <IWCard mb="12px" variant="menu" minW={{ base: "full", lg: "350px" }}>
            <Flex justify={{ base: "space-between" }}>
              <Text>Address</Text>

              <Heading as="h4" size="h4">
                <AddressCopier address={currentAccount?.address} />
              </Heading>
            </Flex>
          </IWCard>

          {[
            {
              title: `${appChain?.unit} Balance`,
              content: currentAccount?.balance?.azero,
            },
            {
              title: "INW Balance",
              content: formatNumDynDecimal(
                currentAccount?.balance?.inw?.replaceAll(",", "")
              ),
            },
            appChain?.haveINW2 && {
              title: "INW V2 Balance",
              content: formatNumDynDecimal(
                currentAccount?.balance?.inw2?.replaceAll(",", "")
              ),
            },
          ]
            .filter((e) => e)
            .map(({ title, content }, idx) => {
              return (
                <IWCard
                  key={idx}
                  mb="12px"
                  variant="menu"
                  minW={{ base: "full", lg: "350px" }}
                >
                  <Flex justify={{ base: "space-between" }}>
                    <Text>{title}</Text>

                    <Heading as="h4" size="h4">
                      {content}
                    </Heading>
                  </Flex>
                </IWCard>
              );
            })}

          <Flex
            w="full"
            mt={{ base: "12px" }}
            mb={{ base: "24px" }}
            justifyContent="space-between"
          >
            {myMenuList.map((item, idx) => (
              <MenuItem
                _focus={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
                _hover={{ bg: "transparent" }}
                px="8px"
                key={idx}
                alignItems="start"
                width={{ base: "33%" }}
                onClick={() => {
                  history.push(`/my-pools?section=${item?.id}`);
                  if (onClose) onClose();
                }}
              >
                <MenuCardIcon {...item} />
              </MenuItem>
            ))}
          </Flex>
          {allAccounts?.length > 1 && (
            <Button
              sx={{
                mb: "8px",
              }}
              w="full"
              variant="outline"
              onClick={() => {
                onClickSwitch();
              }}
            >
              Switch Account
            </Button>
          )}

          <Button
            w="full"
            variant="outline"
            onClick={() => {
              walletDisconnectHandler();
              if (location?.pathname === "/my-pools") {
                history.push("/acquire-inw");
              }
            }}
          >
            Log out
          </Button>
        </Flex>
      </MenuList>
    </Menu>
  );
};

// TODO: Move to separate component
const MenuCardIcon = ({
  title,
  icon,
  color,
  borderColor,
  borderColorHover,
  bgColor,
  bgColorHover,
  iconColor,
  iconColorHover,
  ...rest
}) => {
  return (
    <Box
      w="full"
      cursor="pointer"
      textAlign="center"
      id="menu-card-icon"
      transition=".25s all ease;"
      {...rest}
    >
      <Flex w="full" alignItems="center" justifyContent="center">
        <Box
          id="card-wrapper"
          width={{ base: "62px" }}
          height={{ base: "62px" }}
          position={"relative"}
        >
          <MenuIconBorder
            color={borderColor}
            sx={{
              "#card-wrapper:hover &": {
                color: borderColorHover,
              },
            }}
          />
          <MenuIconBackground
            zIndex="0"
            top="0px"
            left="0px"
            width={{ base: "62px" }}
            height={{ base: "62px" }}
            position={"absolute"}
            color={bgColor}
            sx={{
              "#card-wrapper:hover &": {
                color: bgColorHover,
              },
            }}
          />
          <Square
            top="0%"
            left="0%"
            width={{ base: "62px" }}
            height={{ base: "62px" }}
            position={"absolute"}
            color={iconColor}
            sx={{
              "#card-wrapper:hover &": {
                color: iconColorHover,
              },
            }}
          >
            {icon}
          </Square>
        </Box>
      </Flex>
      <Text
        color="text.1"
        fontSize="15px"
        lineHeight="19px"
        mt={{ base: "6px" }}
      >
        {title}
      </Text>
    </Box>
  );
};

const myMenuList = [
  {
    borderColor: "#93F0F5",
    borderColorHover: "#0000",
    bgColor: "#E8FDFF",
    bgColorHover: "#93F0F5",
    iconColor: "#6CE5ED",
    iconColorHover: "#57527E",
    icon: <MyLPFarmsIcon />,
    title: "My Tokens",
    href: "/my-pools",
    id: "token",
  },
  {
    borderColor: "#93F0F5",
    borderColorHover: "#0000",
    bgColor: "#E8FDFF",
    bgColorHover: "#93F0F5",
    iconColor: "#6CE5ED",
    iconColorHover: "#57527E",
    icon: <MyPoolsIcon />,
    title: "My Pools",
    href: "/my-pools",
    id: "pools",
  },
  {
    borderColor: "#93F0F5",
    borderColorHover: "#0000",
    bgColor: "#E8FDFF",
    bgColorHover: "#93F0F5",
    iconColor: "#6CE5ED",
    iconColorHover: "#57527E",
    icon: <MyNFTFarmsIcon />,
    title: "My Balances",
    href: "/my-pools",
    id: "balance",
  },
  // {
  //   borderColor: "#93F0F5",
  //   borderColorHover: "#0000",
  //   bgColor: "#E8FDFF",
  //   bgColorHover: "#93F0F5",
  //   iconColor: "#6CE5ED",
  //   iconColorHover: "#57527E",
  //   icon: <MyNFTFarmsIcon />,
  //   title: "My NFT Pools",
  //   href: "/my-pool",
  //   id: "farms",
  // },
];
