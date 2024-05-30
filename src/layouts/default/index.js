import { Portal, Box, useDisclosure, Text, Flex } from "@chakra-ui/react";
import Footer from "components/footer/FooterLandingPage.js";

import Navbar from "components/navbar/Navbar.js";
import { appChain } from "constants";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { formatNumDynDecimal } from "utils";

export default function Default(props) {
  const { children, ...rest } = props;

  const { TVL } = useSelector((s) => s.stats);

  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  document.documentElement.dir = "ltr";

  const { onOpen } = useDisclosure();

  const inw2UsdPrice = useMemo(
    () => (Number(TVL.azeroInUSD) * TVL.inw2InAzero)?.toFixed(6),
    [TVL.azeroInUSD, TVL.inw2InAzero]
  );

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
              <Box
                position={"fixed"}
                top={0}
                width={"100%"}
                zIndex={9999}
                background={"#EDC1F5"}
              >
                <Flex
                  w="full"
                  flexDirection={["column", "column", "row"]}
                  justifyContent={["center", "center", "space-evenly"]}
                  fontSize={["13px", "13px", "15px"]}
                >
                  <Text color="#57527E" fontWeight={"700"} textAlign={"center"}>
                    INW2 Price: {(TVL?.inw2InAzero || 0)?.toFixed(4)} AZERO ($
                    {inw2UsdPrice || 0})
                  </Text>
                  <Text color="#57527E" fontWeight={"700"} textAlign={"center"}>
                    Platform TVL: {formatNumDynDecimal(TVL?.tvlInAzero, 2)}{" "}
                    {appChain?.unit} ($
                    {formatNumDynDecimal(TVL?.tvlInUSD, 2)})
                  </Text>
                </Flex>
              </Box>
              <Navbar
                {...rest}
                fixed={fixed}
                onOpen={onOpen}
                logoText={"Ink Whale"}
              />
            </Box>
          </Portal>

          <Box mx="auto" minH="100vh" pt={["125px"]}>
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
