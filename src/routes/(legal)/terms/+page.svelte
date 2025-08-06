<script lang="ts">
  import {
    businessName,
    effectiveDate,
    minAge,
    pricingOptions,
    productName,
    supportEmail
  } from "../legal";
</script>

<h1 class="my-5 text-2xl font-bold">Terms of Service</h1>
<p class="my-3 font-semibold">Effective Date: {effectiveDate}</p>
<p class="my-1">
  Welcome to {productName}, operated by {businessName} ("we", "us", or "our"). By accessing or using
  {productName} (the "Service"), you agree to be bound by these Terms of Use ("Terms"). If you do not
  agree to these Terms, please refrain from using the Service.
</p>

<h2 class="my-3 text-xl font-semibold">1. Eligibility</h2>
<p class="my-1">
  You must be at least {minAge} years old or have the legal authority to enter into this agreement to
  use the Service. By using the Service, you represent and warrant that you meet these requirements.
</p>

<h2 class="my-3 text-xl font-semibold">2. Use of the Service</h2>
<p class="my-1">
  You agree to use the Service in compliance with all applicable laws and regulations. You may not:
</p>
<ul class="my-2 list-disc space-y-1 pl-6">
  <li>Modify, copy, or reverse engineer any part of the Service.</li>
  <li>
    Disrupt or abuse the Service, including attempting unauthorized access to systems or networks.
  </li>
  <li>Use the Service to transmit unlawful, abusive, or harmful content.</li>
  <li>Collect user data without consent.</li>
  <li>Violate the intellectual property or privacy rights of others.</li>
</ul>

<h2 class="my-3 text-xl font-semibold">3. Accounts</h2>
<p class="my-1">
  You may need to create an account to access certain features of the Service. You are responsible
  for maintaining the confidentiality of your account credentials and for all activities under your
  account.
</p>

<h2 class="my-3 text-xl font-semibold">4. Subscriptions and Payments</h2>
<p class="my-1">
  {productName} offers the following pricing options: {pricingOptions.join(" and ")} subscriptions. All
  payments are processed via Polar. By subscribing, you authorize {businessName} to charge your payment
  method according to your selected plan. Refunds, if applicable, will be handled as outlined in our
  Refund Policy.
</p>

<h2 class="my-3 text-xl font-semibold">5. Termination</h2>
<p class="my-1">
  {businessName} may suspend or terminate your access to the Service at its discretion, without prior
  notice, if it believes you have violated these Terms or engaged in unlawful behavior.
</p>

<h2 class="my-3 text-xl font-semibold">6. Intellectual Property</h2>
<p class="my-1">
  All content, trademarks, and intellectual property associated with {productName} are owned by {businessName}.
  This license grants you a limited, non-exclusive right to use the Service for personal,
  non-commercial purposes. Unauthorized use or reproduction is strictly prohibited.
</p>

<h2 class="my-3 text-xl font-semibold">7. Limitation of Liability</h2>
<p class="my-1">
  To the maximum extent permitted by law, {businessName} provides the Service "as is" and shall not be
  liable for any indirect, incidental, or consequential damages, including but not limited to data loss,
  loss of profits, or service interruptions.
</p>

<h2 class="my-3 text-xl font-semibold">8. Modifications to Terms</h2>
<p class="my-1">
  {businessName} reserves the right to modify these Terms at any time. Changes will be effective upon
  posting to the Service. Continued use of the Service constitutes acceptance of the revised Terms.
</p>

<h2 class="my-3 text-xl font-semibold">9. Governing Law</h2>
<p class="my-1">
  These Terms are governed by and construed in accordance with the laws of your jurisdiction. You
  agree to submit to the exclusive jurisdiction of the courts in that location.
</p>

<h2 class="my-3 text-xl font-semibold">10. Contact Information</h2>
<p class="my-1">
  For questions about these Terms, please contact {businessName} at
  <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
</p>

<p class="mt-10 mb-5">
  By using {productName}, you acknowledge and agree to these Terms.
</p>
