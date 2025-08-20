import { DemoLightImage } from "$lib/client/assets";

export const seoConfig = {
  title: (title: string, homePage?: boolean) =>
    homePage ? `Thirty - The AI Calendar` : `${title} | Thirty`,
  url: (url: string) => `https://thirtycalendar.com/${url}`,
  description:
    "Thirty is the AI calendar that talks to you. Schedule smarter, organize faster, and focus on what matters most. Join thousands using AI to manage their life.",
  image: DemoLightImage,
  twitterHandle: "@itsithu"
};

export const legalConfig = {
  effectiveDate: "Wed Aug 6, 2025",
  productName: "Thirty",
  businessName: "Thirty",
  supportEmail: "sithuknt@gmail.com",
  minAge: "13",
  pricingOptions: ["Free", "Pro"]
};
