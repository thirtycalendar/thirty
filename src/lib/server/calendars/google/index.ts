import calendar_v3 from "@googleapis/calendar";

export async function googleCalClient(accessToken: string) {
  const oauth2 = new calendar_v3.auth.OAuth2();
  oauth2.setCredentials({ access_token: accessToken });

  const googleCal = calendar_v3.calendar({ version: "v3", auth: oauth2 });

  return googleCal;
}
