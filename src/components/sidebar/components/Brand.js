import React from "react";

import { Divider, Flex, Heading } from "@chakra-ui/react";

import { InkwhaleLogo } from "components/icons/Icons";

export function SidebarBrand() {
  return (
    <Flex align="center" direction="column">
      <Flex alignItems="center" mb="20px">
        <InkwhaleLogo w={["40px", "45px"]} h={["37.5px", "42px"]} mr={2} />

        <Heading as="h4" size="h4">
          Ink Whale
        </Heading>
      </Flex>
      <Divider mb="20px" />
    </Flex>
  );
}

export default SidebarBrand;
