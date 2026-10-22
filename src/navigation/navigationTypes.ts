/**
 * Navigation Types
 * SRS-INF-001: Clean navigation architecture for Assistant and Student flows
 */

export interface NavigationProp {
  navigate: (screen: string, params?: any) => void;
  goBack: () => void;
  currentScreen: string;
}

export type AssistantScreenName = 'AssistantHome' | 'SessionRecap';
export type StudentScreenName = 'StudentHome' | 'StudentHistory';

