# 🇪🇺 Europe Atlas / Atlas de l'Europe

**EN** An open-source, multilingual (FR · EN · DE · ZH · RU) atlas of all 50 European countries: photos, population (female/male), languages, GDP and PPP GDP, currency, time zones and practical travel tips. Each country links to a street map of its capital via [City Roads](https://anvaka.github.io/city-roads/).

**FR** Atlas open source et multilingue (FR · EN · DE · ZH · RU) des 50 pays européens : photos, population (femmes/hommes), langues, PIB et PIB en PPA, monnaie, fuseaux horaires et conseils pratiques pour les voyageurs. Chaque pays renvoie vers la carte des rues de sa capitale via [City Roads](https://anvaka.github.io/city-roads/).

## Run / Lancer
Pure static site, no build step. Because it loads JSON files, serve it over HTTP:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```
To publish: GitHub → Settings → Pages → deploy from the main branch. Force a language with `?lang=de`.

## Structure
| Path | Role |
|---|---|
| `data/countries.json` | Language-neutral facts (one object per country) |
| `i18n/<lang>.json` | UI strings and travel tips for one language |
| `assets/` | `app.js`, `style.css` |
| `scripts/validate.js` | Checks data and lists missing translations |

Country and currency names come from the browser (`Intl.DisplayNames`). Photos come from Wikipedia/Wikimedia Commons, flags from flagcdn.com.

## Data analysis
`data/countries.json` is a flat, language-neutral dataset (units: `pop` in millions, `gdp_bn` and `gdp_ppp_bn` in billions of USD / international dollars, `female_pct` in percent).

```python
import pandas as pd
df = pd.read_json("data/countries.json")
df["female_m"] = df["pop"] * df["female_pct"] / 100
df["gdp_per_capita_usd"] = df["gdp_bn"] * 1000 / df["pop"]
print(df.groupby("region")[["pop", "gdp_bn"]].sum())
df.to_csv("countries.csv", index=False)   # export for Excel, R, Power BI...
```

## ⚠️ Data quality
Figures are **rounded approximations** (2024 orders of magnitude) and need verification against World Bank, IMF, UN and Ethnologue. Female share is mostly an estimate. This is exactly where help is wanted. Travel tips are not official advice: always check your government's travel advisories.

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md). Priorities: **translate travel tips into German, Chinese and Russian** (currently falling back to English), verify figures with sources, add languages.

## License
Code: MIT. Data and texts: CC BY 4.0. See [LICENSE](LICENSE).
