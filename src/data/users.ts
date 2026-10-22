/**
 * User types and dummy user data
 * SRS-INF-002: Local dummy data for testing without backend
 */

export type UserRole = 'assistant' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  nim?: string;
  email?: string;
  department?: string;
}

export const DUMMY_USERS: User[] = [
  {
    id: 'ast-1',
    name: 'Asisten Lab A',
    role: 'assistant',
    email: 'asisten.laba@univ.ac.id',
    department: 'Laboratorium Komputer',
  },
  {
    id: 'stu-1',
    name: 'Budi Santoso',
    role: 'student',
    nim: '210001',
    email: 'budi.210001@univ.ac.id',
    department: 'Teknik Informatika',
  },
  {
    id: 'stu-2',
    name: 'Siti Aminah',
    role: 'student',
    nim: '210002',
    email: 'siti.210002@univ.ac.id',
    department: 'Teknik Informatika',
  },
];

export const DEFAULT_USER = DUMMY_USERS[0];

