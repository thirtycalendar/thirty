export const googleScopes = [
  // Basic user info
  "openid",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",

  // Full calendar access (read/write all calendars and events)
  "https://www.googleapis.com/auth/calendar",

  // Manage calendar ACLs (sharing permissions)
  "https://www.googleapis.com/auth/calendar.acls"
];
