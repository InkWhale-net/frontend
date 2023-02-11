export const badgeStyles = {
  components: {
    Badge: {
      baseStyle: {
        borderRadius: "10px",
        lineHeight: "100%",
        padding: "7px",
        paddingLeft: "12px",
        paddingRight: "12px",
      },
      variants: {
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props) => ({
          bg: "brand.500",
          color: "white",
          _focus: { bg: "brand.500" },
          _active: { bg: "brand.500" },
          _hover: { bg: "brand.600" },
        }),
      },
    },
  },
};
