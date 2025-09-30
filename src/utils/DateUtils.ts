export const getCurrentDate = (): Date => new Date();

export const parseShortStringToDateTime = (dateStr: string | undefined): string => {
  if (!dateStr) return '';

  const dateParts = dateStr.toString().split(',');

  return `${dateParts[2].padStart(2, '0')}/${(parseInt(dateParts[1], 10) + 1)
    .toString()
    .padStart(2, '0')}/${dateParts[0].slice(-2)} ${dateParts[3].padStart(2, '0')}:${dateParts[4].padStart(2, '0')}`;
};

export const formatIsoDateToBrDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

export const formatDateToYMDString = (date: Date | undefined): string => {
  if (!date) return '';

  const dateObj = new Date(date);
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const day = dateObj.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatDateToYMString = (date: Date | undefined): string => {
  if (!date) return '';

  const dateObj = new Date(date);
  const year = dateObj.getFullYear().toString();
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');

  return `${year}-${month}`;
};

export const parseDateStringToDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

export const isDateValid = (date: any): boolean => {
  if (typeof date === 'number' || typeof date === 'string') {
    date = new Date(date);
  }
  return date instanceof Date && !isNaN(date.getTime());
};
