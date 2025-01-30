export const toBackendDateFormat = (dateString: string) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  if (!year || !month || !day) {
    throw new Error(
      `Ungültiges Eingabeformat für toBackendDateFormat: ${dateString}`
    );
  }
  return `${day}-${month}-${year}`;
};

export const toInputDateFormat = (dateString: string) => {
  // dd-mm-yyyy -> yyyy-mm-dd
  if (!dateString) return "";
  const [day, month, year] = dateString.split("-");
  if (!year || !month || !day) {
    throw new Error(
      `Ungültiges Eingabeformat für toInputDateFormat: ${dateString}`
    );
  }
  return `${year}-${month}-${day}`;
};
