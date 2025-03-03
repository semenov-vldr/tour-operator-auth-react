const reverseDate = (date) => {
  if (!date) return "";
  const parts = date.split('-');
  if (parts.length !== 3) return "Ошибка даты";
  return parts.reverse().join('-');
};

export default reverseDate;