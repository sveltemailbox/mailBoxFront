import { combineReducers } from "redux";
import {
  updateData,
  updateFolderList,
  updateUnreadMailsCount,
  updateUserData,
  updateActiveModule,
  updateSeachText,
  updateFilterOptions,
  updateStationList,
  updateSortFilter,
  updateIsActiveModule3Column,
} from "./reducer";

export const allReducers = combineReducers({
  data: updateData,
  folderList: updateFolderList,
  unreadMailsCount: updateUnreadMailsCount,
  userData: updateUserData,
  isActiveModule: updateActiveModule,
  searchText: updateSeachText,
  filterOptions: updateFilterOptions,
  station: updateStationList,
  sortFilter: updateSortFilter,
  isActiveModule3Column: updateIsActiveModule3Column,
});
