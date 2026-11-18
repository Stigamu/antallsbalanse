# Biomassebalanse – Antallsregnskap

Webapp basert på regnearket *Biomassebalanse.xlsx* (ark «Biomassebalanse (2)»).

## Publisering på GitHub Pages
1. Opprett et repository, f.eks. `biomassebalanse`.
2. Last opp alt innhold (inkl. `.github/`, `.nojekyll` og `bilder/`), commit til `main`.
3. Settings → Pages → Source: GitHub Actions.
4. URL: `https://<brukernavn>.github.io/biomassebalanse/`

## Knapper
- **Send som SMS** – åpner SMS-appen med rapporten ferdig utfylt.
- **Send på mail** – åpner e-postprogrammet med emne og rapport.
- **Slett innhold i gule bokser** – tømmer alle gule tallfelt (etter bekreftelse).

## Beregninger (som i regnearket)
- Sum IB = Utsett
- Sum produksjonsdata = Døde + Destruert + Avlivet prøve + Flyttet ut + Slakt + Rømming
  + Antallsavvik + Uspes. avvik i perioden + UB
- BALANSE = Sum IB − Sum produksjonsdata

Antallsavvik og uspesifisert avvik føres med motsatt fortegn av det som står i FT.
