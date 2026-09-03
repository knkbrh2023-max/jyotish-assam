# Jyotish Assam — Professional Income Website

This is a GitHub Pages-ready static frontend.

## 1. Quick setup
- Upload all files to a GitHub repository.
- Settings → Pages → Deploy from branch → `main` → `/ (root)`.
- Edit `config.js`:
  - `whatsappNumber`
  - `paymentLink`
  - `siteUrl`
- Replace `YOUR-DOMAIN.example` in `index.html`, `robots.txt`, `sitemap.xml`.

## 2. Automatic Daily Rashifal
The frontend automatically changes the displayed daily seed based on the current date. The actual editorial content lives in `rashifal.js`.
For a true scheduled CMS workflow, connect Supabase/Firebase and a scheduled server/edge function that publishes a new record every day.

## 3. Admin Panel
`admin.html` is a demonstration panel. Demo PIN: `1234`.
Do NOT use this PIN or localStorage admin for a real production admin system.
For production, use Supabase Auth/Firebase Auth with database security rules/RLS.

## 4. Payments
The template supports a hosted payment-link approach: put your real payment link in `config.js`.
For a full automated Razorpay/Stripe checkout, add a server-side backend that creates orders and verifies signatures. Never expose secret keys in GitHub Pages JavaScript.

## 5. AdSense
Do not place ads until the site is approved and you have the official publisher/ad-unit code. Add the official script and ad-unit markup supplied by Google.

## 6. Custom domain
In GitHub repository Settings → Pages → Custom domain, enter your domain.
At your DNS provider, point the domain to the GitHub Pages DNS records shown by GitHub. Enable HTTPS after DNS verification.
Then update `siteUrl`, canonical URL, sitemap and Search Console property.

## 7. Production launch checklist
- Replace placeholder WhatsApp number.
- Replace payment link.
- Add a real domain.
- Add real Privacy/Terms/Refund policy.
- Add analytics only with a privacy notice.
- Configure a real authenticated backend for admin.
- Configure payment verification if using API checkout.
- Add original, useful astrology articles for SEO.
- Submit sitemap to Google Search Console.
