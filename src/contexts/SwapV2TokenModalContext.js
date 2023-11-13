import { Box, Flex, Modal, ModalOverlay, Slide } from "@chakra-ui/react";
import { SwapModalContent } from "components/INWSwap";
import { createContext, useContext, useRef, useState } from "react";
import { GrClose } from "react-icons/gr";

export const SwapV2TokenContext = createContext();
export const SwapV2TokenProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const openSwapModal = () => setIsOpen(true);
  const amountRef = useRef(null);
  return (
    <SwapV2TokenContext.Provider value={{ openSwapModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay
          onClick={() => setIsOpen(false)}
          zIndex="101 !important"
        />
      </Modal>
      <Slide direction="bottom" in={isOpen} style={{ zIndex: 102 }}>
        <Box bg="#FFF" borderTop="2px solid #e3dff3">
          <Flex justify="end">
            <Box p="12px" cursor="pointer" onClick={() => setIsOpen(false)}>
              <GrClose />
            </Box>
          </Flex>
          <SwapModalContent amountRef={amountRef} isOpen={isOpen} />
        </Box>
      </Slide>
    </SwapV2TokenContext.Provider>
  );
};
export const useSwapV2TokenContext = () => useContext(SwapV2TokenContext);
