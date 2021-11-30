import * as ACTIONS from "../action_types";

export const updateData = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_DATA:
      return payload || [];
    default:
      return state;
  }
};

export const updateFolderList = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_FOLDER_LIST:
      return payload || [];
    default:
      return state;
  }
};

export const updateUnreadMailsCount = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_UNREAD_MAILS_COUNT:
      return payload || 0;
    default:
      return state;
  }
};

export const updateActiveModule = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_ACTIVE_MODULE:
      return payload || "";
    default:
      return state;
  }
};

export const updateIsActiveModule3Column = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_ACTIVE_MODULE_3_COLUMN:
      return payload || "";
    default:
      return state;
  }
};

export const updateUserData = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_USER_DATA:
      return payload || {};
    default:
      return state;
  }
};

export const updateSeachText = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_SEARCH_TEXT:
      return payload;
    default:
      return state;
  }
};

export const updateFilterOptions = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_FILTER_OPTIONS:
      return payload;
    default:
      return state;
  }
};

export const updateStationList = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_STATION_LIST:
      return payload;
    default:
      return state;
  }
};

export const updateSortFilter = (state = "", { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_SORT_FILTER:
      return payload;
    default:
      return state;
  }
};
