export const tabsStyles = {
  components: {
    Tabs: {
      baseStyle: {
        root: {
          display: "block",
        },
        tab: {
          transitionProperty: "common",
          transitionDuration: "normal",
          _focus: {
            zIndex: 1,
            boxShadow: "outline",
          },
          _selected: {
            // Must full 4 line to overwrite default cua Chakra
            borderColor: "#93F0F5",
            border: "0px solid #93F0F5",
            borderBottomWidth: "3px",
            color: "#93F0F5",
          },
        },
        tablist: {
          color: "text.1",
          flexDirection: "row",
          justifyContent: "flex-start",
        },
        tabpanel: {
          py: { base: "24px", lg: "40px" },
          px: 0,
        },
      },
    },
  },
};
