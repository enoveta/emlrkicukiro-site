/** Helpers for the weekly programme and church calendar. Days use JS numbering: 0 = Sunday. */

export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Rwanda weeks start on Monday

export const DAY_NAMES = {
  en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  rw: ['Ku Cyumweru', 'Ku wa Mbere', 'Ku wa Kabiri', 'Ku wa Gatatu', 'Ku wa Kane', 'Ku wa Gatanu', 'Ku wa Gatandatu'],
};

export const DAY_SHORT = {
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  rw: ['Cyu', 'Mbe', 'Kab', 'Gat', 'Kan', 'Gtn', 'Gtd'],
};

/** Colour + label per activity type (labels live in translations under schedule.categories). */
export const CATEGORY_STYLES = {
  service: { dot: 'bg-ink', chip: 'bg-paper-featured text-ink border-[#d9cfb6]', bar: 'border-l-ink' },
  prayer: { dot: 'bg-purple-600', chip: 'bg-purple-50 text-purple-800 border-purple-200', bar: 'border-l-purple-600' },
  choir: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-900 border-amber-200', bar: 'border-l-amber-500' },
  fellowship: { dot: 'bg-emerald-600', chip: 'bg-emerald-50 text-emerald-800 border-emerald-200', bar: 'border-l-emerald-600' },
  youth: { dot: 'bg-cyan-600', chip: 'bg-cyan-50 text-cyan-900 border-cyan-200', bar: 'border-l-cyan-600' },
  children: { dot: 'bg-pink-500', chip: 'bg-pink-50 text-pink-800 border-pink-200', bar: 'border-l-pink-500' },
  meeting: { dot: 'bg-slate-600', chip: 'bg-slate-100 text-slate-800 border-slate-300', bar: 'border-l-slate-600' },
  other: { dot: 'bg-gray-400', chip: 'bg-gray-100 text-gray-700 border-gray-300', bar: 'border-l-gray-400' },
  event: { dot: 'bg-red-600', chip: 'bg-red-50 text-red-800 border-red-200', bar: 'border-l-red-600' },
  notice: { dot: 'bg-yellow-400', chip: 'bg-yellow-50 text-yellow-900 border-yellow-200', bar: 'border-l-yellow-400' },
};

export const styleFor = (category) => CATEGORY_STYLES[category] || CATEGORY_STYLES.other;

const RW_HOURS = ['kumi n’ebyiri', 'moya', 'mbiri', 'tatu', 'yine', 'tanu', 'sita', 'saba', 'munani', 'cyenda', 'kumi', 'kumi n’imwe'];

/**
 * "08:00" → "8:00 AM" (en) or "saa mbiri za mu gitondo" (rw — Rwandan clock starts at 6:00).
 */
export function formatTime(value, lang = 'en') {
  if (!value) return '';
  const [h, m] = value.split(':').map(Number);
  if (Number.isNaN(h)) return value;
  if (lang !== 'rw') {
    const hour12 = h % 12 || 12;
    return `${hour12}:${String(m || 0).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
  }
  const word = RW_HOURS[(h - 6 + 12) % 12];
  const minutes = !m ? '' : m === 30 ? ' n’igice' : ` n’iminota ${m}`;
  const period =
    h >= 5 && h < 12 ? ' za mu gitondo' : h >= 12 && h < 17 ? ' z’amanywa' : h >= 17 && h < 21 ? ' z’umugoroba' : ' z’ijoro';
  return `saa ${word}${minutes}${period}`;
}

export const formatRange = (item, lang) =>
  item.endTime ? `${formatTime(item.startTime, lang)} - ${formatTime(item.endTime, lang)}` : formatTime(item.startTime, lang);

/** Does a recurring item happen on this date? Handles "first/second/.../last weekday of the month". */
export const daysOf = (item) => item.days || (item.dayOfWeek !== undefined ? [item.dayOfWeek] : []);

export function occursOn(item, date) {
  if (!daysOf(item).includes(date.getDay())) return false;
  const rule = item.recurrence || 'every';
  if (rule === 'every') return true;
  const nth = Math.ceil(date.getDate() / 7);
  if (rule === 'last') {
    const next = new Date(date);
    next.setDate(date.getDate() + 7);
    return next.getMonth() !== date.getMonth();
  }
  return { first: 1, second: 2, third: 3, fourth: 4 }[rule] === nth;
}

const minutesOf = (t) => {
  const [h, m] = (t || '0:0').split(':').map(Number);
  return h * 60 + (m || 0);
};

/** The activity happening now (within its time range, or 90 min after start) or the next one this week. */
export function nowAndNext(items, now = new Date()) {
  const today = items.filter((i) => occursOn(i, now));
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const current = today.find((i) => {
    const start = minutesOf(i.startTime);
    const end = i.endTime ? minutesOf(i.endTime) : start + 90;
    return nowMin >= start && nowMin < end;
  });
  for (let offset = 0; offset < 35; offset += 1) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
    const candidates = items
      .filter((i) => occursOn(i, day) && (offset > 0 || minutesOf(i.startTime) > nowMin))
      .sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime));
    if (candidates.length) return { current, next: candidates[0], nextDate: day };
  }
  return { current, next: null, nextDate: null };
}

export const sortByTime = (list) => [...list].sort((a, b) => minutesOf(a.startTime) - minutesOf(b.startTime));

export const sameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

/** Events are stored as UTC calendar days. */
export const utcDay = (value) => {
  const d = new Date(value);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

/**
 * Short label for the days of an activity, like the parish slides:
 * [1..6] → "Ku wa Mbere - Ku wa Gatandatu", all 7 → "Buri munsi", [4] → "Ku wa Kane".
 */
export function daysLabel(days, lang = 'en') {
  const order = [...new Set(days)].sort((a, b) => WEEK_ORDER.indexOf(a) - WEEK_ORDER.indexOf(b));
  if (!order.length) return '';
  if (order.length === 7) return lang === 'rw' ? 'Buri munsi' : 'Every day';
  const idx = order.map((d) => WEEK_ORDER.indexOf(d));
  const contiguous = idx.every((v, i) => i === 0 || v === idx[i - 1] + 1);
  if (contiguous && order.length >= 3) {
    return `${DAY_NAMES[lang][order[0]]} - ${DAY_NAMES[lang][order[order.length - 1]].replace(/^Ku /, 'ku ')}`;
  }
  return order.map((d) => DAY_NAMES[lang][d]).join(', ');
}

/** Programme order: Sunday services first, then by first weekday (Monday first), then by time. */
export function sortProgramme(items) {
  const key = (i) => {
    const days = daysOf(i);
    const first = Math.min(...days.map((d) => WEEK_ORDER.indexOf(d)));
    return [days.includes(0) && days.length === 1 ? 0 : 1, first, minutesOf(i.startTime)];
  };
  return [...items].sort((a, b) => {
    const ka = key(a);
    const kb = key(b);
    return ka[0] - kb[0] || ka[1] - kb[1] || ka[2] - kb[2];
  });
}

export const timeRange = (item) => (item.endTime ? `${item.startTime} - ${item.endTime}` : item.startTime);
