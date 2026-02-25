export interface Schedule {
  id: string;
  dogId: string;
  userId: string;
  type: string;
  title?: string;
  description?: string;
  scheduledAt: string | Date;
  completed: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export type ScheduleWrite = Omit<Schedule, 'id'>;
