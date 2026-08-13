# Cell2U Vanilla Export Tasks

- [x] Create the static HTML pages for home, shop, product detail, and checkout.
- [x] Create the vanilla CSS design system and responsive layouts.
- [x] Create the JavaScript cart, wishlist, search, filters, product detail, and checkout simulation.
- [x] Create JSON product data and README instructions.
- [x] Validate JSON and static HTTP loading.
- [x] Package the export as a zip archive.
- [x] Upload the static files to the selected GitHub repository.
- [x] Confirm the GitHub commit and provide the zip download to the user.
- [ ] Optionally enable GitHub Pages in repository Settings → Pages.

> Payment processing is intentionally not included. The checkout is a frontend-only simulation.

> Images use free Unsplash URLs from `data/products.json`; replace them with owned production assets before commercial launch.

> References: [Unsplash](https://unsplash.com/), [GitHub Pages documentation](https://docs.github.com/en/pages)

## References

[Unsplash]: https://unsplash.com/ "Unsplash"
[GitHub Pages documentation]: https://docs.github.com/en/pages "GitHub Pages documentation"

## Style Decisions

The export preserves the Cell2U Clean Commerce Kinetics direction: white-first layouts, baby-blue trust and action signals, and yellow reserved for deals and discounts.

The logo rule uses the C2U monogram paired with the Cell2U wordmark throughout the static pages.

The checkout remains a simulation without payment processing or backend order creation.

## Icon and domain follow-up

- [ ] Replace emoji UI glyphs with consistent vector icons throughout all static pages.
- [ ] Validate the icon update and sync the rebuilt static export to GitHub.
- [ ] Add the requested custom domain to GitHub Pages after the user provides the exact domain name.
- [ ] Confirm DNS records at the user's domain registrar and enable GitHub Pages HTTPS once available.

> Domain configuration requires the exact domain name and access to its DNS settings. GitHub Pages SSL cannot be issued until DNS points to GitHub.

## References

[GitHub Pages documentation]: https://docs.github.com/en/pages "GitHub Pages documentation"

## GitHub synchronization recovery

- [ ] Audit the local static export and the remote `main` branch commit.
- [ ] Finish the remaining emoji replacements in the static files.
- [ ] Rebuild the zip and push the verified icon update to GitHub.
- [ ] Confirm the remote commit hash and affected file contents.

## Final delivery recovery

- [ ] Finish all remaining visible emoji replacements.
- [ ] Rebuild and validate the downloadable zip archive.
- [ ] Push the final archive and static files to GitHub.
- [ ] Verify the remote branch and deliver the archive here.
