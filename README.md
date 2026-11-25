# Happy birthday, Warren!

Birthday surprises at https://lucaessey.github.io/dad_b-day/.

This is a buildless HTML/CSS/JavaScript site. GitHub Pages publishes the repository root.

- Seven riddle coupons, including two family game nights.
- Ten family love notes in colorful speech bubbles, with a confetti entrance.
- Friendly answer matching accepts paraphrases and common typos.
- Coupon unlocks and uses are saved in the current browser’s local storage.
- Every redemption asks for confirmation. Spent coupons move to the bottom.
- Daily jokes begin November 26, 2026, using America/Los_Angeles calendar dates.
- Past daily jokes are archived automatically, including days without visits.
- The collection contains 100 jokes and cycles after the last one.
- No sign-in, database, or API keys are required.

## Local preview

Run `node serve.mjs`, then open http://127.0.0.1:4173/.

## Checks

Run `node --test test.mjs`.

## Editing

- `data.mjs`: riddles, coupon descriptions, answer keywords, and jokes
- `logic.mjs`: start date, calendar logic, fuzzy matching, and coupon use limits
- `app.mjs`: screens and interactions
- `style.css`: desktop and mobile styling

Browser progress stays on the same browser/device. Clearing site data resets it.
