//

export const CardComponent = {
  components: {
    IWCard: {
      baseStyle: () => ({
        bg: "white",
        px: { base: "15px", lg: "24px" },
        py: { base: "20px" },
        borderRadius: "10px",
        border: "1px solid #E3DFF3",
      }),
      variants: {
        outline: () => ({}),
        solid: () => ({
          bg: "bg.5",
          border: "0px solid #E3DFF3",
          pt: "6px",
        }),
        menu: () => ({
          h: "60px",
          p: "0px 15px",
          borderRadius: "5px",
        }),
        menuBlank: () => ({
          h: "60px",
          p: "0px 8px",
          border: "0px solid #E3DFF3",
          _hover: { bg: "#F6F6FC" },
        }),
      },
    },
  },
};
