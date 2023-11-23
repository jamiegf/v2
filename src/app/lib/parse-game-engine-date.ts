import { parse } from 'date-fns';

export const parseGameEngineDate = (dateString: string): Date => {
  const date = parse(dateString, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (isNaN(date.getTime())) {
    throw new TypeError('Date string is invalid format', { cause: dateString });
  }
  return date;
};
