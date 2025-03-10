// src/lib/firebase/schedules.ts

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  FieldValue,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Schedule, ScheduleWrite } from "@/types/schedules";

// 1) 일정 생성
export const createSchedule = async (
  scheduleData: Omit<ScheduleWrite, "createdAt" | "updatedAt">
): Promise<string | null> => {
  try {
    const newData: ScheduleWrite = {
      ...scheduleData,
      completed: scheduleData.completed ?? false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "schedules"), newData);
    console.log("✅ 일정 생성 성공:", ref.id);
    return ref.id;
  } catch (error) {
    console.error("🚨 일정 생성 실패:", error);
    return null;
  }
};

// 2) 일정 조회 (단건)
export const getScheduleById = async (scheduleId: string): Promise<Schedule | null> => {
  try {
    const snap = await getDoc(doc(db, "schedules", scheduleId));
    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...snap.data(),
    } as Schedule;
  } catch (error) {
    console.error("🚨 일정 조회 실패:", error);
    return null;
  }
};

// 3) 일정 수정
export const updateSchedule = async (
  scheduleId: string,
  data: Partial<Schedule>
): Promise<void> => {
  try {
    await updateDoc(doc(db, "schedules", scheduleId), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log("✅ 일정 수정 완료:", scheduleId);
  } catch (error) {
    console.error("🚨 일정 수정 실패:", error);
  }
};

// 4) 일정 삭제
export const deleteSchedule = async (scheduleId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, "schedules", scheduleId));
    console.log("✅ 일정 삭제 완료:", scheduleId);
  } catch (error) {
    console.error("🚨 일정 삭제 실패:", error);
  }
};

// 5) 특정 강아지(dogId)의 일정 목록 조회
export const listSchedulesByDog = async (dogId: string): Promise<Schedule[]> => {
  try {
    const q = query(collection(db, "schedules"), where("dogId", "==", dogId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  } catch (error) {
    console.error("🚨 강아지 일정 목록 조회 실패:", error);
    return [];
  }
};

// 6) 특정 사용자(userId)가 등록한 일정 목록 조회
export const listSchedulesByUser = async (userId: string): Promise<Schedule[]> => {
  try {
    const q = query(collection(db, "schedules"), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Schedule[];
  } catch (error) {
    console.error("🚨 사용자 일정 목록 조회 실패:", error);
    return [];
  }
};
