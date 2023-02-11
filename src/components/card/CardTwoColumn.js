import { Box, Flex, Heading, Text, useStyleConfig } from "@chakra-ui/react";

export default function CardTwoColumn(props) {
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
        <Heading as="h4" size="h4" lineHeight="25px">
          {title}
        </Heading>
      )}
      <Box
        mt="14px"
        pt="0px"
        w="full"
        borderTop={!title ? "" : "1px solid #E3DFF3"}
      >
        <Flex flexWrap="wrap">
          {data?.map(({ title, content }, idx) => {
            return (
              <Box key={idx} mt="20px" w={{ base: "full", lg: "50%" }}>
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
      </Box>
    </Box>
  );
}
