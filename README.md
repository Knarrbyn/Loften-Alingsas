# Vallöftesgranskaren (arbetsnamn)

Neutral, källspårad tjänst som prissätter Alingsåspartiernas lokala vallöften inför
kommunvalet 2026, samt beskriver konsekvenser för kommunens verksamhet och för medborgarna.

Fristående från `Knarrbyn/Kommundata` (Faktagranskaren) och `mpvalinfo` — se
`VALLOFTESGRANSKAREN-SPEC.md` §8 för neutralitetsmotivering.

**Status:** under uppbyggnad. Se `DECISION_LOG.md` för senaste läget och
`VALLOFTESGRANSKAREN-SPEC.md` för fullständig specifikation.

## Struktur

- `VALLOFTESGRANSKAREN-SPEC.md` — fullständig systemspecifikation
- `DECISION_LOG.md` — kronologisk logg över beslut och fynd
- `src/config.ts` — partikonfiguration, källäge per parti
- `data/raw/` — hämtade källdokument
- `data/published/loften.json` — publicerad, källspårad data
- `data/needs_review/` — poster som underkänts av gates, publiceras ej
