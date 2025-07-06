import dayjs from "dayjs";
import es from "dayjs/locale/es";

export default function formatOrderDate(date: string | Date): string {
  dayjs.locale(es);
  return dayjs(date).format("DD MMMM, YYYY h:mm A");
}
