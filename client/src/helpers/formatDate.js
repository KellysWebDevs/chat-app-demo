const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const getFormattedDate = (date, prefomattedDate = false, hideYear = false) => {
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12;
  let minutes = date.getMinutes();
  const period = date.getHours() < 12 ? "am" : "pm";

  if (minutes < 10) {
    // Adding leading zero to minutes
    minutes = `0${minutes}`;
  }

  if (prefomattedDate) {
    // Today @ 10:20 am
    // Yesterday @ 10:20 pm
    return `${prefomattedDate} @ ${hours}:${minutes} ${period}`;
  }

  if (hideYear) {
    // 10. January @ 10:20 am
    return `${day}. ${month} @ ${hours}:${minutes} ${period}`;
  }

  // 10. January 2017. @ 10:20 pm
  return `${day}. ${month} ${year}. @ ${hours}:${minutes} ${period}`;
};

// --- Main function
const timeAgo = (dateParam) => {
  if (!dateParam) {
    return null;
  }

  const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
  const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
  const today = new Date();
  const yesterday = new Date(today - DAY_IN_MS);
  const seconds = Math.round((today - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const isToday = today.toDateString() === date.toDateString();
  const isYesterday = yesterday.toDateString() === date.toDateString();
  const isThisYear = today.getFullYear() === date.getFullYear();

  if (seconds < 5) {
    return "now";
  } else if (seconds < 60) {
    return `${seconds} seconds ago`;
  } else if (seconds < 90) {
    return "about a minute ago";
  } else if (minutes < 60) {
    return `${minutes} minutes ago`;
  } else if (isToday) {
    return getFormattedDate(date, "Today"); // Today @ 10:20 am
  } else if (isYesterday) {
    return getFormattedDate(date, "Yesterday"); // Yesterday @ 10:20 pm
  } else if (isThisYear) {
    return getFormattedDate(date, false, true); // 10. January @ 10:20 am
  }

  return getFormattedDate(date); // 10. January 2017. @ 10:20 pm
};

export default timeAgo;
