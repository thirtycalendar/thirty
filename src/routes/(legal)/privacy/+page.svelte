<script lang="ts">
  import { Legal, Seo } from "$lib/client/components";

  import type { LegalSection } from "$lib/shared/types";
  import { legalConfig } from "$lib/shared/config";

  let { data } = $props();

  const { businessName, productName, supportEmail } = legalConfig;

  const sections: LegalSection[] = [
    {
      title: "1. Scope",
      content: [
        `This Privacy Policy applies only to the hosted version of ${productName} available at thirtycalendar.com. If you deploy or self-host the open-source ${productName} software, you are solely responsible for your own privacy practices, and this Privacy Policy does not apply to your deployment.`
      ]
    },
    {
      title: "2. Information We Collect",
      content: [
        `We collect two types of information when you use the hosted Service:`,
        {
          type: "list",
          items: [
            "**Voluntarily provided information**: Data you provide directly, such as when creating an account, booking meetings, or contacting support.",
            "**Automatically collected information**: Data sent by your device, such as IP address, browser type, operating system, and usage statistics."
          ]
        }
      ]
    },
    {
      title: "3. Google User Data (Read-Only / One-Way Sync)",
      content: [
        `When you connect your Google account, ${productName} requests only the minimum Google data necessary to display and sync your calendar events into our product. Typical data accessed includes:`,
        {
          type: "list",
          items: [
            "Your Google email address and basic profile.",
            "Your list of Google Calendars.",
            "Event metadata (title, start/end time, description, attendees, location, etc.)."
          ]
        },
        `**Important:** ${productName} only *reads* your Google Calendar data to keep your ${productName} calendar in sync. We do not create, modify, or delete events in your Google Calendar — syncing is one-way from Google to ${productName}.`,
        `We only request the OAuth scopes required for read access (for example, the Google Calendar read-only scope). Any use and transfer of Google data adheres to the `,
        {
          type: "link",
          href: "https://developers.google.com/terms/api-services-user-data-policy",
          text: "Google API Services User Data Policy"
        },
        ` and the Limited Use requirements.`,
        `Human access to Google user data is disallowed by default and is only permitted with explicit in-app user consent or when strictly necessary for security, debugging, or to comply with a valid legal request. All such access is logged and audited.`
      ]
    },
    {
      title: "4. How We Use Your Information",
      content: [
        `We use collected information to:`,
        {
          type: "list",
          items: [
            "Provide and improve the core features of the Service.",
            "Personalize your experience.",
            "Communicate with you regarding support, updates, or legal matters.",
            "Comply with legal obligations and ensure security."
          ]
        }
      ]
    },
    {
      title: "5. Data Security",
      content: [
        `We implement commercially reasonable measures to protect your information, including encrypting Google user data in transit (TLS 1.3) and at rest (AES-256). However, no method of electronic storage is 100% secure.`
      ]
    },
    {
      title: "6. Retention of Data",
      content: [
        `We retain personal information only as long as necessary to provide the Service or comply with legal obligations. You may disconnect Google access at any time via `,
        {
          type: "link",
          href: "https://myaccount.google.com/permissions",
          text: "Google Account Permissions"
        },
        ` or by using the "Disconnect" option in ${productName} settings.`
      ]
    },
    {
      title: "7. Children's Privacy",
      content: [
        `${productName} is not directed to children under 13, and we do not knowingly collect personal information from them.`
      ]
    },
    {
      title: "8. Your Rights",
      content: [
        `Depending on your location, you may have rights to access, correct, download, or delete your personal data. You can exercise these rights by contacting us at `,
        { type: "link", href: `mailto:${supportEmail}`, text: supportEmail }
      ]
    },
    {
      title: "9. International Data Transfers",
      content: [
        `Your data may be processed in countries other than your own. We take appropriate measures to protect your information in accordance with applicable data protection laws.`
      ]
    },
    {
      title: "10. Changes to This Policy",
      content: [
        `We may update this Privacy Policy from time to time. Material changes will be communicated through email or in-app notification, and where required, we will seek your consent.`
      ]
    },
    {
      title: "11. Contact Us",
      content: [
        `If you have questions about this Privacy Policy, contact ${businessName} at `,
        { type: "link", href: `mailto:${supportEmail}`, text: supportEmail }
      ]
    }
  ];
</script>

<Seo seo={data.seo} />

<Legal title="Privacy Policy" {sections} />
