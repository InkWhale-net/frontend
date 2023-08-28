import {
  Circle,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import React from "react";

import PolkadotjsLogo from "assets/img/wallet/PolkadotjsLogo.svg";
import SubWalletLogo from "assets/img/wallet/SubWalletLogo.svg";
import { useDispatch } from "react-redux";
import { addressShortener } from "utils";
import { setCurrentAccount } from "redux/slices/walletSlice";
import { SCROLLBAR } from "constants";
import AzeroSignerLogo from "assets/img/wallet/AzeroSigner.jpg";
import NightlyLogo from "assets/img/wallet/Nightly.jpg";

export default function WalletModal({ isOpen, onClose, accounts }) {
  const dispatch = useDispatch();

  function onClickHandler(account) {
    dispatch(setCurrentAccount(account));
    localStorage.setItem("localCurrentAccount", JSON.stringify(account));

    onClose();
  }
  return (
    <>
      <Modal size={"md"} onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent
          borderWidth="0px"
          borderRadius="10px"
          mx={{ base: "4px", lg: "0px" }}
          boxShadow="0px 10px 21px rgba(0, 0, 0, 0.08);"
        >
          <ModalCloseButton />

          <ModalHeader pt="42px" textAlign="center">
            <Heading as="h3" size="h3" textAlign="center">
              Choose account
            </Heading>
          </ModalHeader>

          <ModalBody px="26px" maxH="400px" overflowY="scroll" sx={SCROLLBAR}>
            <Stack>
              {accounts?.map((acct) => {
                return (
                  <Flex
                    p="12px"
                    w="full"
                    key={acct?.address}
                    cursor="pointer"
                    borderRadius="10px"
                    _hover={{ bg: "bg.1" }}
                    alignItems="center"
                    justifyContent="start"
                    onClick={() => onClickHandler(acct)}
                  >
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
                        src={
                          acct?.meta?.source === "polkadot-js"
                            ? PolkadotjsLogo
                            : acct?.meta?.source === "subwallet-js"
                            ? SubWalletLogo
                            : acct?.meta?.source === "aleph-zero-signer"
                            ? AzeroSignerLogo
                            : acct?.meta?.source === "Nightly"
                            ? NightlyLogo
                            : ""
                        }
                        alt={acct?.meta?.source}
                      />
                    </Circle>

                    <Heading w="full" as="h5" size="h5" ml="10px">
                      {acct?.meta?.name}
                    </Heading>

                    <Heading w="full" as="h5" size="h5" ml="10px">
                      {addressShortener(acct?.address)}
                    </Heading>
                  </Flex>
                );
              })}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
