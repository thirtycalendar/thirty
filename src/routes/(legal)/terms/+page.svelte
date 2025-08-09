<script lang="ts">
  import { Seo } from "$lib/client/components";

  import {
    businessName,
    effectiveDate,
    minAge,
    pricingOptions,
    productName,
    supportEmail
  } from "../legal";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<h1 class="my-5 text-2xl font-bold">Terms of Service</h1>
<p class="my-3 font-semibold">Effective Date: {effectiveDate}</p>

<h2 class="my-3 text-xl font-semibold">1. Service Description</h2>
<p class="my-1">
  {productName} is an open-source AI-powered calendar service, developed and maintained by
  {businessName}, that helps users organize and manage events. The source code is available under
  the MIT License. These Terms apply only when you use our hosted version of {productName} (e.g.,
  <a href="https://thirtycalendar.com">thirtycalendar.com</a>), not when you self-host the software.
</p>
<p class="my-1">
  When connected to Google Calendar, the Service <strong>only reads and imports</strong> your
  calendar data into {productName} for display and organization purposes. It does not create, modify,
  or delete events in your Google Calendar.
</p>

<h2 class="my-3 text-xl font-semibold">2. Eligibility</h2>
<p class="my-1">
  You must be at least {minAge} years old or have the legal authority to enter into this agreement to
  use the Service. By using the Service, you represent and warrant that you meet these requirements.
</p>

<h2 class="my-3 text-xl font-semibold">3. Use of the Service</h2>
<p class="my-1">
  You agree to use the Service in compliance with all applicable laws and regulations. You may not:
</p>
<ul class="my-2 list-disc space-y-1 pl-6">
  <li>
    Modify, copy, or reverse engineer any proprietary parts of the hosted Service infrastructure.
  </li>
  <li>Attempt unauthorized access to any systems, networks, or user accounts.</li>
  <li>Use the Service to transmit unlawful, abusive, or harmful content.</li>
  <li>Collect or harvest user data without consent.</li>
  <li>Violate the intellectual property or privacy rights of others.</li>
</ul>

<h2 class="my-3 text-xl font-semibold">4. Accounts</h2>
<p class="my-1">
  You may need to create an account to access certain hosted features. You are responsible for
  maintaining the confidentiality of your credentials and all activity under your account. Notify us
  immediately if you suspect unauthorized access.
</p>

<h2 class="my-3 text-xl font-semibold">5. Subscriptions and Payments</h2>
<p class="my-1">
  {productName} offers the following pricing options: {pricingOptions.join(" and ")} subscriptions. All
  payments are processed via Polar. Subscriptions automatically renew at the end of each billing cycle
  unless cancelled. You may cancel at any time through your account settings, but cancellations take
  effect at the end of the current billing period.
</p>
<p class="my-1">
  By subscribing, you authorize {businessName} to charge your selected payment method according to your
  chosen plan. Refunds, if applicable, will be issued in accordance with our Refund Policy.
</p>

<h2 class="my-3 text-xl font-semibold">6. Data and Privacy</h2>
<p class="my-1">
  Your use of the hosted Service is also governed by our <a href="/privacy">Privacy Policy</a>,
  which explains how we collect, use, and protect your information. For users connecting Google
  Calendar, we only read and import calendar data; no events are created, modified, or deleted in
  your Google account.
</p>
<p class="my-1">
  If you self-host {productName}, you are solely responsible for your own privacy practices and
  compliance with applicable data protection laws.
</p>

<h2 class="my-3 text-xl font-semibold">7. License and Open Source</h2>
<p class="my-1">
  The {productName} source code is released under the MIT License, which permits personal and commercial
  use, modification, and distribution. The full MIT License text is as follows:
</p>
<pre class="bg-base overflow-x-auto p-3 text-sm">
MIT License

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
SOFTWARE.
</pre>
<p class="my-1">
  These Terms govern your use of our <strong>hosted version</strong> of the Service and do not limit
  your rights under the MIT License for the source code.
</p>

<h2 class="my-3 text-xl font-semibold">8. Termination</h2>
<p class="my-1">
  We may suspend or terminate your access to the hosted Service at any time, without notice, if you
  violate these Terms, engage in unlawful behavior, or misuse the Service. You may also terminate
  your account at any time through your settings.
</p>

<h2 class="my-3 text-xl font-semibold">9. Intellectual Property</h2>
<p class="my-1">
  All branding, trademarks, and content associated with {productName}’s hosted service are owned by
  {businessName} or its licensors. You are granted a limited, non-exclusive, non-transferable license
  to use the hosted Service for personal, non-commercial purposes, subject to these Terms.
</p>

<h2 class="my-3 text-xl font-semibold">10. Limitation of Liability</h2>
<p class="my-1">
  To the maximum extent permitted by law, {businessName} provides the hosted Service "as is" without
  warranties of any kind. We are not liable for any indirect, incidental, or consequential damages, including
  data loss, lost profits, or service interruptions.
</p>

<h2 class="my-3 text-xl font-semibold">11. No Warranty</h2>
<p class="my-1">
  We make no guarantees regarding uptime, availability, or performance of the hosted Service.
  Features may change, be suspended, or discontinued at our discretion without prior notice.
</p>

<h2 class="my-3 text-xl font-semibold">12. Modifications to Terms</h2>
<p class="my-1">
  We may update these Terms from time to time. Material changes will be communicated via email or
  in-app notifications. Continued use of the hosted Service after changes take effect constitutes
  acceptance of the revised Terms.
</p>

<h2 class="my-3 text-xl font-semibold">13. Governing Law</h2>
<p class="my-1">
  These Terms are governed by and construed in accordance with the laws of Singapore, without regard
  to conflict of law principles. You agree to submit to the exclusive jurisdiction of the courts
  located in Singapore.
</p>

<h2 class="my-3 text-xl font-semibold">14. Contact Information</h2>
<p class="my-1">
  For questions about these Terms, contact {businessName} at
  <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
</p>

<p class="mt-10 mb-5">
  By using the hosted version of {productName}, you acknowledge and agree to these Terms.
</p>
