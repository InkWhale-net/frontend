export const textareaStyles = {
  components: {
    Textarea: {
      baseStyle: {
        field: {
          fontWeight: 400,
          borderRadius: "8px",
          background: "#FFF",
        },
      },

      variants: {
        main: (props) => ({
          field: {
            bg: "transparent",
            border: "1px solid !important",
            color: "secondaryGray.900",
            borderColor: "secondaryGray.100",
            borderRadius: "16px",
            fontSize: "sm",
            p: "20px",
            _placeholder: { color: "secondaryGray.400" },
          },
        }),
        auth: (props) => ({
          field: {
            bg: "white",
            border: "1px solid",
            borderColor: "secondaryGray.100",
            borderRadius: "16px",
            _placeholder: { color: "secondaryGray.600" },
          },
        }),
        authSecondary: (props) => ({
          field: {
            bg: "white",
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
  },
};
