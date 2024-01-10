import {
  Button,
  Flex,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import { delay } from "utils";

export default function ConfirmModal({
  onClick,
  action,
  message,
  buttonLabel,
  buttonVariant,
  children,
  disableBtn,
  onValidate,
  isLoading,
  ...rest
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onProcess = async () => {
    if (!!onValidate) {
      const validation = await onValidate();
      if (validation) onOpen();
    } else onOpen();
  };

  return (
    <>
      <Button
        isLoading={isLoading}
        onClick={() => onProcess()}
        w="full"
        disabled={disableBtn}
        variant={buttonVariant}
      >
        {buttonLabel}
      </Button>

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
              {message}
            </Heading>
          </ModalHeader>

          <ModalBody px="46px">{children}</ModalBody>

          <ModalFooter px="46px" pb="42px">
            <Flex w="full" justifyContent="center">
              <Button
                mx="5px"
                w="127px"
                onClick={() => {
                  onClick();
                  delay(500).then(() => onClose());
                }}
              >
                Confirm
              </Button>
              <Button mx="5px" w="127px" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
