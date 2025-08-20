import { DemoLightImage, Favicon } from "$lib/client/assets";

export const seoConfig = {
  title: (title: string, homePage?: boolean) =>
    homePage ? `Thirty - The AI Calendar` : `${title} | Thirty - The AI Calendar`,
  url: (url: string) => `https://thirtycalendar.com/${url}`,
  description:
    "Thirty is the AI calendar that talks to you. Schedule smarter, organize faster, and focus on what matters most. Join thousands using AI to manage their life.",
  favicon: Favicon,
  image: DemoLightImage,
  twitterHandle: "@itsithu"
};

export const legalConfig = {
  effectiveDate: "Mon Aug 18, 2025",
  lastUpdatedDate: "Mon Aug 18, 2025",
  productName: "Thirty",
  businessName: "Thirty",
  supportEmail: "sithuknt@gmail.com",
  minAge: "13",
  pricingOptions: ["Free", "Pro"]
};
