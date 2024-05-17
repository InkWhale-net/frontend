import { Box, Heading, Text, useStyleConfig } from "@chakra-ui/react";

export default function IWCardOneColumn(props) {
  const {
    variant = "outline",
    minW = { base: "full", md: "280px", xl: "370px" },
    w = { base: "full", lg: "30%" },
    title,
    children,
    data = [],
    ...rest
  } = props;
  const styles = useStyleConfig("IWCard", { variant });

  return (
    <Box minW={minW} w={w} __css={styles} {...rest}>
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
        {data
          // ?.filter(
          //   (value, index, self) =>
          //     index ===
          //     self.findIndex(
          //       (t) => t.title === value.title
          //     )
          // )
          ?.map(({ title, content, isHide }, idx) => {
            return !isHide && title && content ? (
              <Box key={idx} mt={{ base: "18px", lg: "20px" }}>
                <Text fontSize="md" lineHeight="28px">
                  {title}{" "}
                </Text>

                <Heading as="h4" size="h4" mt="2px" fontWeight="semibold">
                  {content}
                  {/* <AzeroLogo /> */}
                </Heading>
              </Box>
            ) : null;
          })}
      </Box>
    </Box>
  );
}
