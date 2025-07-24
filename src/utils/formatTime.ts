import { format, parse } from 'date-fns';

export const formatTo12Hour = (time24: string) => {
  const parsed = parse(time24, 'HH:mm', new Date());
  return format(parsed, 'hh:mm a');
};
