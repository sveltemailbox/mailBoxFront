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
