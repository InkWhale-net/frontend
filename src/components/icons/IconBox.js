import React from "react";
import { Flex } from "@chakra-ui/react";

export default function IconBox(props) {
  const { icon, ...rest } = props;

  return (
    <Flex alignItems={"center"} justifyContent={"center"} {...rest}>
      {icon}
    </Flex>
  );
}
