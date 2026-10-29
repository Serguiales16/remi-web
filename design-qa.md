# Remi — design QA

final result: passed

## Sources and comparison evidence

- Visual source: https://cindy.app/, captured 2026-10-24. Source HTML, stylesheet and inspection captures are retained in `D:/REPOS/LUCY/reference-cindy/` (not published).
- Browser-rendered source evidence: `qa/sourceDesktopSnapshot.png`, `qa/sourceMobileHero.png`.
- Browser-rendered implementation: http://localhost:8080/ (Docker + Nginx); evidence in `qa/localDesktopHero.png`, `qa/localMobileHero.png`, `qa/localMobileFAQ.png`, `qa/localDownloadDesktop.png`. These captures predate the rename from Lucy to Remi and keep the previous wordmark.
- Normalized side-by-side comparisons: `qa/desktop-comparison.png` and `qa/mobile-comparison.png`.
- Compact final hero render: `qa/remi-preview.png`, recaptured after the rename.

## Viewports, state and normalization

- Desktop CSS viewport: 1440 × 1000, device pixel ratio 1, initial hero, Spanish Remi copy, alternate character active. The comparison image is 1440 × 520 with each complete viewport scaled uniformly to 704 × 489.
- Mobile CSS viewport: 390 × 844, device pixel ratio 1, initial hero, alternate character active. The comparison image is 812 × 874, with both 390 × 844 viewports at 1:1 scale and a caption row.
- Additional responsive checks: 320, 768, 1024 and 1440 CSS pixels. No horizontal overflow or clipped interactive controls remains at the tested widths.
- The live T3 snapshot backend saved 1280 × 800 images despite viewport emulation, and duplicated the narrow surface in mobile snapshots. Those captures are retained as live evidence but were not treated as 1:1 screenshots. For the normalized comparisons, captured source markup and the actual React-rendered hero DOM were rendered with their real styles, original illustration and embedded original fonts in same-sized frames through `html_preview`. Animations were paused only in these comparison documents.
- Full-page section order, lower-page layouts and interactions were inspected in the live browser. No service health or build-only check was substituted for browser inspection.

## Fidelity surfaces

- **Fonts and typography:** original local Anton, Geist and Geist Mono WOFF2 files load successfully. Section headings preserve the reference system sans, heavy weight and line height. The Remi wordmark uses Anton in place of Cindy's name-specific outlined artwork. Its height was adjusted after the mobile comparison; headline and body wrapping reflect the requested Spanish content.
- **Spacing and layout:** same 1240px content container, 32px desktop / 20px mobile gutters, numbered sections, alternating cream and ink backgrounds, angled tickers, card fan, editorial grids and footer composition. Hero height in the live 1440 × 1000 viewport is 980px, compared with approximately 973px for the source. The small difference follows the adapted copy.
- **Colors and tokens:** source values retained: ink `#0f0e15`, coral red `#f43d3f`, cream `#f3ede2`, secondary ink `#16151e`, paper `#faf6ee`. Original gradients, texture, borders, masks and clipped button shapes are preserved.
- **Image quality and assets:** original WebP illustrations, original control SVGs and original fonts are stored locally. No replacement drawing or generated approximation was used. Hero aspect ratios and mobile crops match the source. Download-area cat and bell scales were corrected to their original relative proportions. Source provenance and font licenses are documented in `ASSETS.md`.
- **Copy and content:** all visible content concerns Serguiales16/remi and the current OpenClaw foundation. The MIT license is correct for this repository. Cindy subscriptions and enterprise offers were replaced by source-code, provider, local-use and contribution information. Remi-specific memory, behavior and security work is explicitly marked as in design. No Cindy name remains in rendered page text. Full Spanish and English alternatives work.

## Focused comparison

The 1:1 mobile side-by-side capture was used to inspect the navigation, character crop, character tag, wordmark, headline, body typography and vertical rhythm. The desktop pair was used to compare the artwork placement, column balance, margins, CTA cluster and color balance. These are the most visually distinctive parts of the reference. The lower-page browser captures were inspected separately for the FAQ and final illustrated CTA.

## Findings and iteration history

1. **[P2, fixed] Final illustration assets rendered too large.** The source stylesheet expects separately sized cat and bell wrappers; the React markup used direct image children. Added explicit matching image widths, positioning and masks. Recaptured in `qa/localDownloadDesktop.png`.
2. **[P2, fixed] Model cards could be clipped at narrow and intermediate widths.** The reference's minimum card width and rotated edges exceeded the available space, and the starter imposed a 320px body minimum. Made grid children shrinkable, adjusted the fan's basis and padding, and removed that minimum. Rechecked 320, 390, 768 and 1024px after transitions settled; interactive controls and card edges fit.
3. **[P2, fixed] Remi's mobile wordmark pushed the heading too far down.** The first comparison showed a taller brand region than the source. Adjusted the wordmark size/line height and restored the character tag's reference scale and position. Recaptured both normalized comparisons; the mobile headline now aligns with the source's hierarchy.
4. **[P2, fixed] Scroll indicator had zero width.** The source expects a width update while the React implementation drives a transform. Set its base width to 100% and its transform origin to the left.

No actionable P0/P1/P2 findings remain in the inspected states. Intentional differences are Remi's name, Spanish product copy, repository-specific section content, and a local installation dialog in place of Cindy's hosted downloads.

## Interaction and runtime checks

- Installation dialog opens, traps focus natively, changes platform tabs, closes from its button and handles Escape.
- Copying the source-install commands returns `¡Copiados!` from the browser Clipboard API.
- Language selector changes all product copy, page title and document language; preference persists in localStorage.
- Character button changes between the girl and cat artwork and updates its accessible pressed state.
- FAQ answers expand and collapse with real buttons and synchronized ARIA state.
- Navigation to `#memory` reaches the intended section below the fixed header.
- All external links point to the Remi GitHub repository or its documentation. All 21 visible image uses loaded successfully; no remote subresource requests were recorded by the local page.
- Captured preview diagnostics and normalized render consoles contain no application runtime errors. Vite development notices are expected.
- Focus indicators, skip link, meaningful labels, decorative image handling and reduced-motion styles are present. Practical browser checks are not a formal accessibility certification.
- `npm run build`: passed.
- `npm run test:sites`: 4 passed, 0 failed.

## Implementation checklist

- [x] React page with local assets and repository-specific copy.
- [x] Desktop and mobile visual comparisons after fixes.
- [x] Core interactions and responsive boundary widths checked in browser.
- [x] Production build and hosting-adapter tests passed.
- [x] Preview served by Docker (Nginx) on port 8080.

## Follow-up polish

- P3: the wordmark is typeset as Remi rather than reproducing Cindy's custom name artwork; this is an expected brand adaptation.
- Page behavior was checked in Chromium. Safari and Firefox were not separately exercised.
