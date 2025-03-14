"use client";

import React, { useEffect, useState } from "react";
import { fetchRecentSchedules } from "@/lib/firebase/schedules";
import { Schedule } from "@/types/schedules";

const RecentSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const loadSchedules = async () => {
      const data = await fetchRecentSchedules();
      setSchedules(data);
    };

    loadSchedules();
  }, []);

  return (
    <div className="schedule-card">
      <h3>📅 최근 주요일정</h3>
      {schedules.length === 0 ? (
        <p>가까운 일정이 없습니다.</p>
      ) : (
        <ul>
          {schedules.slice(0, 2).map((schedule) => (
            <li key={schedule.id}>
              <strong>{schedule.type}</strong>: {schedule.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSchedule;
