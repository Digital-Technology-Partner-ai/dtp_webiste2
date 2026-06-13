# Plan: Transparent News Cards for the `/news-v2` Helix
_Round 0 - initial draft by Codex/ChatGPT_

## Goal
Replace the photographic helix card surfaces on `/news-v2` with transparent editorial news cards inspired by the current `/news` highlight cards and the supplied screenshot. Each spiral card should show only the context/category tag, publication date, and headline, with no description text, while remaining translucent enough that other passing cards can be seen behind it.

## Approach
1. Keep the current `/news-v2` route, article mapping, helix/list controls, detail overlay, and approved-news data source unchanged.
2. Update the client-side card texture pipeline in `src/scripts/news-v2-helix.ts` so `createCardTexture()` draws a news-card design instead of a photo-style placeholder:
   - clear the canvas to transparent before drawing;
   - draw a low-opacity panel fill and border, matching the screenshot's dark newsroom tile feel;
   - draw a compact green category/context tag from `item.category`;
   - draw `item.pubDateLabel` alongside the tag;
   - draw the headline with wrapping and truncation safeguards;
   - remove description/body copy from the texture.
3. Remove the remote `picsum.photos` texture replacement path so generated news cards stay authoritative and the page no longer waits on external placeholder images.
4. Adjust the Three.js fragment shader to respect the generated texture alpha:
   - sample `texture2D(uMap, vUv)` as RGBA;
   - keep the existing bend/hover/dimming behavior;
   - output alpha as `texture alpha * rounded-corner alpha * uAlpha`;
   - avoid duotone color grading that would fight the text/card design.
5. Tune material transparency for overlapping cards:
   - keep `transparent: true`;
   - consider disabling `depthWrite` on card materials if overlapping transparent cards hide each other incorrectly;
   - preserve depth testing if it keeps the spiral ordering readable.
6. Update preload/progress behavior because cards are locally generated:
   - mark each generated card as loaded immediately or simplify the preloader completion logic;
   - preserve the existing intro animation timing so the experience still feels intentional.
7. Revisit dimensions only if needed:
   - keep the current plane ratio initially so interaction and detail transitions remain stable;
   - if the text card feels too portrait-heavy, adjust canvas layout inside the existing portrait plane rather than changing helix geometry first.
8. Verify the reduced-motion/static fallback still presents the same title/date/category-only card information and opens the existing article detail overlay.

## Key decisions & tradeoffs
- Use generated canvas textures rather than DOM/CSS cards in 3D. This preserves the existing Three.js helix, raycasting, shader bend, list mode, and click-to-detail behavior with the smallest implementation change.
- Use `category` as the first-pass context tag because it is already present in the `news` schema and is the same field users can filter/sort around later. Do not add schema changes for v1.
- Remove subheading/description text from the spiral card face, but keep it in the article detail overlay. This matches the request and keeps the cards readable while moving.
- Keep the current helix geometry for v1. Changing card aspect ratio and helix spacing together risks destabilizing interactions before the visual direction is proven.
- Remove remote placeholder image loading. The newsroom card face should be deterministic, faster, and not dependent on an external photo service.

## Risks / open questions
- Transparent overlapping planes can produce depth-sorting artifacts in WebGL. The implementation should test `depthWrite: false` if rear cards vanish or draw in the wrong order.
- Text drawn into canvas can become soft or crowded at oblique angles. Use a high-resolution canvas, generous padding, and a maximum line count for headlines.
- Very long headlines may still need truncation. The card renderer should stop at a fixed line count and add an ellipsis if text overflows.
- The screenshot examples are landscape news cards, while the current helix planes are portrait. The first implementation should adapt the design into the existing plane rather than changing geometry unless the result is clearly wrong.
- Sorting/filtering by context tag is mentioned as future behavior. This plan only ensures the card exposes the category/context tag visually and keeps existing list/spiral controls.

## Out of scope
- Replacing the current `/news` page.
- Adding category filtering or sorting controls.
- Changing the article detail overlay content model.
- Adding new content schema fields.
- Reworking the whole helix geometry or navigation model unless the transparent-card implementation requires a small visual adjustment.
