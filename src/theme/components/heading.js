export const headingStyles = {
  components: {
    Heading: {
      baseStyle: {
        fontWeight: "700",
        fontStyle: "normal",
        color: "text.1",
      },

      sizes: {
        display: {
          fontSize: ["4xl-mid", null, "6xl"],
          lineHeight: [1.4, null, "4.375rem"],
        },
        h1: {
          fontSize: ["4xl", null, "4xl"],
        },
        h2: {
          fontSize: ["2xl", null, "3xl"],
        },
        h3: {
          fontSize: ["xl", null, "2xl"],
        },
        h4: {
          fontSize: ["lg", null, "xl"],
        },
        h5: {
          fontSize: ["md", null, "lg"],
        },
        h6: {
          fontSize: "md",
        },
        menu: {
          fontSize: "md",
          fontWeight: "600",
        },
      },
      variants: {
        underline: (props) => ({
          position: "relative",

          _before: {
            zIndex: "-1",
            content: `""`,
            position: "absolute",
            width: "full",
            height: "30px",
            bg: "bg.1",
            opacity: "1",
            bottom: 0,
          },
        }),
      },
      defaultProps: {},
    },
  },
};
