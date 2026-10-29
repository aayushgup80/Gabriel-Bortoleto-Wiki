# Gabriel Bortoleto Wiki

A searchable, source-linked research wiki on Brazilian racing driver Gabriel Bortoleto, organized as one Markdown file per subgroup.

> **Research status:** Initial research seed, last reviewed 29 October 2026. This is not yet a complete race-by-race statistical database. Statistics for the ongoing 2026 season can change; consult the cited official results before relying on a current number. Claims sourced from secondary summaries are identified as such and should be cross-checked.

## Browse the wiki

- Open `index.html` in a browser through GitHub Pages, or run a local web server.
- Use the search bar to search across all Markdown pages.
- Choose a category or subgroup in the navigation tree.
- Filter by topic and see citations/source links in each page.

## Local setup

Because browsers restrict `fetch()` when an HTML file is opened directly, use a local server:

```bash
python -m http.server 8000
```

Then open http://localhost:8000/.

On GitHub, enable **Settings → Pages → Deploy from a branch → main / root** to publish the wiki as a static site.

## Structure

- `index.html` — search and browse UI
- `styles.css` — responsive styling
- `app.js` — loading, navigation and search
- `manifest.json` — page registry and group hierarchy
- `content/*.md` — subgroup pages, with metadata and sources

## Source policy

Prefer official FIA, Formula 1, team, championship and series records. Use reputable motorsport reporting for interviews and context. Wikipedia is a discovery aid, not the final authority. Avoid presenting speculation about private life or driving telemetry as fact. Each page should note source quality, uncertainty and last-verified date.

## Research starting points

- [Audi Revolut F1 Team — Gabriel Bortoleto](https://www.audif1.com/en/team/drivers/gabriel-bortoleto)
- [Formula 1 — Gabriel Bortoleto driver profile](https://www.formula1.com/en/drivers/gabriel-bortoleto)
- [FIA Formula 3 — McLaren Driver Development announcement](https://www.fiaformula3.com/en/latest/article/gabriel-bortoleto-signs-with-mclaren-driver-development-programme.3w3cxd50uFFxVAFeJPxOW4)
- [A14 Management — Gabriel Bortoleto](https://a14management.com/driver/gabriel-bortoleto/)
- [Wikipedia — Gabriel Bortoleto](https://en.wikipedia.org/wiki/Gabriel_Bortoleto) (secondary reference; cross-check claims)

## Contributing

Add new material in a dedicated subgroup Markdown file under `content/`, add its metadata and source URLs, then register it in `manifest.json`. Do not copy long copyrighted articles; summarize and link to them.