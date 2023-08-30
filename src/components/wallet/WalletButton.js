import {
  Box,
  Button,
  Circle,
  Flex,
  Heading,
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
import { addressShortener } from "utils";

import AddressCopier from "components/address-copier/AddressCopier";
import { useAppContext } from "contexts/AppContext";
import { BiWallet } from "react-icons/bi";
import { resolveDomain } from "utils";
import WalletModal from "./WalletModal";

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
        <WalletNotConnect showSelectAccountModal={onOpen} />
      ) : (
        <WalletConnect onClose={onCloseSidebar} onClickSwitch={onClickSwitch} />
      )}
    </>
  );
}

const WalletNotConnect = ({ showSelectAccountModal }) => {
  const { walletConnectHandler } = useAppContext();
  const connectWallet = async () => {
    const accounts = await walletConnectHandler();
    if (accounts?.length > 0) {
      showSelectAccountModal();
    }
  };
  return (
    <Menu placement="bottom-end">
      <Button onClick={() => connectWallet()}>Connect Wallet</Button>
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
            <BiWallet size="24px" />
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
