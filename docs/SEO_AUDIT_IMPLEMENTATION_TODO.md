# The Stems SEO Audit - Long Implementation TODO

This plan captures the full audit recommendations and tracks implementation status.

## Status Key
- `[x]` Implemented
- `[~]` In progress / partially covered
- `[ ]` Not started

## Phase 1 - Critical Technical Fixes (Week 1)
- [x] Enforce canonical domain redirects in middleware (`http` and `www` to `https://thestemsflowers.co.ke`).
- [x] Set global canonical metadata base and alternates in `app/layout.tsx`.
- [x] Add crawler block for image optimizer endpoints (`/_next/image*`) in `public/robots.txt`.
- [x] Maintain sitemap endpoint in `app/sitemap.ts`.
- [ ] Submit sitemap in Google Search Console and verify successful crawl.
- [x] Add explicit noindex behavior for dynamic image endpoints if served directly.

## Phase 2 - CTR and SERP Snippet Fixes (Week 1)
- [~] Homepage title/description is optimized for florist + Nairobi intent.
- [x] Rewrite title/meta for `/collections/gift-hampers` with same-day and WhatsApp hooks.
- [x] Rewrite title/meta for `/collections/wines` to improve clicks at high ranking.
- [x] Rewrite title/meta for `/collections/flowers` around "fresh flowers Nairobi".
- [x] Add KES price cues in key collection meta descriptions.
- [x] Include WhatsApp ordering CTA in title/meta for top conversion pages.

## Phase 3 - On-Page SEO Content Expansion (Week 2)
- [ ] Add 200+ words of SEO copy to `/collections/flowers`.
- [ ] Add richer category copy to `/collections/gift-hampers`.
- [x] Add richer category copy to `/collections/wines`.
- [ ] Ensure every primary collection has one clear H1 and keyword-supporting intro content.
- [ ] Add internal links between high-authority pages and priority collections.

## Phase 4 - Rendering, Crawlability, and Structured Data (Week 2)
- [ ] Verify SSR/SSG output for all `/collections/*` and `/product/*` pages from raw HTML.
- [x] Organization + LocalBusiness + WebSite JSON-LD in `app/layout.tsx`.
- [ ] Add/validate Product schema coverage for top products.
- [ ] Validate rich results for core pages and fix any schema errors.
- [ ] Ensure no duplicate or conflicting canonical tags on dynamic pages.

## Phase 5 - Local SEO and Google Business Profile (Week 1-2)
- [ ] Create and verify Google Business Profile.
- [ ] Add complete NAP info (address, phone, hours, categories, service area).
- [ ] Upload 20+ high-quality business/product photos.
- [ ] Add product highlights and regular GBP posts.
- [ ] Start review acquisition workflow (target first 10-20 reviews).

## Phase 6 - New Landing Pages (Month 1)
- [x] `/birthday-flowers-nairobi`
- [x] `/anniversary-flowers-nairobi`
- [x] `/same-day-flower-delivery-nairobi`
- [x] `/wedding-flowers-nairobi` (or align existing wedding page slug strategy)
- [x] `/corporate-gift-hampers-nairobi`
- [ ] Add local-area landing pages (`westlands`, `kilimani`, `karen`, `cbd`) if not already present.

## Phase 7 - Content and Blog Program (Month 1-3)
- [ ] Publish "Gift Hampers Nairobi - Flowers, Wine & Chocolate Delivered Same Day".
- [ ] Publish "Best Birthday Flowers in Nairobi - Order Online".
- [ ] Publish "Wine Delivery Nairobi - Same Day Wine Gifts with Flowers".
- [ ] Publish "Same Day Flower Delivery Nairobi - How It Works".
- [ ] Build seasonal pages/posts for Valentine's and Mother's Day cycles.
- [ ] Add internal linking from blog posts to relevant collections and products.

## Phase 8 - Authority and Backlinks (Month 2-3)
- [ ] Build outreach list of Kenyan lifestyle/event/wedding websites.
- [ ] Secure first 5 relevant local backlinks.
- [ ] Expand to 10+ quality backlinks with topical relevance.
- [ ] Track referring domains and keyword movement monthly.

## Phase 9 - Measurement, Tracking, and QA (Ongoing)
- [ ] Add a monthly SEO dashboard: clicks, impressions, CTR, avg position, top pages, top queries.
- [ ] Track pre/post changes for gift hampers and wines CTR specifically.
- [ ] Review Search Console coverage/indexing issues every week.
- [ ] Re-run technical crawl checks monthly (canonicals, robots, sitemap, 404s).
- [ ] Compare performance by device and location to optimize mobile-first pages.

## Immediate Next 10 Tasks (Execution Order)
1. Update metadata for `/collections/gift-hampers`.
2. Update metadata for `/collections/wines`.
3. Update metadata for `/collections/flowers`.
4. Add 200+ words intro content on flowers collection page.
5. Add 150+ words intro content on hampers collection page.
6. Validate raw HTML output for top 10 SEO pages.
7. Submit sitemap in Google Search Console.
8. Create/optimize Google Business Profile.
9. Publish first 2 high-intent blog posts.
10. Set up monthly SEO reporting checklist and owners.
