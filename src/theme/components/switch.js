// 
export const switchStyles = {
  components: {
    Switch: {
      baseStyle: {
        thumb: {
          fontWeight: 400,
          borderRadius: "50%",
          w: "18px",
          h: "18px",
          _checked: { transform: "translate(22px, 0px)" },
        },
        track: {
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          w: "44px",
          h: "22px",
          p: "2px",
          ps: "2px",
          _focus: {
            boxShadow: "none",
          },
        },
      },

      variants: {
        main: () => ({
          track: {
            bg: "#E3DFF3",
            _checked: { bg: "#93F0F5" },
          },
        }),
      },
      defaultProps: {
        variant: "main",
      },
    },
  },
};
