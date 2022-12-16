import {
  UPPERCASE_PATTERN,
  LOWERCASE_PATTERN,
  NUMBER_PATTER,
  SPECIAL_CHAR_PATTERN,
  PASSWORD_LENGTH,
} from "../config/constants";

export const isLogin = () => {
  const token = localStorage.getItem("auth");

  return token ? true : false;
};

export const MAIL_ACTIONS = {
  CRASHED_UNREAD: "99",
  CRASHED_READ: "98",
  CRASHED_STARRED_UNREAD: "97",
  CRASHED_STARRED_READ: "96",
  CRASHED: "95",
  COMPOSED_UNREAD: "89",
  COMPOSED_READ: "88",
  COMPOSED_STARRED_READ: "87",
  COMPOSED_STARRED_UNREAD: "86",
  STARRED_UNREAD: "79",
  STARRED_READ: "78",
  STARRED: "77",
  UNREAD: "69",
  READ: "68",
  SENT: "67",
};

export const UNREAD_CONSTANTS_VALUES = ["69", "79", "86", "89", "97", "99"];
export const READ_CONSTANTS_VALUES = ["68", "78", "87", "88", "96", "98"];
export const CRASHED_CONST_VALUES = ["99", "98", "97", "96"];
export const COMPOSED_CONST_VALUES = ["89", "88", "87", "86"];
export const INGESTED_CONST_VALUES = ["68", "69", "78", "79"];
// export const NORMAL

export const validatePassword = (password) => {
  return {
    hasUpper: UPPERCASE_PATTERN.test(password),
    hasLower: LOWERCASE_PATTERN.test(password),
    hasNumber: NUMBER_PATTER.test(password),
    hasSpecial: SPECIAL_CHAR_PATTERN.test(password),
    lengthValid: password.length >= PASSWORD_LENGTH,
  };
};
