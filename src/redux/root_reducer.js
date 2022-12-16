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
  updateSwitching,
  updateUnreadCache,
  updateArchiveCache,
  updateAllCache,
  updateSentCache,
  updateStarredCache,
  updateCrashedCache,
  updateUnreadCall,
  updateArchiveCall,
  updateAllCall,
  updateSentCall,
  updateStarredCall,
  updateCrashedCall,
  updateFolderCachedData,
  updateAddToFolderCache,
  updateArchiveLoader,
  updateMostFrequent,
  updateAppliactionType,
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
  switching: updateSwitching,
  unreadCache: updateUnreadCache,
  archiveCache: updateArchiveCache,
  allCache: updateAllCache,
  sentCache: updateSentCache,
  starredCache: updateStarredCache,
  crashedCache: updateCrashedCache,
  unreadCall: updateUnreadCall,
  archiveCall: updateArchiveCall,
  allCall: updateAllCall,
  sentCall: updateSentCall,
  starredCall: updateStarredCall,
  crashedCall: updateCrashedCall,
  folderCachedData: updateFolderCachedData,
  updateAddToFolderCache: updateAddToFolderCache,
  archiveLoader: updateArchiveLoader,
  isMostFrequent:updateMostFrequent,
  applicationType:updateAppliactionType
});
