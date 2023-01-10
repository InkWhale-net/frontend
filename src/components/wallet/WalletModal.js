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

export default function WalletModal({ isOpen, onClose, accounts }) {
  const dispatch = useDispatch();

  function onClickHandler(account) {
    dispatch(setCurrentAccount(account));
    onClose();
  }
  return (
    <>
      <Modal size={"sm"} onClose={onClose} isOpen={isOpen} isCentered>
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
                    onClick={() => onClickHandler(acct)}
                    cursor="pointer"
                    borderRadius="10px"
                    p="12px"
                    _hover={{ bg: "bg.1" }}
                    alignItems="center"
                    justifyContent="start"
                    w="full"
                  >
                    <Circle
                      borderWidth="1px"
                      borderColor="border"
                      bg="transparent"
                      w="44px"
                      h="44px"
                    >
                      <Image
                        w="26px"
                        h="26px"
                        src={
                          acct?.meta?.source === "polkadot-js"
                            ? PolkadotjsLogo
                            : acct?.meta?.source === "subwallet-js"
                            ? SubWalletLogo
                            : ""
                        }
                        alt={acct?.meta?.source}
                      />
                    </Circle>

                    <Heading isTruncated w="full" as="h5" size="h5" ml="10px">
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
