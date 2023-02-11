// 
export const inputStyles = {
  components: {
    Input: {
      baseStyle: {
        addon: {},
        field: {
          h: "52px",
          px: "16px",
          color: "text.1",
          background: "#FFF",
          borderRadius: "5px",
          border: "1px solid #E3DFF3",
          _placeholder: {
            color: "text.2",
            fontSize: "16px",
          },
        },
      },

      variants: {
        main: (props) => ({
          field: {
            // bg: mode("transparent", "navy.800")(props),
            // border: "1px solid",
            // color: mode("secondaryGray.900", "white")(props),
            // borderColor: mode("secondaryGray.100", "whiteAlpha.100")(props),
            // borderRadius: "16px",
            // fontSize: "sm",
            // p: "20px",
            // _placeholder: { color: "secondaryGray.400" },
          },
        }),

        search: (props) => ({
          field: {
            // border: "none",
            // py: "11px",
            // borderRadius: "inherit",
            // _placeholder: { color: "secondaryGray.600" },
          },
        }),
      },
      defaultProps: {
        size: null,
        variant: null,
      },
    },
    NumberInput: {
      baseStyle: {
        field: {
          fontWeight: 400,
        },
      },

      variants: {
        main: (props) => ({
          field: {
            bg: "transparent",
            border: "1px solid",

            borderColor: "secondaryGray.100",
            borderRadius: "16px",
            _placeholder: { color: "secondaryGray.600" },
          },
        }),
        auth: (props) => ({
          field: {
            bg: "transparent",
            border: "1px solid",

            borderColor: "secondaryGray.100",
            borderRadius: "16px",
            _placeholder: { color: "secondaryGray.600" },
          },
        }),
        authSecondary: (props) => ({
          field: {
            bg: "transparent",
            border: "1px solid",

            borderColor: "secondaryGray.100",
            borderRadius: "16px",
            _placeholder: { color: "secondaryGray.600" },
          },
        }),
        search: (props) => ({
          field: {
            border: "none",
            py: "11px",
            borderRadius: "inherit",
            _placeholder: { color: "secondaryGray.600" },
          },
        }),
      },
    },
    Select: {
      baseStyle: {
        field: {
          w: "full",
          h: "52px",
          px: "16px",
          color: "text.1",
          fontSize: "lg",
          borderRadius: "5px",
          border: "1px solid #E3DFF3",
        },
      },

      variants: {
        // main: (props) => ({
        //   field: {
        //     bg: mode("transparent", "navy.800")(props),
        //     border: "1px solid",
        //     color: "secondaryGray.600",
        //     borderColor: mode("secondaryGray.100", "whiteAlpha.100")(props),
        //     borderRadius: "16px",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        //   icon: {
        //     color: "secondaryGray.600",
        //   },
        // }),
        // mini: (props) => ({
        //   field: {
        //     bg: mode("transparent", "navy.800")(props),
        //     border: "0px solid transparent",
        //     fontSize: "0px",
        //     p: "10px",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        //   icon: {
        //     color: "secondaryGray.600",
        //   },
        // }),
        // subtle: (props) => ({
        //   box: {
        //     width: "unset",
        //   },
        //   field: {
        //     bg: "transparent",
        //     border: "0px solid",
        //     color: "secondaryGray.600",
        //     borderColor: "transparent",
        //     width: "max-content",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        //   icon: {
        //     color: "secondaryGray.600",
        //   },
        // }),
        // transparent: (props) => ({
        //   field: {
        //     bg: "transparent",
        //     border: "0px solid",
        //     width: "min-content",
        //     color: mode("secondaryGray.600", "secondaryGray.600")(props),
        //     borderColor: "transparent",
        //     padding: "0px",
        //     paddingLeft: "8px",
        //     paddingRight: "20px",
        //     fontWeight: "700",
        //     fontSize: "14px",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        //   icon: {
        //     transform: "none !important",
        //     position: "unset !important",
        //     width: "unset",
        //     color: "secondaryGray.600",
        //     right: "0px",
        //   },
        // }),
        // auth: (props) => ({
        //   field: {
        //     bg: "transparent",
        //     border: "1px solid",
        //     borderColor: "secondaryGray.100",
        //     borderRadius: "16px",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        // }),
        // authSecondary: (props) => ({
        //   field: {
        //     bg: "transparent",
        //     border: "1px solid",
        //     borderColor: "secondaryGray.100",
        //     borderRadius: "16px",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        // }),
        // search: (props) => ({
        //   field: {
        //     border: "none",
        //     py: "11px",
        //     borderRadius: "inherit",
        //     _placeholder: { color: "secondaryGray.600" },
        //   },
        // }),
      },

      defaultProps: {
        size: null,
        variant: null,
      },
    },
    // PinInputField: {
    //   variants: {
    //     main: (props) => ({
    //       field: {
    //         bg: "red !important",
    //         border: "1px solid",
    //         color: mode("secondaryGray.900", "white")(props),
    //         borderColor: mode("secondaryGray.100", "whiteAlpha.100")(props),
    //         borderRadius: "16px",
    //         _placeholder: { color: "secondaryGray.600" },
    //       },
    //     }),
    //   },
    // },
  },
};
