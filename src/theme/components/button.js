export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: "5px",
        transition: ".25s all ease",
        boxSizing: "border-box",
        boxShadow: "45px 76px 113px 7px rgba(112, 144, 176, 0.08)",
        _focus: { boxShadow: "none" },
        _active: { boxShadow: "none" },
      },
      sizes: {
        md: { height: "52px", fontSize: "lg", fontWeights: "semibold" },
      },
      variants: {
        primary: () => ({
          bg: "brand.500",
          color: "text.1",
          _focus: { bg: "#6EDDE4" },
          _active: { bg: "#6EDDE4" },
          _hover: { bg: "#8BE7ED" },
          _disable: { bg: "#A9CED0" },
        }),
        secondary: () => ({
          bg: "text.1",
          color: "#FFFFFF",
          _focus: { bg: "#322E55" },
          _active: { bg: "#322E55" },
          _hover: { bg: "#4A456B" },
          _disable: { bg: "#A3A0B7" },
        }),
        outline: () => ({
          bg: "transparent",
          border: "2px solid #93F0F5",
          color: "text.1",
          _focus: { bg: "#6EDDE4" },
          _active: { bg: "#6EDDE4" },
          _hover: { bg: "#A7F1F6" },
          _disable: { bg: "transparent" },
        }),
        brand: (props) => ({
          bg: "brand.500",
          color: "secondaryGray.500",
          _focus: { bg: "brand.500" },
          _active: { bg: "brand.500" },
          _hover: { bg: "brand.600" },
        }),
        darkBrand: (props) => ({
          bg: "brand.900",
          color: "secondaryGray.500",
          _focus: { bg: "brand.900" },
          _active: { bg: "brand.900" },
          _hover: { bg: "brand.800" },
        }),
        lightBrand: (props) => ({
          bg: "#F2EFFF",
          color: "secondaryGray.500",
          _focus: { bg: "#F2EFFF" },
          _active: { bg: "secondaryGray.300" },
          _hover: { bg: "secondaryGray.400" },
        }),
        light: (props) => ({
          bg: "secondaryGray.300",
          color: "secondaryGray.900",
          _focus: {
            bg: "secondaryGray.300",
          },
          _active: {
            bg: "secondaryGray.300",
          },
          _hover: {
            bg: "secondaryGray.400",
          },
        }),
        action: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: "secondaryGray.300",
          color: "brand.500",
          _focus: {
            bg: "secondaryGray.300",
          },
          _active: { bg: "secondaryGray.300" },
          _hover: {
            bg: "secondaryGray.200",
          },
        }),
        setup: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: "transparent",
          border: "1px solid",
          borderColor: "secondaryGray.400",
          color: "secondaryGray.900",
          _focus: {
            bg: "transparent",
          },
          _active: { bg: "transparent" },
          _hover: {
            bg: "secondaryGray.100",
          },
        }),
      },
      defaultProps: {
        variant: "primary",
      },
    },
  },
};
