"use client";

import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { NgayLe } from "@/types/system";
import "dayjs/locale/vi";
import { theme } from "antd";

dayjs.locale("vi");

interface HolidayCalendarProps {
  holidays: NgayLe[];
}

const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export default function HolidayCalendar({ holidays = [] }: HolidayCalendarProps) {
  const { token } = theme.useToken();
  const [currentMonth, setCurrentMonth] = useState(() => dayjs().startOf("month"));

  const prevMonth = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth((m) => m.add(1, "month"));
  const goToday = () => setCurrentMonth(dayjs().startOf("month"));

  const getHolidaysForDay = (day: Dayjs): NgayLe[] =>
    holidays.filter((h) => {
      const hd = dayjs(h.NgayLe);
      if (h.LapLaiHangNam)
        return hd.date() === day.date() && hd.month() === day.month();
      return hd.isSame(day, "day");
    });

  /** Build 6-row × 7-col grid of cells */
  const buildCells = (): (Dayjs | null)[] => {
    const firstDay = currentMonth.startOf("month");
    const offset = firstDay.day() === 0 ? 6 : firstDay.day() - 1; // shift so Mon=0
    const daysInMonth = currentMonth.daysInMonth();
    const cells: (Dayjs | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(currentMonth.date(d));
    while (cells.length < 42) cells.push(null); // always 6 rows
    return cells;
  };

  const cells = buildCells();
  const today = dayjs();

  return (
    <div className="gcal-wrap">
      {/* ── Top bar ── */}
      <div className="gcal-topbar">
        <div className="gcal-topbar-left">
          <button className="gcal-today-btn" onClick={goToday}>
            Hôm nay
          </button>
          <button className="gcal-nav" onClick={prevMonth} aria-label="Tháng trước">
            ‹
          </button>
          <button className="gcal-nav" onClick={nextMonth} aria-label="Tháng sau">
            ›
          </button>
          <span className="gcal-title">
            Tháng {currentMonth.month() + 1} năm {currentMonth.year()}
          </span>
        </div>
        <div className="gcal-legend">
          <span className="gcal-legend-dot" /> Ngày lễ
        </div>
      </div>

      {/* ── Calendar grid ── */}
      <div className="gcal-grid-wrap">
        {/* Weekday headers */}
        <div className="gcal-header-row">
          {WEEKDAYS.map((d, i) => (
            <div key={d} className={`gcal-wday ${i === 6 ? "gcal-sun" : ""}`}>
              {d}
            </div>
          ))}
        </div>

        {/* Day cells – 6 rows */}
        <div className="gcal-body">
          {cells.map((day, idx) => {
            if (!day) {
              return <div key={`e-${idx}`} className="gcal-cell gcal-cell-empty" />;
            }

            const dayHolidays = getHolidaysForDay(day);
            const isHoliday = dayHolidays.length > 0;
            const isToday = day.isSame(today, "day");
            const isSunday = idx % 7 === 6;

            return (
              <div
                key={day.format("YYYY-MM-DD")}
                className={[
                  "gcal-cell",
                  isHoliday ? "gcal-cell-holiday" : "",
                  isToday ? "gcal-cell-today" : "",
                ].join(" ")}
              >
                {/* Date number */}
                <div
                  className={[
                    "gcal-daynum",
                    isToday ? "gcal-daynum-today" : "",
                    isHoliday && !isToday ? "gcal-daynum-holiday" : "",
                    isSunday && !isToday && !isHoliday ? "gcal-daynum-sun" : "",
                  ].join(" ")}
                >
                  {day.date()}
                </div>

                {/* Holiday badges inside cell */}
                <div className="gcal-events">
                  {dayHolidays.map((h, i) => (
                    <div key={i} className="gcal-event-pill">
                      <span className="gcal-event-dot" />
                      <span className="gcal-event-name" style={{ fontWeight: 400 }}>{h.TenNgayLe}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* ── Wrapper ── */
        .gcal-wrap {
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.10);
          overflow: hidden;
          width: 100%;
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
          display: flex;
          flex-direction: column;
          height: calc(100vh - 180px);
          min-height: 560px;
        }

        /* ── Top bar ── */
        .gcal-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1.5px solid #f0f0f0;
          background: #fff;
          flex-shrink: 0;
        }
        .gcal-topbar-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .gcal-today-btn {
          border: 1.5px solid ${token.colorPrimary};
          background: #fff;
          color: ${token.colorPrimary};
          border-radius: 20px;
          padding: 5px 18px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.18s;
          margin-right: 4px;
        }
        .gcal-today-btn:hover { background: ${token.colorPrimary}; color: #fff; }
        .gcal-nav {
          background: none;
          border: none;
          font-size: 26px;
          color: #555;
          cursor: pointer;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          line-height: 1;
        }
        .gcal-nav:hover { background: #f5f5f5; color: ${token.colorPrimary}; }
        .gcal-title {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a2e;
          margin-left: 6px;
        }
        .gcal-legend {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          color: #888;
        }
        .gcal-legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${token.colorPrimary};
          display: inline-block;
        }

        /* ── Grid wrapper ── */
        .gcal-grid-wrap {
          display: flex;
          flex-direction: column;
          flex: 1;
          overflow: hidden;
        }

        /* Weekday header row */
        .gcal-header-row {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          border-bottom: 1.5px solid #f0f0f0;
          background: #fafafa;
          flex-shrink: 0;
        }
        .gcal-wday {
          text-align: center;
          padding: 10px 0;
          font-size: 12px;
          font-weight: 700;
          color: #aaa;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .gcal-sun { color: ${token.colorPrimary}; }

        /* Body = 6-row grid */
        .gcal-body {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          grid-template-rows: repeat(6, 1fr);
          flex: 1;
          overflow: hidden;
        }

        /* Each cell */
        .gcal-cell {
          border-right: 1px solid #f0f0f0;
          border-bottom: 1px solid #f0f0f0;
          padding: 6px 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-height: 0;
          overflow: hidden;
          transition: background 0.12s;
          cursor: default;
        }
        .gcal-cell:nth-child(7n) { border-right: none; }
        .gcal-cell:hover { background: #fafafa; }

        .gcal-cell-empty {
          background: #fafafa;
        }

        /* Holiday cell: subtle red tint */
        .gcal-cell-holiday {
          background: ${token.colorPrimary}0A;
        }
        .gcal-cell-holiday:hover { background: ${token.colorPrimary}1A; }

        /* Today cell */
        .gcal-cell-today {
          background: ${token.colorInfo}1A !important;
        }
        .gcal-cell-today:hover { background: ${token.colorInfo}33 !important; }

        /* Day number */
        .gcal-daynum {
          font-size: 13px;
          font-weight: 500;
          color: #444;
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          align-self: flex-start;
        }
        .gcal-daynum-today {
          background: ${token.colorInfo};
          color: #fff !important;
          font-weight: 700;
        }
        .gcal-daynum-holiday {
          background: ${token.colorPrimary};
          color: #fff !important;
          font-weight: 700;
          box-shadow: 0 2px 8px ${token.colorPrimary}59;
        }
        .gcal-daynum-sun { color: ${token.colorPrimary}; }

        /* Event pill (holiday label inside cell) */
        .gcal-events {
          display: flex;
          flex-direction: column;
          gap: 3px;
          overflow: hidden;
        }
        .gcal-event-pill {
          display: flex;
          align-items: center;
          gap: 5px;
          background: transparent;
          border-radius: 4px;
          padding: 2px 4px;
          overflow: hidden;
        }
        .gcal-event-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${token.colorPrimary};
          flex-shrink: 0;
        }
        .gcal-event-name {
          font-size: 11px;
          font-weight: 400;
          color: ${token.colorPrimary};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Responsive */
        @media (max-width: 700px) {
          .gcal-wrap { height: auto; min-height: unset; }
          .gcal-event-name { font-size: 9px; }
          .gcal-daynum { font-size: 11px; width: 22px; height: 22px; }
          .gcal-cell { padding: 4px; }
        }
      `}</style>
    </div>
  );
}
