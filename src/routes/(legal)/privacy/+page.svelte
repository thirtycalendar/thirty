<script lang="ts">
  import { Seo } from "$lib/client/components";

  import { businessName, effectiveDate, productName, supportEmail } from "../legal";

  let { data } = $props();
</script>

<Seo seo={data.seo} />

<h1 class="my-5 text-2xl font-bold">Privacy Policy</h1>
<p class="my-3 font-semibold">Effective Date: {effectiveDate}</p>
<p class="my-1">
  Your privacy is important to us. This Privacy Policy explains how {businessName} ("we", "us", or "our")
  collects, uses, and safeguards your personal information when you use {productName} (the "Service").
  By using the Service, you agree to the terms of this Privacy Policy.
</p>

<h2 class="my-3 text-xl font-semibold">1. Information We Collect</h2>
<p class="my-1">We collect two types of information:</p>
<ul class="my-2 list-disc space-y-1 pl-6">
  <li>
    <strong>Voluntarily provided information</strong>: Data you provide directly, such as when
    creating an account or contacting support.
  </li>
  <li>
    <strong>Automatically collected information</strong>: Data sent by your device, such as IP
    address, browser type, and usage statistics.
  </li>
</ul>

<h2 class="my-3 text-xl font-semibold">2. Google User Data</h2>
<p class="my-1">
  When you connect your Google account, {productName} accesses only the data required to provide calendar
  features:
</p>
<ul class="my-2 list-disc space-y-1 pl-6">
  <li>Your Google email address and basic profile.</li>
  <li>Your list of Google Calendars.</li>
  <li>Event details (title, time, description, attendees, etc.).</li>
</ul>
<p class="my-1">
  We use this information solely to let you view, create, and edit events through {productName}. We
  never use Google data for advertising or profiling. Human access to Google user data is disallowed
  except with explicit in-app permission, when strictly necessary for security/debugging, or when
  required by law.
</p>
<p class="my-1">
  Any use and transfer of Google data adheres to the
  <a href="https://developers.google.com/terms/api-services-user-data-policy"
    >Google API Services User Data Policy</a
  >, including Limited Use requirements.
</p>

<h2 class="my-3 text-xl font-semibold">3. How We Use Your Information</h2>
<p class="my-1">We use collected information to:</p>
<ul class="my-2 list-disc space-y-1 pl-6">
  <li>Provide and improve the core features of the Service.</li>
  <li>Personalize your experience.</li>
  <li>Communicate with you regarding support, updates, or legal matters.</li>
  <li>Comply with legal obligations and ensure security.</li>
</ul>

<h2 class="my-3 text-xl font-semibold">4. Data Security</h2>
<p class="my-1">
  We implement commercially reasonable measures to protect your information, including encrypting
  Google user data in transit (TLS 1.3) and at rest (AES-256). However, no method of electronic
  storage is 100% secure.
</p>

<h2 class="my-3 text-xl font-semibold">5. Retention of Data</h2>
<p class="my-1">
  We retain personal information only as long as necessary to provide the Service or comply with
  legal obligations. You may disconnect Google access at any time via
  <a href="https://myaccount.google.com/permissions">Google Account Permissions</a>
  or by using the "Disconnect" option in {productName} settings.
</p>

<h2 class="my-3 text-xl font-semibold">6. Children's Privacy</h2>
<p class="my-1">
  {productName} is not directed to children under 13, and we do not knowingly collect personal information
  from them.
</p>

<h2 class="my-3 text-xl font-semibold">7. Your Rights</h2>
<p class="my-1">
  Depending on your location, you may have rights to access, correct, download, or delete your
  personal data. You can exercise these rights by contacting us at
  <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
</p>

<h2 class="my-3 text-xl font-semibold">8. International Data Transfers</h2>
<p class="my-1">
  Your data may be processed in countries other than your own. We take appropriate measures to
  protect your information in accordance with applicable data protection laws.
</p>

<h2 class="my-3 text-xl font-semibold">9. Changes to This Policy</h2>
<p class="my-1">
  We may update this Privacy Policy from time to time. Material changes will be communicated through
  email or in-app notification, and where required, we will seek your consent.
</p>

<h2 class="my-3 text-xl font-semibold">10. Contact Us</h2>
<p class="my-1">
  If you have questions about this Privacy Policy, contact {businessName} at
  <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
</p>

<p class="mt-10 mb-5">
  By using {productName}, you consent to the practices described in this Privacy Policy.
</p>
