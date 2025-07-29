# Security

**Contact:** sithuknt@gmail.com

Based on [https://supabase.com/.well-known/security.txt](https://supabase.com/.well-known/security.txt)

At Calen, we consider the security of our systems a top priority.  
No matter how much effort we put into system security, there can still be vulnerabilities present.

If you discover a vulnerability, we would like to know about it so we can take steps to address it as quickly as possible.  
We ask you to help us better protect our users and our systems.

---

## Out of Scope Vulnerabilities

- Clickjacking on pages with no sensitive actions.
- Unauthenticated/logout/login CSRF.
- Attacks requiring MITM or physical access to a user's device.
- Any activity that could lead to the disruption of our service (DoS).
- Content spoofing and text injection issues without a valid attack vector or ability to modify HTML/CSS.
- Email spoofing.
- Missing DNSSEC, CAA, CSP headers.
- Lack of Secure or HTTP-only flags on non-sensitive cookies.
- Dead links.

---

## Please Do the Following

- E-mail your findings to **sithuknt@gmail.com**.
- **Do not** run automated scanners on our infrastructure or dashboard. If you wish to do this, contact us first, and we will set up a sandbox environment.
- **Do not** exploit the vulnerability (e.g., downloading more data than necessary or modifying/deleting user data).
- **Do not** publicly disclose the issue until it has been resolved.
- **Do not** use attacks on physical security, social engineering, distributed denial of service, spam, or third-party apps.
- Provide sufficient information to reproduce the problem (e.g., IP address, URL, and vulnerability description). Complex vulnerabilities may require more detailed steps.

---

## What We Promise

- We will respond to your report within **3 business days** with an evaluation and an expected resolution date.
- If you follow the guidelines above, we will not pursue legal action against you regarding the report.
- We will handle your report with **strict confidentiality** and not share your personal details without your permission.
- We will keep you informed about the progress toward resolving the issue.
- We will credit you as the discoverer in public advisories (unless you request otherwise).
- We strive to resolve all security issues as quickly as possible and coordinate disclosure.
