export interface GoogleSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
}

// Calendar, event, and task import source
export type Source = "local" | "google" | "outlook" | "apple";
export type EventStatus = "confirmed" | "cancelled" | "tentative";
export type EventAttendeeStatus = "accepted" | "declined" | "tentative" | "needsAction";
export type TaskStatus = "pending" | "completed";
