import dayjs from "dayjs";
import idr from "dayjs/locale/id";
export default (date: string) => {
  return dayjs(date).locale(idr).format("DD MMM YYYY");
};
