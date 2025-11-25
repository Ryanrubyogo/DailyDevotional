export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Devotional {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  category: string;
  content: string;
  imageUrl?: string;
  isRead?: boolean;
}

export type ViewState = 'home' | 'login' | 'devotional-list' | 'devotional-detail' | 'admin';

export interface CalendarDate {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasDevotional: boolean;
}