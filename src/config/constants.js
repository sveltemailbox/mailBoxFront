export const LOGIN = "/api/users/login";
export const GET_FOLDER = "/api/folders/getFoldersByuser";
export const CREATE_FOLDER = "/api/folders/addFolder/";
export const EDIT_FOLDER = "/api/folders/updateFolder/";
export const REMOVE_FOLDER = "/api/folders/deleteFolder/";
export const GET_ALL_MAIL = "/api/mailsTest/getAllMail";
export const GET_UNREAD_MAIL = "/api/unreadMails/unreadTableAllMail";
export const GET_UNREAD_COUNT = "/api/mailsTest/getUnreadCount";
//export const GET_UNREAD_COUNT = "/api/unreadMails/unreadTableUnreadCount";
export const UPDATE_STAR = "/api/mails/update/";
export const GET_MAIL_BY_ID = "/api/mails/mailById";
export const UPDATE_MAIL = "/api/mails";
export const UPDATE_MAIL_BY_ID = "/api/mails/update";
export const USER_PROFILE = "/api/users/userProfile";
export const GET_LIST_DESIGNATION = "/api/designation";
export const COMMENT_ON_MAIL = "/api/comments/commentOnMail";
export const GET_COMMENTS = "/api/comments/getMailComments";
export const GET_PRE_DEFINED_COMMENTS = "/api/static/getStaticComments";
export const GET_LIST_STATIONS = "/api/mails/getUserStations?";
export const CHANGE_PASSWORD = "/api/users/changePassword";
export const LOGS_ADD = "/api/logs/add";
export const TRACK_MAIL = "/api/history/mailhistory";
export const FREQUENT_ADDRESSES = "/api/users/frequentlyUsedDesignations";
export const IMAGE_UPLOAD_BODY = "/api/mails/uploadBodyImage";
export const COMPOSE_MAIL = "/api/mails/composeMail";
export const UPLOAD_ATTACHMENT = "/api/attachment/uploadfile";
export const IMAGE_FETCH = "/api/images/fetch";
export const GET_COLOR_CODE = "/api/users/documentColorCode";
export const ANNOTATION_ADD = "/api/annotation";
export const GET_ALL_STATION = "/api/designation/allStations";
export const ADD_PREFERENCES = "/api/preferences/add";
export const ADD_PREFERENCES_MAIL_PER_PAGE = "/api/preferences/mailPerPage";
export const GET_PREFERENCES = "/api/preferences";
export const ANNOTATION = "/api/annotation";
export const BULK_UPDATE = "/api/mails/bulkUpdate";
export const SWITCH_USER = "/api/users/switch_user";
export const UNLINK_ATTACHMENT = "/api/attachment/deletefile/";
export const GET_ATTACHMENT_DETAILS = "/api/attachment/attchmentDetailsById";
export const LEAVE_ENABLE = "/api/leave/";
export const LOGOUT = "/api/users/sign_out";
export const GET_ALL_BRANCH = "/api/designation/getAllBranches";
export const GET_SPECIFIC_BRANCH = "/api/designation/getDesignationThBranch/";
export const GET_STATION_FILTER = "/api/mailsTest/getStationMail";
export const GET_MAIL_FOLDERS = "/api/mails/folderId";
export const GET_TOTAL_MAIL_COUNT = "/api/mailsTest/getTotalCount";
export const DOWNLOAD_ALL = "/api/attachment/downloadzip";
export const GET_TOTAL_UNREAD_MAIL_COUNT =
  "/api/unreadMails/unreadTableTotalCount";
export const SWITCH_APPLICATION = "/api/appSwitch"  
  
export const UPDATE_PROFILE = "/api/users/updateUserProfile"

export const MOST_FREQUENT_STATUS = "/api/preferences/mostRecentFrequent"

export const UPPERCASE_PATTERN = /[A-Z]/;

export const LOWERCASE_PATTERN = /[a-z]/;

export const NUMBER_PATTER = /[0-9]/;
export const SPECIAL_CHAR_PATTERN = /[!@#$%^&*]/;

export const PASSWORD_LENGTH = 8;
