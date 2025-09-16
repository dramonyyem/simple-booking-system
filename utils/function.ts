import { DateValue } from "@react-types/datepicker";

const toJSDate = (value: DateValue | null): Date | null => {
  if (!value) return null;

  return new Date(value.year, value.month - 1, value.day);
};

export const formatDate = (value: DateValue | null) => {
  const jsDate = toJSDate(value);

  if (!jsDate) return "";
  const month = String(jsDate.getMonth() + 1).padStart(2, "0");
  const day = String(jsDate.getDate()).padStart(2, "0");
  const year = jsDate.getFullYear();

  return `${year}-${month}-${day}`;
};
