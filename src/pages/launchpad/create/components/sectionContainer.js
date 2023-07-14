const { Box, Heading, Text } = require("@chakra-ui/react");

const SectionContainer = ({ title, description, children, right }) => {
  return (
    <Box direction="column" w="full" mt={{ base: "16px" }}>
      <Box textAlign={{ base: "center", lg: "left" }}>
        <Box
          display={{ base: "flex" }}
          justifyContent={{ base: "space-between" }}
          textAlign={{ base: "center", lg: "left" }}
        >
          <Heading
            as="h3"
            size="h3"
            mb="16px"
            lineHeight={{ base: "1.25", lg: "30px" }}
          >
            {title}
          </Heading>
          {right}
        </Box>
        {description && (
          <Box mb={{ base: "20px" }} textAlign={{ base: "center", lg: "left" }}>
            <Text color="text.2" mx="auto" maxW={{ base: "full" }}>
              {description}
            </Text>
          </Box>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default SectionContainer;
