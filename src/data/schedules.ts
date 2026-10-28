/**
 * Schedule & Attendance types and dummy data
 * SRS-INF-002: Local dummy data for schedules and attendance
 */

export type SessionStatus = 'BELUM_DIBUKA' | 'DIBUKA' | 'SELESAI';

export interface Schedule {
  id: string;
  courseName: string;
  className: string;
  time: string;
  room: string;
  status: SessionStatus;
  assistantId: string;
  assistantName: string;
  date: string;
  totalStudents: number;
}

export interface AttendanceRecord {
  id: string;
  scheduleId: string;
  studentId: string;
  studentName: string;
  nim: string;
  timestamp: string; // e.g. "14:02:15 WIB"
  date: string;
  status: 'Hadir';
}

export const DUMMY_SCHEDULES: Schedule[] = [
  {
    id: 'sch-1',
    courseName: 'Pemrograman Mobile',
    className: 'Kelas A',
    time: '14:00 – 16:00',
    room: 'Lab Komputer 2',
    status: 'BELUM_DIBUKA',
    assistantId: 'ast-1',
    assistantName: 'Asisten Lab A',
    date: '22 Okt 2026',
    totalStudents: 20,
  },
  {
    id: 'sch-2',
    courseName: 'Basis Data',
    className: 'Kelas B',
    time: '10:00 – 12:00',
    room: 'Lab Komputer 1',
    status: 'SELESAI',
    assistantId: 'ast-1',
    assistantName: 'Asisten Lab A',
    date: '15 Okt 2026',
    totalStudents: 25,
  },
];

export const DUMMY_ATTENDANCE_LOGS: AttendanceRecord[] = [
  {
    id: 'att-past-1',
    scheduleId: 'sch-2',
    studentId: 'stu-1',
    studentName: 'Budi Santoso',
    nim: '210001',
    timestamp: '14:01:20 WIB',
    date: '15 Okt 2026',
    status: 'Hadir',
  },
];
