export function getTimeFromISO(iso_time) {
  const dateObject = new Date(iso_time);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const hour = dateObject.getHours();
  const minutes = dateObject.getMinutes();

  return `${day}/${month}/${year} ${hour.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function getExpirationTime(iso_time) {
  const expirationDate = new Date(iso_time);
  const now = new Date();
  const differenceMs = expirationDate - now;
  const minutes = Math.floor(differenceMs / (1000 * 60));
  const seconds = Math.floor((differenceMs / 1000) % 60);

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return formattedTime;
}

export const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

export const checkValidCurrency = (amount, min_amount, max_amount) => {
  if (
    Number(amount) >= Number(min_amount) &&
    Number(amount) <= Number(max_amount)
  ) {
    return true;
  } else {
    return false;
  }
};
