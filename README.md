# PledgePilot Website

Responsive React + Vite website starter for PledgePilot.

## Run locally
1. Install Node.js (LTS).
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm run dev` and open the local URL shown.
5. Run `npm run build` to create the production site in `dist/`.

## Deploy
This is a Vite static site. For Cloudflare Pages, connect the GitHub repository and use:
- Build command: `npm run build`
- Build output directory: `dist`

## Included
- Home, Services, Pricing, Portfolio, Process, About and Contact views.
- Responsive navigation and mobile menu.
- Contact form with the five agreed fields.
- Portfolio analytics image lightbox.
- Searchable unified Kickstarter campaign link gallery.
- Newsletter subscription draft.
- Supplied PledgePilot logo and analytics screenshots.

## Important launch checklist
- The campaign list currently includes 171 unique usable Kickstarter URLs extracted from the supplied list. Campaign titles are derived from URL slugs for initial display. Verify the official campaign title, cover image, category, funding goal, amount raised and outcome for each project before publishing those fields.
- The gallery intentionally does not invent funding figures or use generated cover images. Replace the temporary PP cover placeholders with the official campaign cover images and verified campaign data.
- The Facebook Ads screenshot is marked temporary. Replace `public/images/facebook-ads-analytics-temp.jpg` with the final screenshot when supplied.
- The contact form and newsletter currently open the visitor's email application using `mailto:`. Connect a real form endpoint and an email marketing provider before launch for reliable submissions and subscriptions.
- Review all analytics screenshots for private data and blur/redact anything that should not be public.
- Confirm that all campaign case studies are authorized to be represented as projects PledgePilot supported and that each fundraising figure is accurately attributed as the campaign's overall result.
- Add privacy policy, terms, consent language and any required legal business disclosures before launch.
- Confirm Hostinger email DNS records (MX, SPF, DKIM, DMARC) are preserved when configuring Cloudflare DNS.
