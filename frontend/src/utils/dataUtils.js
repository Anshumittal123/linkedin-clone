import { format, parseISO, isValid } from "date-fns";

export const formatDate = (dateString) => {
	const date = parseISO(dateString);
	return isValid(date) ? format(date, "MMM yyyy") : "Present";
};

export function formatMessageTime(date) {
	return new Date(date).toLocaleTimeString("en-US", {
	  hour: "2-digit",
	  minute: "2-digit",
	  hour12: false,
	});
  }