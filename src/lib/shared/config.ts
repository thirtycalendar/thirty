// import { DemoLightImage } from "$lib/client/assets";

export const seoConfig = {
  title: (title: string, homePage?: boolean) => (homePage ? `Thirty` : `${title} | Thirty`),
  url: (url: string) => `https://thirtycalendar.com/${url}`,
  description:
    "Your Calendar. Smarter, Open, and Always Listening. Thirty is the open AI calendar you talk to, and it organizes your life.",
  // image: DemoLightImage,
  twitterHandle: "@itsithu"
};
