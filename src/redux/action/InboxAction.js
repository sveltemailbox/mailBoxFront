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
