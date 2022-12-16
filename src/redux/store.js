import { createStore } from "redux";
import { allReducers } from "./root_reducer";
import { composeWithDevTools } from "@redux-devtools/extension";

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
  switching: false,
  unreadCache: { previous: [], current: [], next: [] },
  unreadCall: 0,
  archiveCache: { previous: [], current: [], next: [] },
  archiveCall: 0,
  allCache: { previous: [], current: [], next: [] },
  allCall: 0,
  sentCache: { previous: [], current: [], next: [] },
  sentCall: 0,
  starredCache: { previous: [], current: [], next: [] },
  starredCall: 0,
  crashedCache: { previous: [], current: [], next: [] },
  crashedCall: 0,
  folderCachedData: [],
  archiveLoader: false,
  isMostFrequent:0,
  applicationType:""
};

export const store = createStore(
  allReducers,
  initialState,
  composeWithDevTools()
);
