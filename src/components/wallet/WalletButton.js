import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Square,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { web3Accounts, web3Enable } from "@polkadot/extension-dapp";
import IWCard from "components/card/Card";
import {
  MenuIconBackground,
  MenuIconBorder,
  MyLPFarmsIcon,
  MyNFTFarmsIcon,
  MyPoolsIcon,
} from "components/icons/Icons";
import { supportWallets, toastMessages } from "constants";
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import {
  setCurrentAccount,
  updateAccountsList,
} from "redux/slices/walletSlice";
import { addressShortener } from "utils";

import AzeroSignerLogo from "assets/img/wallet/AzeroSigner.jpg";
import NightlyLogo from "assets/img/wallet/Nightly.jpg";
import PolkadotjsLogo from "assets/img/wallet/PolkadotjsLogo.svg";
import SubWalletLogo from "assets/img/wallet/SubWalletLogo.svg";
import NovaLogo from "assets/img/wallet/nova.jpg";
import AddressCopier from "components/address-copier/AddressCopier";
import { logOutMyPools } from "redux/slices/myPoolsSlice";
import { disconnectCurrentAccount } from "redux/slices/walletSlice";
import { resolveDomain } from "utils";
import WalletModal from "./WalletModal";

export default function WalletButton({
  currentAccountAddress,
  onCloseSidebar,
}) {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentAccount, allAccounts } = useSelector((state) => state.wallet);

  const setWalletExtension = async function () {
    const extension = await web3Enable(process.env.REACT_APP_NAME);

    // no extension installed
    if (extension.length === 0) {
      toast.error(
        <Text>
          {toastMessages.NO_EXTENSION} You may download SubWallet &nbsp;
          <Link
            isExternal
            rel="noreferrer"
            target="_blank"
            href="https://subwallet.app/download.html"
          >
            here{" "}
          </Link>
        </Text>
      );
      return;
    }

    // if any
    const accounts = await web3Accounts();

    dispatch(updateAccountsList(accounts));

    // one account connect only
    if (accounts.length === 1) {
      dispatch(setCurrentAccount(accounts[0]));
      localStorage.setItem("localCurrentAccount", JSON.stringify(accounts[0]));
      return;
    }

    if (!accounts.length) {
      toast.error(toastMessages.NO_ACCOUNT);
      return;
    }

    onOpen();
  };
  const loadListAccount = async () => {
    if (!(allAccounts?.length > 0)) {
      setSelectedWalletExt(currentAccount?.meta?.source);
    }
  };
  useEffect(() => {
    if (currentAccount) {
      loadListAccount();
    } else dispatch(updateAccountsList([]));
  }, [currentAccount]);

  const [selectedWalletExt, setSelectedWalletExt] = useState(null);

  const accountsFiltered = useMemo(() => {
    return allAccounts.filter((i) => i.meta?.source === selectedWalletExt);
  }, [allAccounts, selectedWalletExt]);

  const onClickSwitch = async () => {
    if (currentAccount && allAccounts?.length > 1) onOpen();
  };

  function handleClick(walletExt) {
    if (!walletExt) return toast.error("Wallet Ext error!");
    setSelectedWalletExt(walletExt);

    try {
      // not log any account yet -> open window popup
      if (!currentAccountAddress) {
        setWalletExtension();
        return;
      }
    } catch (error) {
      console.log("@_@ error", error);
    }
  }

  return (
    <>
      <WalletModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        accounts={accountsFiltered}
      />

      {!currentAccount ? (
        <WalletNotConnect onClick={handleClick} />
      ) : (
        <WalletConnect onClose={onCloseSidebar} onClickSwitch={onClickSwitch} />
      )}
    </>
  );
}

const getWallet = (key) => {
  switch (key) {
    case "polkadot":
      return PolkadotjsLogo;
    case "nova":
      return NovaLogo;
    case "subwallet":
      return SubWalletLogo;
    case "Azero Signer":
      return AzeroSignerLogo;
    case "Nightly":
      return NightlyLogo;
    default:
      break;
  }
};

const WalletNotConnect = ({ onClick }) => {
  const [isBigScreen] = useMediaQuery("(min-width: 480px)");

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
            .filter((el) => !(isBigScreen && el.isMobile))
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
                  onClick={() => onClick(item.extensionName)}
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
                        src={getWallet(item.title)}
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
  const dispatch = useDispatch();
  const [domain, setDomain] = useState(null);
  const { currentAccount, allAccounts } = useSelector((state) => state.wallet);
  const walletImage =
    currentAccount?.meta?.source === "polkadot-js"
      ? PolkadotjsLogo
      : currentAccount?.meta?.source === "subwallet-js"
      ? SubWalletLogo
      : currentAccount?.meta?.source === "aleph-zero-signer"
      ? AzeroSignerLogo
      : currentAccount?.meta?.source === "Nightly"
      ? NightlyLogo
      : "";
  useEffect(() => {
    resolveDomain(currentAccount?.address).then((domainValue) =>
      setDomain(domainValue)
    );
  }, [currentAccount?.address]);
  return (
    <Menu placement="bottom-end">
      <MenuButton p="0px">
        <Flex w="full" alignItems="center" minW={{ base: "full", lg: "170px" }}>
          <Circle
            w="44px"
            h="44px"
            bg="transparent"
            borderWidth="1px"
            borderColor="border"
          >
            <Image
              w="26px"
              h="26px"
              src={walletImage}
              alt={currentAccount?.meta?.source}
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
            { title: "AZERO Balance", content: currentAccount?.balance?.azero },
            { title: "INW Balance", content: currentAccount?.balance?.inw },
          ].map(({ title, content }, idx) => {
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

          {/* <IWCard mb="12px" variant="menu" minW={{ base: "full", lg: "350px" }}>
            <Flex justify={{ base: "space-between" }}>
              <Text>Show more Balance</Text>

              <MenuItem
                w="32px"
                h="32px"
                _focus={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
              >
                <Circle
                  cursor="pointer"
                  w="32px"
                  h="32px"
                  bg="bg.5"
                  onClick={() => history.push("/my-pools")}
                >
                  <MenuArrowRightIcon color="text.1" />
                </Circle>
              </MenuItem>
            </Flex>
          </IWCard> */}

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
              dispatch(disconnectCurrentAccount());
              dispatch(logOutMyPools());
              localStorage.removeItem("localCurrentAccount");

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
