import {
  Box,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";

import { SCROLLBAR } from "constants";
import { BiWallet } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentAccount } from "redux/slices/walletSlice";
import { addressShortener } from "utils";

export default function WalletModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const { allAccounts } = useSelector((state) => state.wallet);

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
              {allAccounts?.map((acct) => {
                return (
                  <Flex
                    p="12px"
                    w="full"
                    key={acct?.address}
                    cursor="pointer"
                    borderRadius="10px"
                    _hover={{ bg: "bg.1", border: "2px solid #93F0F5" }}
                    border="2px solid transparent"
                    alignItems="center"
                    justifyContent="start"
                    onClick={() => onClickHandler(acct)}
                  >
                    <Box>
                      <BiWallet size="24px" />
                    </Box>
                    <Heading w="full" as="h5" size="h5" ml="10px">
                      {acct?.name}
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
