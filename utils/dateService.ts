import { DateTime } from 'luxon';

const BOLIVIA_TZ = 'America/La_Paz';

export const formatDate = (dateString: string | null) => {
  if (!dateString) return null;
  const dt = DateTime.fromISO(dateString, { zone: 'utc' }).setZone(BOLIVIA_TZ);

  const day = dt.day;
  const month = dt.toFormat('MMM').toUpperCase();
  const year = dt.year;
  const hours = dt.hour.toString().padStart(2, '0');
  const minutes = dt.minute.toString().padStart(2, '0');

  return `${day} de ${month} ${year}, ${hours}:${minutes}`;
};
