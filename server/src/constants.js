export const DB_NAME = "WalletLink";

export const cookieOption = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
};
