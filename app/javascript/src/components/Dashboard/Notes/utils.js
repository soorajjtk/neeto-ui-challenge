import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

export const convertDateToWeekdayTime = date => {
  const weekdayTime = dayjs(date).format("dddd, hh:mmA");
  return weekdayTime;
};

export const calculateCreatedAgo = date => {
  dayjs.extend(relativeTime);
  const createdAgo = dayjs(date).fromNow();
  return createdAgo;
};
