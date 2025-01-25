export const formatDate = (dateString: string) => {
  const [day, month, year] = dateString.split(".");
  return `${year}-${month}-${day}`; // DD.MM.YYYY -> YYYY-MM-DD
};
export const formatDate2 = (dateString: string) => {
  const [year, month, day] = dateString.split(".");
  return `${year}-${month}-${day}`; // YYYY.MM.DD -> YYYY-MM-DD
};
export const formatDateToDisplay = (dateString: string) => {
  // YYYY-MM-DD -> DD.MM.YYYY
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};
