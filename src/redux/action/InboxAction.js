import * as ACTIONS from "../action_types";

export const updateData = (attribute) => {
  return {
    type: ACTIONS.UPDATE_DATA,
    payload: attribute,
  };
};

export const updateFolderList = (attribute) => {
  return {
    type: ACTIONS.UPDATE_FOLDER_LIST,
    payload: attribute,
  };
};

export const updateUnreadMailsCount = (attribute) => {
  return {
    type: ACTIONS.UPDATE_UNREAD_MAILS_COUNT,
    payload: attribute,
  };
};

export const updateUserData = (attribute) => {
  return {
    type: ACTIONS.UPDATE_USER_DATA,
    payload: attribute,
  };
};

export const updateActiveModule = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ACTIVE_MODULE,
    payload: attribute,
  };
};

export const updateIsActiveModule3Column = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ACTIVE_MODULE_3_COLUMN,
    payload: attribute,
  };
};

export const updateSeachText = (attribute) => {
  return {
    type: ACTIONS.UPDATE_SEARCH_TEXT,
    payload: attribute,
  };
};

export const updateFilterOptions = (attribute) => {
  return {
    type: ACTIONS.UPDATE_FILTER_OPTIONS,
    payload: attribute,
  };
};

export const updateStationList = (attribute) => {
  return {
    type: ACTIONS.UPDATE_STATION_LIST,
    payload: attribute,
  };
};

export const updateSortFilter = (attribute) => {
  return {
    type: ACTIONS.UPDATE_SORT_FILTER,
    payload: attribute,
  };
};

export const updateSwitching = (attribute) => {
  return {
    type: ACTIONS.UPDATE_SWITCHING,
    payload: attribute,
  };
};

export const updateUnreadCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_UNREAD_CACHE,
    payload: attribute,
  };
};

export const clearUnreadCache = (attribute) => {
  return {
    type: ACTIONS.CLEAR_UNREAD_CACHE,
    payload: attribute,
  };
};

export const updateUnreadCall = (attribute) => {
  return {
    type: ACTIONS.UPDATE_UNREAD_CALL,
    payload: attribute,
  };
};
export const updateArchiveCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ARCHIVE_CACHE,
    payload: attribute,
  };
};
export const updateArchiveCall = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ARCHIVE_CALL,
    payload: attribute,
  };
};
export const updateAllCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ALL_CACHE,
    payload: attribute,
  };
};
export const updateAllCall = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ALL_CALL,
    payload: attribute,
  };
};
export const updateSentCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_SENT_CACHE,
    payload: attribute,
  };
};

export const updateSentCall = (attribute) => {
  return {
    type: ACTIONS.UPDATE_SENT_CALL,
    payload: attribute,
  };
};
export const updateStarredCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_STARRED_CACHE,
    payload: attribute,
  };
};
export const updateStarredCall = (attribute) => {
  return {
    type: ACTIONS.UPDATE_STARRED_CALL,
    payload: attribute,
  };
};
export const updateCrashedCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_CRASHED_CACHE,
    payload: attribute,
  };
};
export const updateCrashedCall = (attribute) => {
  return {
    type: ACTIONS.UPDATE_CRASHED_CALL,
    payload: attribute,
  };
};

export const updateFolderCachedData = (attribute) => {
  return {
    type: ACTIONS.UPDATE_FOLDER_CACHED_DATA,
    payload: attribute,
  };
};

export const updateAddToFolderCache = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ADD_TO_FOLDER_CACHE,
    payload: attribute,
  };
};
export const updateArchiveLoader = (attribute) => {
  return {
    type: ACTIONS.UPDATE_ARCHIVE_LOADER,
    payload: attribute,
  };
};

export const updateMostFrequent = (attribute) => {
  return {
    type: ACTIONS.UPDATE_MOST_FREQUENT,
    payload: attribute,
  };
};


export const updateAppliactionType = (attribute) => {
  return {
    type: ACTIONS.APPLICATION_TYPE,
    payload: attribute,
  };
};
