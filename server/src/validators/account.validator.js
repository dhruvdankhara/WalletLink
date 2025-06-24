import Yup from "yup";

export const createAccountSchema = Yup.object().shape({
  name: Yup.string().required(),
  initialBalance: Yup.number().required(),
  iconId: Yup.string().required("Icon ID is required"),
  colorId: Yup.string().required("Color ID is required"),
});

export const updateAccountSchema = Yup.object().shape({
  name: Yup.string(),
  iconId: Yup.string(),
  colorId: Yup.string(),
  _id: Yup.string().required("Account ID is required"),
});
