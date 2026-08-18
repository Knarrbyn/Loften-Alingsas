# DECISION_LOG.md — Vallöftesgranskaren

Kronologisk logg över arkitekturbeslut, fynd och avvikelser. Samma disciplin som
Faktagranskarens `DECISION_LOG.md` — se `ARKITEKTURMALL-civic-tech.md`.

---

## 2026-08-18 — Projektstart: repo, källkartläggning, ägarbeslut

**Repo:** `Knarrbyn/Loften-Alingsas`, fristående från `Kommundata`/`Kommundata-arkiv`.
Motivering: neutralitetsprincipen kräver institutionell separation mellan neutrala verktyg
(Faktagranskaren, detta projekt) och partiska verktyg (mpvalinfo) — delad kodbas/branding
skulle skada trovärdigheten hos alla tre.

**Autentisering:** ny fine-grained PAT skapad, scoped enbart till detta repo (Contents +
Actions, Read/write). Namngiven `vallofte-push` i GitHub UI, ~60 dagars giltighet — förbi
valet 2026-09-13.

**Källkartläggning genomförd för samtliga 9 partier** i Alingsås KF (se `src/config.ts` för
fullständig tabell). Sammanfattning vid projektstart:
- Nivå 1 (eget lokalt program): S, MP
- Nivå 2 (lokala utspel utan sammanhållet dokument): SD
- Nivå 3 (bara nationellt program): C, L, V
- Nivå 4 (inget hittat): M, KD, Kommunistiska partiet

**Fynd — MP:s manifest:** mottaget som manuell PDF-uppladdning samma dag, INTE hittat via
sökning eftersom `mp.se/alingsas` fortfarande visade det gamla 2023–2026-manifestet vid
sökningstillfället. Visar att sökbaserad kartläggning inte är tillförlitlig ensam — omsökning
(se nedan) bör kompletteras med att fråga ägaren om kända uppdateringar.

**Fynd — rättighetsformulerade löften (R7 i SPEC):** MP:s manifest är strukturerat som
"Som [roll] har du rätt till..." snarare än raka löften. Blandar konkreta åtgärder
(t.ex. "subventionerat fritidskort") med vaga ställningstaganden utan mätbar åtgärd
(t.ex. "rätt till ett fritt och oberoende kulturliv"). Ny invariant tillagd i SPEC: extract-
steget ska bara skapa en löftespost för konkreta, avgränsade åtgärder — gäller alla partier,
av samma neutralitetsskäl som R6 (annars straffas partier som skriver konkret).

### Ägarbeslut (se VALLOFTESGRANSKAREN-SPEC.md §9 för fullständig kontext)

| Beslut | Utfall |
|---|---|
| Konsekvensfält (verksamhet/medborgare) | Kort format, en mening per fält |
| Neutralitetsgrind på konsekvensfält | Ja — samma tvåmodells-granskning som citat/pris (R6) |
| Omsökningsdatum för källor | 2026-09-01 |
| Kommunistiska partiet | Inkluderas, samma grindar som övriga 8 |
| Historik vid ändrade/tillbakadragna löften | Ingen `history[]`-mekanism — kort tidshorisont till valet gör den onödig |
| Hosting | Netlify, fristående site. Provisoriskt namn `vallofte-alingsas.netlify.app` |

### Öppna frågor som kvarstår

- **Kolada-integrationen** (`api.kolada.se`) bekräftad på dokumentationsnivå — Alingsås
  kommun-id `1489`, 5 000+ nyckeltal över 264 verksamhetsområden. **INTE skarpt testad** —
  domänen är nätverksblockerad i utvecklingssandboxen. Måste testas skarpt (GitHub Actions
  eller manuellt) innan pipeline-steget `price` (SPEC §3) litas på i produktion. Specifika
  KPI-id:n för respektive löfteskategori (kulturskola, hemtjänst, cykelvägar m.m.) ska väljas
  EFTER att extract-steget körts mot samtliga partiers manifest — inte i förväg.
- **Permanent namn/domän** — ej beslutat, arbetsnamn "Vallöftesgranskaren" används tills vidare.

---

## 2026-08-18 (kväll) — Lokal utvecklingsmiljö, andra MP-dokument mottaget

**Astro-sajten scaffoldad** i `site/`-undermappen (medvetet separerad från pipelinens `src/`
i repo-roten för att undvika namnkrock). Byggd och verifierad lokalt (`npm run build` OK)
innan push. Renderar `site/src/data/loften-demo.json` — handskriven demodata, inte
pipeline-output. Byt ut mot riktig data när `publish`-steget finns.

**Andra MP-dokument mottaget:** en broschyr ("Ett tryggt och hållbart Alingsås",
kandidater Thomas Martinsson, Janine Alm Ericson, Jenny Hellsten) med annan rubrikstruktur
(Klimat och miljö / Demokrati och mänskliga rättigheter / Välfärd, gemenskap och trygghet)
än det tidigare uppladdade manifestet ("Alingsås vinner på grön politik"). INTE bekräftat
som identiskt innehåll — loggas som en möjlig andra lokal källa, inte sammanslaget med det
första dokumentet utan vidare granskning. Extraktion av löften ur detta dokument är inte
gjord än.

**Nästa steg:** ägaren sätter upp lokal utvecklingsmiljö (Node.js, git clone, npm install,
npm run dev) för att kunna se ändringar live på egen dator.
