import { Box, Flex, Modal, ModalOverlay, Slide } from "@chakra-ui/react";
import { createContext, useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import { GrClose } from "react-icons/gr";

export const SwapV2TokenContext = createContext();
export const SwapV2TokenProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMobile, setIsOpenMobile] = useState(false);
  const openSwapModal = () => {
    if (isMobile) setIsOpenMobile(true);
    else setIsOpen(true);
  };
  const closeSwapModal = () => {
    setIsOpen(false);
    setIsOpenMobile(false);
  };
  return (
    <SwapV2TokenContext.Provider
      value={{ openSwapModal, modalVisible: isOpen, closeSwapModal }}
    >
      {children}
      <Modal isOpen={isOpenMobile} onClose={() => setIsOpenMobile(false)}>
        <ModalOverlay
          onClick={() => setIsOpenMobile(false)}
          zIndex="101 !important"
        />
      </Modal>
      <Slide direction="bottom" in={isOpenMobile} style={{ zIndex: 102 }}>
        <Box bg="#FFF" borderTop="2px solid #e3dff3">
          <Flex justify="end">
            <Box
              p="12px"
              cursor="pointer"
              onClick={() => setIsOpenMobile(false)}
            >
              <GrClose />
            </Box>
          </Flex>
          {/* <SwapModalContent amountRef={amountRef} isOpen={isOpenMobile} /> */}
        </Box>
      </Slide>
    </SwapV2TokenContext.Provider>
  );
};
export const useSwapV2TokenContext = () => useContext(SwapV2TokenContext);
