import { DateTime } from 'luxon';

const BOLIVIA_TZ = 'America/La_Paz';

export const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const date = new Date(dateString);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0'); 

  return `${day} de ${month} ${year}, ${hours}:${minutes}`;
};

export const nowBolivia = (): string => {
  return DateTime.now().setZone(BOLIVIA_TZ).toFormat('yyyy-MM-dd HH:mm:ss');
};


export const toBoliviaDateTime = (date: string): string => {
  const dt = date.includes('T')
    ? DateTime.fromISO(date, { zone: 'utc' })
    : DateTime.fromSQL(date, { zone: 'utc' });

  return dt.setZone(BOLIVIA_TZ).toFormat('yyyy-MM-dd HH:mm:ss');
};
