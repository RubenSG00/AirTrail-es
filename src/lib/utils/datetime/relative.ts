import { format, isToday, isTomorrow, isYesterday, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatRelativeDate = (date: Date) => {
  if (!isValid(date)) return '';

  if (isToday(date)) return 'Hoy';
  if (isYesterday(date)) return 'Ayer';
  if (isTomorrow(date)) return 'Mañana';

  return format(date, 'PP', { locale: es });
};
