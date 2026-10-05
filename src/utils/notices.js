const DAY = 86_400_000;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Monday 00:00 of the current week (Rwanda weeks start on Monday). */
const startOfWeek = (d) => {
  const s = startOfDay(d);
  return new Date(s.getTime() - ((s.getDay() + 6) % 7) * DAY);
};

export const isExpired = (notice, now = new Date()) =>
  Boolean(notice.expiresAt) && new Date(notice.expiresAt) <= now;

/** Which tab a notice belongs to: today | week | month | earlier. Expired notices are always "earlier". */
export function noticePeriod(notice, now = new Date()) {
  if (isExpired(notice, now)) return 'earlier';
  const published = new Date(notice.publishDate);
  if (published >= startOfDay(now)) return 'today';
  if (published >= startOfWeek(now)) return 'week';
  if (published >= new Date(now.getFullYear(), now.getMonth(), 1)) return 'month';
  return 'earlier';
}

/** Current (non-expired) notices, pinned and urgent first, then newest. */
export function sortNotices(list) {
  const rank = (n) => (n.pinned ? 0 : n.category === 'urgent' ? 1 : 2);
  return [...list].sort(
    (a, b) => rank(a) - rank(b) || new Date(b.publishDate) - new Date(a.publishDate)
  );
}
