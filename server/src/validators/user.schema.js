import Yup from "yup";

export const registerSchema = Yup.object().shape({
  firstname: Yup.string().required(),
  lastname: Yup.string().required(),
  email: Yup.string().email("Invalid email format").required(),
  password: Yup.string().min(8).required("Password is required"),
});

export const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email format"),
  password: Yup.string().required("Password is required"),
});

export const changePasswordSchema = Yup.object().shape({
  newPassword: Yup.string().min(8).required("new password is required."),
  oldPassword: Yup.string().required("old passwor is required."),
});

export const updateUserSchema = Yup.object().shape({
  email: Yup.string().email(),
});
