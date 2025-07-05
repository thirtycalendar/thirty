export interface GoogleSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
}

export interface InitCalendar {
  calendarId: string;
  isUpdatedTimezone: boolean;
}
