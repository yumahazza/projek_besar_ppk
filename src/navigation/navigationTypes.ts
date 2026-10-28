/**
 * Navigation Types
 * SRS-INF-001: Clean navigation architecture for Assistant and Student flows
 */

export interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  currentScreen: string;
  params?: any;
}

export type AssistantScreenName =
  | 'AssistantHome'
  | 'SessionRecap'
  | 'ScheduleList'
  | 'Profile'
  | 'SessionDetail'
  | 'SessionControl'
  | 'StudentList'
  | 'AttendanceDetail'
  | 'AttendanceStats'
  | 'Notifications';

export type StudentScreenName =
  | 'StudentHome'
  | 'ScheduleList'
  | 'StudentHistory'
  | 'Profile'
  | 'SessionDetail'
  | 'AttendanceDetail'
  | 'Notifications';
