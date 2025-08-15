<script lang="ts">
  import { Seo } from "$lib/client/components";

  import type { LegalSection } from "$lib/shared/types";
  import { legalConfig } from "$lib/shared/config";

  let { data } = $props();

  const { businessName, effectiveDate, minAge, pricingOptions, productName, supportEmail } =
    legalConfig;

  const sections: LegalSection[] = [
    {
      title: "1. Service Description",
      content: [
        `${productName} is an open-source AI-powered calendar service, developed and maintained by ${businessName}, that helps users organize and manage events. The source code is available under the MIT License. These Terms apply only when you use our hosted version of ${productName} (e.g., https://thirtycalendar.com), not when you self-host the software.`,
        `When connected to Google Calendar, the Service only reads and imports your calendar data into ${productName} for display and organization purposes. It does not create, modify, or delete events in your Google Calendar.`
      ]
    },
    {
      title: "2. Eligibility",
      content: [
        `You must be at least ${minAge} years old or have the legal authority to enter into this agreement to use the Service. By using the Service, you represent and warrant that you meet these requirements.`
      ]
    },
    {
      title: "3. Use of the Service",
      content: [
        `You agree to use the Service in compliance with all applicable laws and regulations. You may not:`,
        {
          type: "list",
          items: [
            "Modify, copy, or reverse engineer any proprietary parts of the hosted Service infrastructure.",
            "Attempt unauthorized access to any systems, networks, or user accounts.",
            "Use the Service to transmit unlawful, abusive, or harmful content.",
            "Collect or harvest user data without consent.",
            "Violate the intellectual property or privacy rights of others."
          ]
        }
      ]
    },
    {
      title: "4. Accounts",
      content: [
        `You may need to create an account to access certain hosted features. You are responsible for maintaining the confidentiality of your credentials and all activity under your account. Notify us immediately if you suspect unauthorized access.`
      ]
    },
    {
      title: "5. Subscriptions and Payments",
      content: [
        `${productName} offers the following pricing options: ${pricingOptions.join(" and ")} subscriptions. All payments are processed via Polar. Subscriptions automatically renew at the end of each billing cycle unless cancelled. You may cancel at any time through your account settings, but cancellations take effect at the end of the current billing period.`,
        `By subscribing, you authorize ${businessName} to charge your selected payment method according to your chosen plan. Refunds, if applicable, will be issued in accordance with our Refund Policy.`
      ]
    },
    {
      title: "6. Data and Privacy",
      content: [
        { type: "link", href: "/privacy", text: "Privacy Policy" },
        `If you self-host ${productName}, you are solely responsible for your own privacy practices and compliance with applicable data protection laws.`
      ]
    },
    {
      title: "7. License and Open Source",
      content: [
        `The ${productName} source code is released under the MIT License, which permits personal and commercial use, modification, and distribution. The full MIT License text is as follows:`,
        {
          type: "pre",
          text: `MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the “Software”), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`
        },
        `These Terms govern your use of our hosted version of the Service and do not limit your rights under the MIT License for the source code.`
      ]
    },
    {
      title: "8. Termination",
      content: [
        `We may suspend or terminate your access to the hosted Service at any time, without notice, if you violate these Terms, engage in unlawful behavior, or misuse the Service. You may also terminate your account at any time through your settings.`
      ]
    },
    {
      title: "9. Intellectual Property",
      content: [
        `All branding, trademarks, and content associated with ${productName}’s hosted service are owned by ${businessName} or its licensors. You are granted a limited, non-exclusive, non-transferable license to use the hosted Service for personal, non-commercial purposes, subject to these Terms.`
      ]
    },
    {
      title: "10. Limitation of Liability",
      content: [
        `To the maximum extent permitted by law, ${businessName} provides the hosted Service "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages, including data loss, lost profits, or service interruptions.`
      ]
    },
    {
      title: "11. No Warranty",
      content: [
        `We make no guarantees regarding uptime, availability, or performance of the hosted Service. Features may change, be suspended, or discontinued at our discretion without prior notice.`
      ]
    },
    {
      title: "12. Modifications to Terms",
      content: [
        `We may update these Terms from time to time. Material changes will be communicated via email or in-app notifications. Continued use of the hosted Service after changes take effect constitutes acceptance of the revised Terms.`
      ]
    },
    {
      title: "13. Governing Law",
      content: [
        `These Terms are governed by and construed in accordance with the laws of Singapore, without regard to conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts located in Singapore.`
      ]
    },
    {
      title: "14. Contact Information",
      content: [
        `For questions about these Terms, contact ${businessName} at `,
        { type: "link", href: `mailto:${supportEmail}`, text: supportEmail }
      ]
    }
  ];
</script>

<Seo seo={data.seo} />

<h1 class="my-5 text-center text-3xl">Terms of Service</h1>
<p class="my-5">Effective Date: {effectiveDate}</p>

<div class="text-primary-content/70 flex flex-col space-y-8">
  {#each sections as section (section.title)}
    <h2 class="text-primary-content text-xl">{section.title}</h2>
    {#each section.content as item (item)}
      {#if typeof item === "string"}
        <p>{item}</p>
      {:else if item.type === "link"}
        <p><a href={item.href}>{item.text}</a></p>
      {:else if item.type === "list"}
        <ul class="list-disc space-y-1 pl-6">
          {#each item.items as li (li)}<li>{li}</li>{/each}
        </ul>
      {:else if item.type === "pre"}
        <pre class="bg-base overflow-x-auto p-3 text-sm">{item.text}</pre>
      {/if}
    {/each}
  {/each}
</div>

<p class="mt-10 mb-5">
  By using the hosted version of {productName}, you acknowledge and agree to these Terms.
</p>
