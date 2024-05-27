import { Portal, Box, useDisclosure, Text, Flex } from "@chakra-ui/react";
import Footer from "components/footer/FooterLandingPage.js";

import Navbar from "components/navbar/Navbar.js";
import { appChain } from "constants";
import { useAppContext } from "contexts/AppContext";
import { SidebarContext } from "contexts/SidebarContext";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formatChainStringToNumber } from "utils";
import { formatNumDynDecimal } from "utils";
import { execContractQuery } from "utils/contracts";
import { pair_contract } from "utils/contracts/common-fi/pair_contract";

export default function Default(props) {
  const { children, ...rest } = props;

  const { TVL } = useSelector((s) => s.stats);

  const [fixed] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  document.documentElement.dir = "ltr";

  const { onOpen } = useDisclosure();

  const { api } = useAppContext();
  const { currentAccount } = useSelector((s) => s.wallet);

  const [inw2AzeroPrice, setInw2AzeroPrice] = useState(0);
  const [inw2UsdPrice, setInw2UsdPrice] = useState(0);

  useEffect(() => {
    const fetchInwPrice = async () => {
      const queryResult = await execContractQuery(
        currentAccount?.address,
        api,
        pair_contract.CONTRACT_ABI,
        "5Dr3N2eP41e3BTMi6rxCJYeLGSS7Ggnayarx9FqCPZdmnnNj",
        0,
        "pair::getReserves"
      );

      const ret = queryResult?.toHuman()?.Ok;

      const azeroAmount = formatChainStringToNumber(ret[0]) / Math.pow(10, 12);
      const inwAmount = formatChainStringToNumber(ret[1]) / Math.pow(10, 12);

      const inwPrice = azeroAmount / inwAmount;

      setInw2AzeroPrice(inwPrice?.toFixed(4));
      setInw2UsdPrice((TVL.azeroInUSD * inwPrice)?.toFixed(6) || 0);
    };

    api && fetchInwPrice();
  }, [TVL.azeroInUSD, api, currentAccount?.address]);

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
                >
                  <Text
                    color="#57527E"
                    fontWeight={"700"}
                    fontSize={"15px"}
                    textAlign={"center"}
                  >
                    INW2 Price: {inw2AzeroPrice} AZERO (${inw2UsdPrice})
                  </Text>
                  <Text
                    color="#57527E"
                    fontWeight={"700"}
                    fontSize={"15px"}
                    textAlign={"center"}
                  >
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
