import dayjs from "dayjs";
import es from "dayjs/locale/es";

type DateString = string | Date | undefined;

export default function formatDate(
  date: DateString,
  format: string = "DD MMMM, YYYY h:mm A"
): string {
  dayjs.locale(es);
  if (!date) return "Fecha no disponible";
  return dayjs(date).format(format);
}
