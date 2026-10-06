import { useEffect, useMemo, useRef, useState } from 'react';

/* Validated categorical slots (light surface): teal, gold, violet (all checks pass). Colour follows the entity, never its rank. */
export const SERIES = ['#1a7aa0', '#c9822a', '#7a5cc0'];
const GRID = '#efebe3';
const MUTED = '#8a8984';
const INK = '#143642';
const SPARK = '#b9b8b3';

const nf = new Intl.NumberFormat('en-US');
export const compact = (n) => (n >= 10000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}K` : nf.format(n));

const niceMax = (v) => {
  if (v <= 4) return 4;
  const p = 10 ** Math.floor(Math.log10(v));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
};

function useWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(600);
  useEffect(() => {
    if (!ref.current) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, e.contentRect.width)));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
}

const shortDate = (iso) => {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
};

/** Sparkline for stat tiles: de-emphasis grey, last point in the accent. */
export function Sparkline({ values, color = SERIES[0], width = 120, height = 32 }) {
  if (!values.length) return null;
  const max = Math.max(1, ...values);
  const step = values.length > 1 ? width / (values.length - 1) : 0;
  const pts = values.map((v, i) => [i * step, height - 3 - (v / max) * (height - 6)]);
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="overflow-visible">
      <polyline points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={SPARK} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="4" fill={color} stroke="#fff" strokeWidth="2" />
    </svg>
  );
}

/** KPI tile: label, value, delta vs previous period, optional sparkline. */
export function StatTile({ label, value, previous, trend, upIsGood = true, periodLabel, icon: Icon }) {
  const delta = previous ? Math.round(((value - previous) / previous) * 100) : null;
  const good = delta === null || delta === 0 ? null : (delta > 0) === upIsGood;
  return (
    <div className="a-card flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[13px] font-semibold text-[#66777a]">{label}</p>
        {Icon ? (
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#f3efe6] text-gold">
            <Icon aria-hidden="true" />
          </span>
        ) : null}
      </div>
      <div className="flex items-end justify-between gap-3">
        <p className="text-[2rem] font-bold leading-none tracking-[-0.02em] text-ink tabular-nums">{compact(value)}</p>
        {trend ? <Sparkline values={trend} /> : null}
      </div>
      <p className="text-xs text-[#7b8a8c]">
        {delta === null ? (
          <span>No data for the previous {periodLabel}</span>
        ) : (
          <>
            <span
              className={`mr-1 inline-flex items-center rounded-full px-1.5 py-0.5 font-semibold ${
                good === null ? 'bg-[#f2f4f7] text-[#475467]' : good ? 'bg-[#ecfdf3] text-[#067647]' : 'bg-[#fef3f2] text-[#b42318]'
              }`}
            >
              {delta > 0 ? '↑' : delta < 0 ? '↓' : '•'} {delta > 0 ? '+' : ''}
              {delta}%
            </span>
            vs previous {periodLabel}
          </>
        )}
      </p>
    </div>
  );
}

/**
 * Daily trend: one axis, up to three series of the same unit. 2px lines, a 10% area wash
 * under the first series, hairline grid, crosshair + tooltip listing every series.
 */
export function TrendChart({ data, series, height = 260 }) {
  const [ref, width] = useWidth();
  const [hover, setHover] = useState(null);
  const pad = { top: 16, right: 16, bottom: 28, left: 40 };
  const w = width - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;
  const max = niceMax(Math.max(1, ...data.flatMap((d) => series.map((s) => d[s.key]))));
  const x = (i) => pad.left + (data.length > 1 ? (i / (data.length - 1)) * w : w / 2);
  const y = (v) => pad.top + h - (v / max) * h;
  const ticks = [0, max / 4, max / 2, (3 * max) / 4, max];
  // About one date label per 90px so they never collide on small screens.
  const labelEvery = Math.max(1, Math.ceil(data.length / Math.max(2, Math.floor(w / 90))));

  const paths = useMemo(
    () =>
      series.map((s) => ({
        ...s,
        line: data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d[s.key])}`).join(''),
      })),
    [data, series, width] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const area = data.length
    ? `${paths[0].line}L${x(data.length - 1)},${pad.top + h}L${x(0)},${pad.top + h}Z`
    : '';

  const onMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const i = Math.round(((px - pad.left) / w) * (data.length - 1));
    setHover(Math.min(data.length - 1, Math.max(0, i)));
  };

  const hd = hover !== null ? data[hover] : null;

  return (
    <div ref={ref} className="relative">
      <div className="flex flex-wrap gap-4 mb-3 text-sm text-[#66777a]">
        {series.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-2">
            <span className="w-4 h-0.5 rounded" style={{ background: s.color }} aria-hidden="true" />
            {s.label}
          </span>
        ))}
      </div>
      <svg
        width={width}
        height={height}
        role="img"
        aria-label={`${series.map((s) => s.label).join(' and ')} per day`}
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
        className="touch-none select-none"
      >
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={pad.left + w} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth="1" />
            <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize="11" fill={MUTED} className="tabular-nums">
              {compact(Math.round(t))}
            </text>
          </g>
        ))}
        {data.map((d, i) =>
          i % labelEvery === 0 || i === data.length - 1 ? (
            <text key={d.date} x={x(i)} y={height - 8} textAnchor="middle" fontSize="11" fill={MUTED}>
              {shortDate(d.date)}
            </text>
          ) : null
        )}
        <path d={area} fill={series[0].color} opacity="0.1" />
        {paths.map((p) => (
          <path key={p.key} d={p.line} fill="none" stroke={p.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {data.length
          ? paths.map((p) => (
              <circle key={p.key} cx={x(data.length - 1)} cy={y(data[data.length - 1][p.key])} r="4" fill={p.color} stroke="#fff" strokeWidth="2" />
            ))
          : null}
        {hd ? (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={pad.top + h} stroke="#9a998f" strokeWidth="1" />
            {series.map((s) => (
              <circle key={s.key} cx={x(hover)} cy={y(hd[s.key])} r="4" fill={s.color} stroke="#fff" strokeWidth="2" />
            ))}
          </g>
        ) : null}
      </svg>
      {hd ? (
        <div
          className="pointer-events-none absolute z-10 bg-white border border-[#e9e5dc] shadow-lg rounded-xl px-3 py-2 text-sm"
          style={{
            left: Math.min(Math.max(x(hover) + 12, 0), width - 170),
            top: 34,
          }}
        >
          <p className="text-xs text-[#7b8a8c] mb-1">{shortDate(hd.date)}</p>
          {series.map((s) => (
            <p key={s.key} className="flex items-center gap-2">
              <span className="w-3 h-0.5 rounded" style={{ background: s.color }} aria-hidden="true" />
              <span className="font-semibold text-ink tabular-nums">{nf.format(hd[s.key])}</span>
              <span className="text-[#7b8a8c]">{s.label}</span>
            </p>
          ))}
        </div>
      ) : null}
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer text-[#7b8a8c] hover:text-ink">View as table</summary>
        <div className="max-h-56 overflow-auto mt-2">
          <table className="w-full text-left">
            <thead className="text-[#7b8a8c]">
              <tr>
                <th className="py-1 font-medium">Date</th>
                {series.map((s) => (
                  <th key={s.key} className="py-1 font-medium text-right">
                    {s.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {[...data].reverse().map((d) => (
                <tr key={d.date} className="border-t border-[#f0ede6]">
                  <td className="py-1">{shortDate(d.date)}</td>
                  {series.map((s) => (
                    <td key={s.key} className="py-1 text-right">
                      {nf.format(d[s.key])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}

/** Horizontal bars, one colour, value at the tip. */
export function BarList({ items, color = SERIES[0], empty = 'No data yet' }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (!items.length) return <p className="text-sm text-[#7b8a8c] py-6 text-center">{empty}</p>;
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key} title={`${item.label}: ${nf.format(item.count)}`}>
          <div className="flex justify-between gap-3 text-sm mb-1">
            <span className="text-[#334c51] truncate">{item.label}</span>
            <span className="font-semibold text-ink tabular-nums">{nf.format(item.count)}</span>
          </div>
          <div className="h-2 rounded-full bg-[#f3f1ec]">
            <div className="h-2 rounded-full" style={{ width: `${(item.count / max) * 100}%`, background: color, minWidth: 4 }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Part-to-whole in one bar: 2px surface gaps between segments, labelled legend (colour never alone). */
export function ShareBar({ items, colors, empty = 'No data yet' }) {
  const total = items.reduce((s, i) => s + i.count, 0);
  if (!total) return <p className="text-sm text-[#7b8a8c] py-6 text-center">{empty}</p>;
  return (
    <div>
      <div className="flex h-5 gap-[2px] rounded overflow-hidden" role="img" aria-label={items.map((i) => `${i.label} ${Math.round((i.count / total) * 100)}%`).join(', ')}>
        {items.map((i) => (
          <div
            key={i.key}
            title={`${i.label}: ${nf.format(i.count)} (${Math.round((i.count / total) * 100)}%)`}
            style={{ width: `${(i.count / total) * 100}%`, background: colors[i.key] || SPARK }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((i) => (
          <li key={i.key} className="flex items-center justify-between gap-3 text-sm">
            <span className="inline-flex items-center gap-2 text-[#334c51]">
              <span className="w-3 h-3 rounded-sm" style={{ background: colors[i.key] || SPARK }} aria-hidden="true" />
              {i.label}
            </span>
            <span className="tabular-nums">
              <span className="font-semibold text-ink">{Math.round((i.count / total) * 100)}%</span>
              <span className="text-[#7b8a8c]"> · {nf.format(i.count)}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const INK_COLOR = INK;
