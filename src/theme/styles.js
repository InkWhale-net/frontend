export const globalStyles = {
  useSystemColorMode: false,
  initialColorMode: "light",

  styles: {
    global: (props) => ({
      "*": {
        // border: "1px blue dotted",
      },
      body: {
        overflowX: "hidden",
        bg: "#FFF",
        color: "#8C86A5",
        fontSize: "18px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "30px",
        letterSpacing: "0px",
        textAlign: "left",
      },
      "body::-webkit-scrollbar": {
        display: "none",
      },
      html: { scrollBehavior: "smooth" },
      ".react-datetime-picker__wrapper": {
        display: "flex",
        flexGrow: 1,
        flexShrink: 0,
        border: "0px solid #ffffff00",
        paddingLeft: "10px",
      },
    }),
  },
  colors: {
    brand: {
      100: "#464C7E",
      200: "#596E9C",
      300: "#6C95BA",
      400: "#7FC1D8",
      500: "#93F0F5",
      600: "#A7F9E6",
      700: "#BBFCDB",
      800: "#D1FEDB",
      900: "#E9FFE7",
    },

    text: {
      1: "#57527E",
      2: "#8C86A5",
      3: "#FFFFFF",
    },
    bg: {
      1: "#E8FDFF",
      2: "#FEEEBD",
      3: "#FED1CA",
      4: "#FFD6EB",
      5: "#F6F6FC",
      6: "#FFFFFF",
    },
    border: "#E3DFF3",
    decoration: {
      1: "#7EB1EA",
      2: "#FFDA6E",
      3: "#F59A86",
      4: "#FFA0D2",
      5: "#CDA1F6",
    },
  },
};
