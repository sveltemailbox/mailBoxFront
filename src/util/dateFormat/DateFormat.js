import moment from "moment";

export const formatDate = (date) => {
  let finaldate = moment(date).subtract({ hours: 5, minutes: 30 });
  return finaldate.format("DD-MM-YYYY");
};

export const formatDateTime = (date) => {
  let finaldate = moment(date);
  return finaldate.format("DD-MM-YYYY hh:mm A");
};
