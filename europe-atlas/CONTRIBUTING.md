# Contributing / Contribuer

Thank you for helping! Merci de votre aide !

## 1. Translate travel tips (most wanted)
Open `i18n/de.json`, `i18n/zh.json` or `i18n/ru.json` and add entries to the `"tips"` object, using the country code as key and the English tip (`i18n/en.json`) as source:

```json
"tips": { "bj": "Ihre Übersetzung hier…" }
```
Run `node scripts/validate.js` to see progress. Partial pull requests are welcome (even 5 countries).

## 2. Fix or update data
Edit `data/countries.json`. In your pull request, **cite the source and year** (World Bank, IMF, UN DESA, Ethnologue…). Units: `pop` in millions, `gdp_bn` and `gdp_ppp_bn` in billions of USD / international dollars, `female_pct` in percent.

## 3. Add a tip or a language
- New tip: add it to `fr.json` and `en.json` at least.
- New language: copy `i18n/en.json` to `i18n/<code>.json`, translate, then add the code to `LANGS` in `assets/app.js`.

## Guidelines
- Tips must be factual, neutral and useful to travellers; for risky areas, point to official advisories rather than giving security guidance.
- No copyrighted text or photos: photos are loaded from Wikimedia Commons.
- Keep the project dependency-free (plain HTML/CSS/JS).
- Before opening a PR run `node scripts/validate.js` (it must exit without errors).
- Be respectful: the project describes real countries and people.
