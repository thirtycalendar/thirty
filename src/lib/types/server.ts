export interface GoogleSession {
  userId: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: string;
  idToken: string;
}

export type Source = "local" | "google" | "outlook" | "apple";
