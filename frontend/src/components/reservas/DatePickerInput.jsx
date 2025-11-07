import React, { useMemo, useState } from 'react';

const DOW = ['DO','LU','MA','MI','JU','VI','SA'];
const MONTHS = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

function pad(n) { return String(n).padStart(2, '0'); }
function parseISO(iso) {
  if (!iso) {
    const d = new Date();
    return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate() };
  }
  const [y, m, d] = iso.split('-').map(Number);
  return { y, m: m - 1, d };
}
function toISO(y, m0, d) {
  const m = m0 + 1;
  return `${y}-${pad(m)}-${pad(d)}`;
}

const DatePickerInput = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => parseISO(value));

  const todayISO = useMemo(() => {
    const t = new Date();
    return toISO(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);

  const grid = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = first.getDay(); // 0 = domingo
    const daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
    const prevMonthDays = new Date(view.y, view.m, 0).getDate();

    const cells = [];
    // prev tail
    for (let i = startDow - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const mPrev = view.m - 1;
      const yPrev = mPrev < 0 ? view.y - 1 : view.y;
      const mAdj = mPrev < 0 ? 11 : mPrev;
      cells.push({ iso: toISO(yPrev, mAdj, d), d, muted: true, selected: false });
    }
    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISO(view.y, view.m, d);
      cells.push({ iso, d, muted: false, selected: iso === value });
    }
    // fill to 6 rows
    while (cells.length % 7 !== 0) {
      const nextIndex = cells.length - (startDow + daysInMonth);
      const d = nextIndex + 1;
      const mNext = view.m + 1;
      const yNext = mNext > 11 ? view.y + 1 : view.y;
      const mAdj = mNext > 11 ? 0 : mNext;
      const iso = toISO(yNext, mAdj, d);
      cells.push({ iso, d, muted: true, selected: false });
    }
    return cells;
  }, [view.y, view.m, value]);

  const prevMonth = () => {
    const m = view.m - 1;
    setView({ y: m < 0 ? view.y - 1 : view.y, m: m < 0 ? 11 : m, d: 1 });
  };
  const nextMonth = () => {
    const m = view.m + 1;
    setView({ y: m > 11 ? view.y + 1 : view.y, m: m > 11 ? 0 : m, d: 1 });
  };

  const selectISO = (iso) => {
    onChange?.(iso);
    setOpen(false);
  };

  return (
    <div className="date-input">
      <input
        className="input"
        type="text"
        value={value || ''}
        readOnly
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(true); }
          if (e.key === 'Escape') { setOpen(false); }
        }}
        aria-haspopup="dialog"
        aria-expanded={open}
      />
      <button type="button" className="date-input__btn" onClick={() => setOpen((v) => !v)} aria-label="Abrir calendario">
        {/* pequeño icono */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="4" width="18" height="18" rx="4" stroke="#D4AF37" strokeWidth="2" />
          <line x1="8" y1="2" x2="8" y2="8" stroke="#D4AF37" strokeWidth="2" />
          <line x1="16" y1="2" x2="16" y2="8" stroke="#D4AF37" strokeWidth="2" />
          <rect x="6" y="10" width="12" height="8" rx="2" fill="#D4AF37" opacity="0.15" />
        </svg>
      </button>

      {open && (
        <div className="date-popover">
          <div className="date-popover__header">
            <div className="date-popover__title">{MONTHS[view.m]} de {view.y}</div>
            <div className="date-popover__nav">
              <button type="button" className="date-popover__btn" onClick={prevMonth} aria-label="Mes anterior">◄</button>
              <button type="button" className="date-popover__btn" onClick={nextMonth} aria-label="Mes siguiente">►</button>
            </div>
          </div>
          <div className="date-grid">
            {DOW.map((d) => (
              <div key={d} className="date-grid__dow">{d}</div>
            ))}
            {grid.map((c, idx) => (
              <button
                key={c.iso + idx}
                type="button"
                className={`date-cell${c.muted ? ' muted' : ''}${c.selected ? ' selected' : ''}${c.iso === todayISO ? ' today' : ''}`}
                onClick={() => !c.muted && selectISO(c.iso)}
              >
                {c.d}
              </button>
            ))}
          </div>
          <div className="date-popover__footer">
            <button type="button" className="date-popover__link" onClick={() => selectISO(todayISO)}>Hoy</button>
            <button type="button" className="date-popover__link" onClick={() => selectISO('')}>Limpiar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePickerInput;