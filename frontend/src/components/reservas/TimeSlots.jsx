import React, { useMemo } from 'react';

function toMinutes(hm) {
  const [h, m] = hm.split(':').map(Number);
  return h * 60 + m;
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function toHM(total) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${pad(h)}:${pad(m)}`;
}

const isToday = (iso) => {
  const t = new Date();
  const todayIso = new Date(t.getFullYear(), t.getMonth(), t.getDate()).toISOString().slice(0, 10);
  return iso === todayIso;
};

const TimeSlots = ({ dateISO, start = '18:00', end = '23:00', stepMinutes = 30, value, onChange }) => {
  const slots = useMemo(() => {
    const startMin = toMinutes(start);
    const endMin = toMinutes(end);
    const arr = [];
    for (let t = startMin; t <= endMin; t += stepMinutes) {
      arr.push(toHM(t));
    }
    return arr;
  }, [start, end, stepMinutes]);

  const nowHM = useMemo(() => {
    const now = new Date();
    return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }, []);

  const disablePast = isToday(dateISO);

  return (
    <div className="timeslots grid grid-4">
      {slots.map((hm) => {
        const disabled = disablePast && hm < nowHM;
        const selected = value === hm;
        return (
          <button
            key={hm}
            type="button"
            className={`timeslot${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
            disabled={disabled}
            onClick={() => onChange(hm)}
          >
            {hm}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlots;