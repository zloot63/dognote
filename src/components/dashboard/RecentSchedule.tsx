"use client";

import React, { useEffect, useState } from "react";
import { listSchedulesByUser } from "@/lib/firebase/schedules";
import { Schedule } from "@/types/schedules";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

const RecentSchedule = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      if (!user?.uid) return;
      const data = await listSchedulesByUser(user.uid);
      // 최근 일정 순으로 정렬
      const sortedData = data.sort((a, b) => 
        a.scheduledAt.toDate().getTime() - b.scheduledAt.toDate().getTime()
      );
      setSchedules(sortedData);
    };

    loadSchedules();
  }, [user]);

  return (
    <div className="schedule-card">
      <h3>📅 최근 주요일정</h3>
      {schedules.length === 0 ? (
        <p>가까운 일정이 없습니다.</p>
      ) : (
        <ul>
          {schedules.slice(0, 2).map((schedule) => (
            <li key={schedule.id}>
              <strong>{schedule.type}</strong>: {schedule.scheduledAt.toDate().toLocaleDateString('ko-KR')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSchedule;
