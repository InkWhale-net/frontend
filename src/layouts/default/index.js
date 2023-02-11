import { Portal, Box, useDisclosure } from "@chakra-ui/react";
import Footer from "components/footer/FooterLandingPage.js";

import Navbar from "components/navbar/Navbar.js";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useState } from "react";

export default function Default(props) {
  const { children, ...rest } = props;

  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  document.documentElement.dir = "ltr";

  const { onOpen } = useDisclosure();

  return (
    <Box>
      <SidebarContext.Provider
        value={{
          toggleSidebar,
          setToggleSidebar,
        }}
      >
        <div id="hero"></div>
        <Box
          w="100%"
          height="100%"
          minHeight="100vh"
          maxHeight="100%"
          overflow="auto"
          position="relative"
          transitionDuration=".2s, .2s, .35s"
          transitionProperty="top, bottom, width"
          transitionTimingFunction="linear, linear, ease"
          transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
        >
          <Portal>
            <Box>
              <Navbar
                {...rest}
                fixed={fixed}
                onOpen={onOpen}
                logoText={"Ink Whale"}
              />
            </Box>
          </Portal>

          <Box mx="auto" minH="100vh" pt={["65px", "92px"]}>
            {children}
          </Box>

          <Box>
            <Footer />
          </Box>
        </Box>
      </SidebarContext.Provider>
    </Box>
  );
}
