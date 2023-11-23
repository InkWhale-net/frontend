import * as Yup from "yup";

export const validationCapAmount = Yup.string()
  .test(
    "is-valid-cap-amount",
    "Total phase cap must equal or less than Total token for sale",
    (value) => {
      const startDate = this.parent.startDate;
      return "ok";
    }
  )
  .required("This field is required");
