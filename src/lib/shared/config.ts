import { DemoLightImage } from "$lib/client/assets";

export const seoConfig = {
  title: (title: string, homePage?: boolean) => (homePage ? `Thirty` : `${title} - Thirty`),
  url: (url: string) => `https://thirtycalendar.com/${url}`,
  description: "Your Calendar. Smarter, Open, and Always Listening.",
  image: DemoLightImage,
  twitterHandle: "@itsithu"
};
