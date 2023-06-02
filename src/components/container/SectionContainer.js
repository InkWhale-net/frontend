import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

function SectionContainer({
  children,
  title,
  description,
  scrollRef,
  ...rest
}) {
  return (
    <Flex
      direction="column"
      w="full"
      maxW="1440px"
      mx="auto"
      my="0px"
      py={{ base: "20px", xl: "40px" }}
      px={{ base: "20px", xl: "135px" }}
      {...rest}
      ref={scrollRef}
    >
      {/* <Box
        border="1px solid blue"
        mb={{ base: "40px" }}
        textAlign={{ base: "center", lg: "left" }}
      >
        {title && (
          <Heading as="h1" size="h1" mb="16px">
            {title}
          </Heading>
        )}

        {description && (
          <Text color="text.2" mx="auto" maxW={{ base: "330px", lg: "full" }}>
            {description}
          </Text>
        )}
      </Box> */}

      {title && (
        <Box textAlign={{ base: "center", lg: "left" }}>
          <Heading
            as="h1"
            size="h1"
            mb="16px"
            lineHeight={{ base: "1.25", lg: "30px" }}
          >
            {title}
          </Heading>
        </Box>
      )}

      {description && (
        <Box mb={{ base: "40px" }} textAlign={{ base: "center", lg: "left" }}>
          <Text color="text.2" mx="auto" maxW={{ base: "330px", lg: "full" }}>
            {description}
          </Text>
        </Box>
      )}
      <Flex w="full">{children}</Flex>
    </Flex>
  );
}

export default SectionContainer;
