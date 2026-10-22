/**
 * Global App Context
 * SRS-INF-003: Global State Context (AppContext) to manage active role,
 * users, schedules, session status, and attendance logs.
 */

import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { User, DUMMY_USERS, DEFAULT_USER, UserRole } from '@/data/users';
import {
  Schedule,
  AttendanceRecord,
  SessionStatus,
  DUMMY_SCHEDULES,
  DUMMY_ATTENDANCE_LOGS,
} from '@/data/schedules';

export interface AttendanceResult {
  success: boolean;
  message: string;
  timestamp?: string;
  record?: AttendanceRecord;
}

export interface AppContextType {
  // User & Role
  activeUser: User;
  users: User[];
  activeRole: UserRole;
  setActiveUser: (user: User) => void;
  switchUser: (userId: string) => void;

  // Schedules
  schedules: Schedule[];
  activeScheduleId: string;
  activeSchedule: Schedule | undefined;
  setActiveScheduleId: (id: string) => void;

  // Session Control
  openSession: (scheduleId: string) => void;
  closeSession: (scheduleId: string) => void;
  updateSessionStatus: (scheduleId: string, status: SessionStatus) => void;

  // Attendance
  attendanceLogs: AttendanceRecord[];
  submitAttendance: (scheduleId: string, student?: User) => AttendanceResult;
  hasStudentAttended: (scheduleId: string, studentId: string) => boolean;
  getStudentAttendanceForSchedule: (
    scheduleId: string,
    studentId: string
  ) => AttendanceRecord | undefined;
  getAttendanceForSchedule: (scheduleId: string) => AttendanceRecord[];
  getStudentHistory: (studentId: string) => (AttendanceRecord & { schedule?: Schedule })[];

  // Reset
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

function getCurrentTimestamp(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds} WIB`;
}

function getCurrentDate(): string {
  const now = new Date();
  const day = now.getDate();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
  ];
  return `${day} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeUser, setActiveUser] = useState<User>(DEFAULT_USER);
  const [schedules, setSchedules] = useState<Schedule[]>(DUMMY_SCHEDULES);
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(DUMMY_ATTENDANCE_LOGS);
  const [activeScheduleId, setActiveScheduleId] = useState<string>('sch-1');

  const activeRole: UserRole = activeUser.role;

  const activeSchedule = useMemo(
    () => schedules.find((s) => s.id === activeScheduleId) || schedules[0],
    [schedules, activeScheduleId]
  );

  const switchUser = (userId: string) => {
    const targetUser = DUMMY_USERS.find((u) => u.id === userId);
    if (targetUser) {
      setActiveUser(targetUser);
    }
  };

  const updateSessionStatus = (scheduleId: string, status: SessionStatus) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === scheduleId ? { ...item, status } : item))
    );
  };

  const openSession = (scheduleId: string) => {
    updateSessionStatus(scheduleId, 'DIBUKA');
  };

  const closeSession = (scheduleId: string) => {
    updateSessionStatus(scheduleId, 'SELESAI');
  };

  const hasStudentAttended = (scheduleId: string, studentId: string): boolean => {
    return attendanceLogs.some(
      (log) => log.scheduleId === scheduleId && log.studentId === studentId
    );
  };

  const getStudentAttendanceForSchedule = (
    scheduleId: string,
    studentId: string
  ): AttendanceRecord | undefined => {
    return attendanceLogs.find(
      (log) => log.scheduleId === scheduleId && log.studentId === studentId
    );
  };

  const getAttendanceForSchedule = (scheduleId: string): AttendanceRecord[] => {
    return attendanceLogs.filter((log) => log.scheduleId === scheduleId);
  };

  const getStudentHistory = (studentId: string) => {
    const studentLogs = attendanceLogs.filter((log) => log.studentId === studentId);
    return studentLogs.map((log) => ({
      ...log,
      schedule: schedules.find((s) => s.id === log.scheduleId),
    }));
  };

  const submitAttendance = (
    scheduleId: string,
    student: User = activeUser
  ): AttendanceResult => {
    const targetSchedule = schedules.find((s) => s.id === scheduleId);

    if (!targetSchedule) {
      return { success: false, message: 'Jadwal praktikum tidak ditemukan.' };
    }

    // SRS-VAL-001: Tombol presensi disabled jika belum dibuka atau selesai
    if (targetSchedule.status === 'BELUM_DIBUKA') {
      return {
        success: false,
        message: 'Presensi belum dibuka oleh asisten praktikum.',
      };
    }

    if (targetSchedule.status === 'SELESAI') {
      return {
        success: false,
        message: 'Sesi praktikum telah ditutup. Presensi tidak dapat dilakukan lagi.',
      };
    }

    // SRS-VAL-002: Pencegahan presensi ganda
    if (hasStudentAttended(scheduleId, student.id)) {
      return {
        success: false,
        message: 'Anda sudah melakukan presensi pada sesi ini sebelumnya.',
      };
    }

    // SRS-STU-002: Catat waktu presensi lokal (timestamp)
    const timestamp = getCurrentTimestamp();
    const date = getCurrentDate();
    const newRecord: AttendanceRecord = {
      id: `att-${Date.now()}-${student.id}`,
      scheduleId,
      studentId: student.id,
      studentName: student.name,
      nim: student.nim || '-',
      timestamp,
      date,
      status: 'Hadir',
    };

    setAttendanceLogs((prev) => [newRecord, ...prev]);

    // SRS-STU-003: Feedback sukses presensi beserta waktu kehadiran
    return {
      success: true,
      message: `Presensi Berhasil! Waktu: ${timestamp}`,
      timestamp,
      record: newRecord,
    };
  };

  const resetDemoData = () => {
    setActiveUser(DEFAULT_USER);
    setSchedules(DUMMY_SCHEDULES);
    setAttendanceLogs(DUMMY_ATTENDANCE_LOGS);
    setActiveScheduleId('sch-1');
  };

  return (
    <AppContext.Provider
      value={{
        activeUser,
        users: DUMMY_USERS,
        activeRole,
        setActiveUser,
        switchUser,
        schedules,
        activeScheduleId,
        activeSchedule,
        setActiveScheduleId,
        openSession,
        closeSession,
        updateSessionStatus,
        attendanceLogs,
        submitAttendance,
        hasStudentAttended,
        getStudentAttendanceForSchedule,
        getAttendanceForSchedule,
        getStudentHistory,
        resetDemoData,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
