import Yup from "yup";

export const createTransactionSchema = Yup.object().shape({
  amount: Yup.number().required("Amount is required"),
  accountId: Yup.string().required("Account ID is required"),
  categoryId: Yup.string().required("Category ID is required"),
  type: Yup.string()
    .oneOf(["income", "expense"], "Type must be either 'income' or 'expense'")
    .required("Type is required"),
  description: Yup.string().max(
    500,
    "Description must be at most 500 characters long"
  ),
  datetime: Yup.date().required("Datetime is required"),
});
