import Yup from "yup";

export const createCategorySchema = Yup.object().shape({
  name: Yup.string().required(),
  iconId: Yup.string().required("Icon ID is required"),
  colorId: Yup.string().required("Color ID is required"),
  shared: Yup.boolean().default(false),
});
