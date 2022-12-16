import * as ACTIONS from "../action_types";
import { store } from "../store";

const initialState = {
  previous: [],
  current: [],
  next: [],
};

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

export const updateSwitching = (state = "", { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_SWITCHING:
      return payload;
    default:
      return state;
  }
};

export const updateUnreadCache = (state = initialState, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_UNREAD_CACHE:
      return {
        ...state,
        [payload.key]: payload.data,
      };
    case ACTIONS.CLEAR_UNREAD_CACHE:
      return { ...state, previous: [], current: [], next: [] };
    default:
      return state;
  }
};

export const updateArchiveCache = (
  state = { previous: [], current: [], next: [] },
  { type, payload }
) => {
  switch (type) {
    case ACTIONS.UPDATE_ARCHIVE_CACHE:
      return {
        ...state,
        [payload.key]: payload.data,
      };
    default:
      return state;
  }
};

export const updateAllCache = (
  state = { previous: [], current: [], next: [] },
  { type, payload }
) => {
  switch (type) {
    case ACTIONS.UPDATE_ALL_CACHE:
      return {
        ...state,
        [payload.key]: payload.data,
      };
    default:
      return state;
  }
};

export const updateSentCache = (
  state = { previous: [], current: [], next: [] },
  { type, payload }
) => {
  switch (type) {
    case ACTIONS.UPDATE_SENT_CACHE:
      return {
        ...state,
        [payload.key]: payload.data,
      };
    default:
      return state;
  }
};

export const updateStarredCache = (
  state = { previous: [], current: [], next: [] },
  { type, payload }
) => {
  switch (type) {
    case ACTIONS.UPDATE_STARRED_CACHE:
      return {
        ...state,
        [payload.key]: payload.data,
      };
    default:
      return state;
  }
};

export const updateCrashedCache = (
  state = { previous: [], current: [], next: [] },
  { type, payload }
) => {
  switch (type) {
    case ACTIONS.UPDATE_CRASHED_CACHE:
      return {
        ...state,
        [payload.key]: payload.data,
      };
    default:
      return state;
  }
};

export const updateUnreadCall = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_UNREAD_CALL:
      return payload;
    default:
      return state;
  }
};

export const updateAllCall = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_ALL_CALL:
      return payload;
    default:
      return state;
  }
};
export const updateArchiveCall = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_ARCHIVE_CALL:
      return payload;
    default:
      return state;
  }
};
export const updateSentCall = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_SENT_CALL:
      return payload;
    default:
      return state;
  }
};
export const updateStarredCall = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_STARRED_CALL:
      return payload;
    default:
      return state;
  }
};
export const updateCrashedCall = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_CRASHED_CALL:
      return payload;
    default:
      return state;
  }
};

export const updateFolderCachedData = (state = [], { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_FOLDER_CACHED_DATA:
      if (payload?.key === "current") {
        let obj = {
          prev: [],
          current: payload.data,
          next: [],
          isFolderCached: true,
        };
        return {
          ...state,
          [payload?.folderId]: obj,
        };
      }
      if (payload?.key === "next" && state[payload?.folderId] !== undefined) {
        state[payload?.folderId].next = payload.data;
        return {
          ...state,
        };
      }
      if (
        payload?.key === "previous" &&
        state[payload?.folderId] !== undefined &&
        payload?.page === 1
      ) {
        state[payload?.folderId].next = state[payload?.folderId]?.current;
        state[payload?.folderId].current = state[payload?.folderId]?.prev;
        state[payload?.folderId].prev = payload?.data;
        return {
          ...state,
        };
      }

      if (
        payload?.key === "previous" &&
        state[payload?.folderId] !== undefined
      ) {
        if (payload?.page !== undefined && payload?.page !== 1) {
          state[payload?.folderId].prev = payload?.data;
          state[payload?.folderId].current = state[payload?.folderId]?.next;
          return {
            ...state,
          };
        }
        if (payload?.isPreviousButtonClicked) {
          state[payload?.folderId].next = state[payload?.folderId]?.current;
          state[payload?.folderId].current = state[payload?.folderId]?.prev;
        }
        if (!payload?.isPreviousButtonClicked) {
          state[payload?.folderId].prev = payload?.data;
        }
      }
      if (payload === "delete") {
        state = [];
        return state;
      }
    default:
      return state;
  }
};

export const updateAddToFolderCache = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_ADD_TO_FOLDER_CACHE:
      if (payload?.isFolderCached !== undefined) {
        payload.isFolderCached = false;
      }
      return payload;
    default:
      return state;
  }
};

export const updateArchiveLoader = (state = false, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_ARCHIVE_LOADER:
      return payload;
    default:
      return state;
  }
};

export const updateMostFrequent = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.UPDATE_MOST_FREQUENT:
      return payload;
    default:
      return state;
  }
};

export const updateAppliactionType = (state = 0, { type, payload }) => {
  switch (type) {
    case ACTIONS.APPLICATION_TYPE:
      return payload;
    default:
      return state;
  }
};

