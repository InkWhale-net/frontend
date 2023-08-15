import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import NavbarLinks from "components/navbar/NavbarLinks";
import { InkwhaleLogo } from "components/icons/Icons";

export default function Navbar(props) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", changeNavbar);

    return () => {
      window.removeEventListener("scroll", changeNavbar);
    };
  });

  const { secondary, message } = props;

  let navbarPosition = "fixed";
  let gap = "0px";
  const changeNavbar = () => {
    if (window.scrollY > 1) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  return (
    <Box
      borderBottomWidth="1px"
      borderColor="#E3DFF350"
      zIndex="overlay"
      right="0"
      left="0"
      top="0"
      position={navbarPosition}
      mx="auto"
      pb="8px"
      pt="8px"
      w="full"
      minH={["55px", "75px"]}
      alignItems={{ xl: "center" }}
      display={secondary ? "block" : "flex"}
      justifyContent={{ base: "space-between", xl: "center" }}
      bg="#fff"
      px={{ base: "20px", xl: "130px" }}
      boxShadow="0px 10px 10px #F9F1FF50"
      transitionDelay="0s, 0s, 0s, 0s"
      transitionDuration=" 0.25s, 0.25s, 0.25s, 0s"
      transition-property="box-shadow, background-color, filter, border"
      marginTop={'30px'}
      transitionTimingFunction="linear, linear, linear, linear"
    >
      <Flex
        w="100%"
        flexDirection={{
          sm: "row",
          md: "row",
        }}
        justifyContent="space-between"
        alignItems={{ xl: "center" }}
        mb={gap}
      >
        <Flex alignItems="center" minWidth="160px">
          <Flex id="cba" alignItems="center">
            <InkwhaleLogo w={["40px", "45px"]} h={["37.5px", "42px"]} mr={2} />

            <Heading as="h3" size="h3">
              Ink Whale
            </Heading>
          </Flex>
        </Flex>
        <Box
          ms="auto"
          w={{ sm: "100%", md: "unset" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <NavbarLinks
            onOpen={props.onOpen}
            logoText={props.logoText}
            secondary={props.secondary}
            fixed={props.fixed}
            scrolled={scrolled}
          />
        </Box>
      </Flex>
      {secondary ? <Text color="white">{message}</Text> : null}
    </Box>
  );
}

Navbar.propTypes = {
  brandText: PropTypes.string,
  variant: PropTypes.string,
  secondary: PropTypes.bool,
  fixed: PropTypes.bool,
  onOpen: PropTypes.func,
};
