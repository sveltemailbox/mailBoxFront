import { createStore } from "redux";
import { allReducers } from "./root_reducer";

const initialState = {
  data: {},
  folderList: [{}],
  unreadMailsCount: 0,
  isActiveModule: "Unread",
  userData: {},
  searchText: {},
  filterOptions: {},
  station: [],
  sortFilter: "",
  isActiveModule3Column: "Unread Mails",
};

export const store = createStore(
  allReducers,
  initialState,
  window.devToolsExtension && window.devToolsExtension()
);
