# Gabriel Bortoleto Wiki

A searchable, source-linked research wiki on Brazilian racing driver Gabriel Bortoleto, organized as one Markdown file per subgroup.

> Research status: initial structured research seed, last reviewed 29 October 2026. This is not yet a complete race-by-race statistics database. 2026 is ongoing; verify date-sensitive figures against official results.

## Browse
- `index.html` — search and browse interface
- `styles.css` — responsive styles
- `app.js` — loading, navigation and searching
- `manifest.json` — group and subgroup registry
- `content/*.md` — individual subgroup articles with sources

## Local setup
Browsers restrict `fetch()` on local files. From the repository root run:

```bash
python -m http.server 8000
```

Open http://localhost:8000/. To publish using GitHub Pages: Settings → Pages → Deploy from a branch → `main` / root.

## Primary starting points
- [Audi Revolut F1 Team — Gabriel Bortoleto](https://www.audif1.com/en/team/drivers/gabriel-bortoleto)
- [Formula 1 — driver profile](https://www.formula1.com/en/drivers/gabriel-bortoleto)
- [FIA Formula 3 — McLaren development announcement](https://www.fiaformula3.com/en/latest/article/gabriel-bortoleto-signs-with-mclaren-driver-development-programme.3w3cxd50uFFxVAFeJPxOW4)
- [A14 Management — profile](https://a14management.com/driver/gabriel-bortoleto/)
- [Wikipedia — secondary career summary](https://en.wikipedia.org/wiki/Gabriel_Bortoleto)

## Source policy
Prioritize official FIA, Formula 1, team and championship records. Use reputable reporting for interviews and context. Wikipedia is a discovery aid, not final authority. Each subgroup should identify uncertainty and use dated sources. Add content under `content/` and register it in `manifest.json`. Summarize and link articles rather than reproducing long copyrighted text.

## Kiko Bot + Live Debate

This repo now includes a local Node.js backend for Kiko, powered by the Google Gemini API. The API key stays server-side.

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Put your Google AI Studio key in `GEMINI_API_KEY` and set a private `KIKO_OWNER_TOKEN`.
4. Run `npm install`, then `npm start`.
5. Open http://localhost:8000.

- The **Open Kiko Bot** button opens the assistant in a new tab.
- Kiko can answer from the wiki, search its Markdown pages, and create a new local wiki article when you supply the owner token.
- The Live Debate room opens in a separate tab. Type or dictate each speaker's statement; the feed stores entries in that browser's local storage and Kiko analyses the argument.
- This backend writes wiki changes to the local checkout. GitHub Pages is static and cannot run Node routes or persist writes. To publish new articles, commit and push the changed `content/` file and `manifest.json`. For an online AI backend, deploy a server-capable host and set its environment variables there.
- Never commit `.env` or share your API key. The committed `.env.example` is a blank template.
