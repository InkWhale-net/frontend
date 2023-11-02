import { Box, Flex, Heading, Text, useStyleConfig } from "@chakra-ui/react";

export default function CardThreeColumn(props) {
  const {
    variant = "outline",
    w = { base: "full" },
    title,
    children,
    data,
    ...rest
  } = props;
  const styles = useStyleConfig("IWCard", { variant });

  return (
    <Box w={w} __css={styles} {...rest}>
      {title && (
        <Heading as="h4" size="h4" lineHeight="25px" >
          {title}
        </Heading>
      )}
      <Box
        mt="14px"
        pt="0px"
        w="full"
        borderTop={!title ? "" : "1px solid #E3DFF3"}
      >
        <Flex
          flexWrap="wrap"
          justifyContent="space-between"
          flexDirection={{ base: "column", lg: "row" }}
        >
          {" "}
          {data?.map(({ title, content }, idx) => {
            return (
              <Box
                w={["auto", "33%"]}
                key={idx}
                my={{ base: "12px", lg: "12px" }}
              >
                <Text fontSize="md" lineHeight="28px">
                  {title}{" "}
                </Text>

                <Heading as="h4" size="h4" mt="2px" fontWeight="semibold">
                  {content}
                  {/* <AzeroLogo /> */}
                </Heading>
              </Box>
            );
          })}
        </Flex>

        {children}
      </Box>
    </Box>
  );
}
