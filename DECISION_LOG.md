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

---

## 2026-08-19 — Arkitekturbeslut: fetch-steget är delvis manuellt för detta projekt

**Fynd:** `moderaternaalingsas.se` blockerar automatiserad åtkomst (robots.txt). Detta är
inte ett tillfälligt sandbox-hinder utan gäller den skarpa pipelinen också — `fetch`-steget
kan aldrig skrapa den sidan, oavsett var koden körs.

**Beslut:** till skillnad från Faktagranskaren (helautomatisk `fetch` mot MeetingPlus) blir
källinsamlingen för det här projektet medvetet HYBRID:
- Digitalt tillgängliga källor (S:s PDF-manifest, eventuella framtida publicerade program)
  hämtas automatiskt när möjligt.
- Källor som blockerar skrapning, eller bara finns fysiskt (broschyrer från valstugor),
  samlas MANUELLT av ägaren — fotograferas och laddas upp, transkriberas sedan med samma
  verbatim-disciplin som digitala källor. Detta är inte en kvalitetsförsämring: samma
  verbatimgrind (R2) och källhierarki (§2.2) gäller oavsett hur texten kom in i systemet.

**Praktisk info:** Alingsås kommun flyttar torghandeln tillfälligt till Kungsgatan för att
göra plats för valstugor på Stora Torgets östra sida inför valet 2026-09-13 — bekräftar att
fysisk insamling är en rimlig, tidsmässigt välplacerad metod inför omsökningsdatumet
2026-09-01. V har dessutom en "Valhubb" på Norra Strömgatan 9, Alingsås.

**Konsekvens för SPEC:** `VALLOFTESGRANSKAREN-SPEC.md` bör uppdateras med denna hybrid-
insamlingsmodell vid nästa spec-revision (ej gjort ännu — dokumenterat här under tiden).

---

## 2026-08-19 — V uppgraderad till nivå 1: riktig lokal valplattform mottagen

**Källa:** "Vänsterpartiet Alingsås Valplattform 2026" (PDF), mottagen som uppladdning.
Uppgraderar V från nivå 3 (bara regional/nationell) till **nivå 1** (eget lokalt program).

**Formatobservation:** till skillnad från MP:s rättighetsformulerade manifest ("Som [roll]
har du rätt till...") är V:s dokument strukturerat med explicita rubriker per tema och
punktlistor under "Våra skarpaste [tema]förslag". Betydligt mer direkt extraherbart —
värdefullt referensexempel när extract-prompten designas, eftersom pipelinen nu har två
genuint olika verkliga format att testas mot (jfr Faktagranskarens princip att testa mot
flera riktiga exempel innan automatisering, se pipeline-README.md).

**R7-konkretionsfilter tillämpat manuellt (exempel, ej uttömmande):**
- Konkreta (skulle bli löftesposter): "Inför gratis skolfrukost i alla grundskolor i
  Alingsås", "Höj bidragen till Kvinno- och Tjejjouren Olivia", "Utöka fältgruppen med
  minst två fältassistenter", "Inga utförsäljningar av Alingsåshems lägenheter"
- Gränsfall: "Frysa hyrorna" — konkret åtgärd men utan tidsram/nivå angiven
- För vaga för prissättning: "Satsa på den psykosociala och fysiska arbetsmiljön",
  "Stärka möjligheterna till kompetensutveckling för kommunens personal"

**Öppen fråga:** med nu två strukturellt olika verkliga källor (MP + V) i handen är det
läge att överväga om nästa steg ska vara fler manuella enskilda extraktioner, eller att
börja bygga den riktiga `extract`-pipeline-koden och testa den mot båda formaten samtidigt.

---

## 2026-08-19 (kväll) — SD uppgraderad till nivå 1: första explicit prissatta löftena

**Källa:** "SD Alingsås Budget för 2025 med plan för 2026 och 2027" (PDF), länkad från
`sd.se/alingsas/vad-vi-vill/` under "Övriga dokument". Uppgraderar SD från nivå 2 till
**nivå 1**.

**Genombrott:** dokumentet innehåller FYRA explicit prissatta poster — första gången
projektet har `pris.konfidens: "explicit"` istället för uppskattning. Exempel tillagt i
`site/src/data/loften-demo.json`: 30 mnkr/år permanent ramökning till Barn- och
ungdomsnämnden. Övriga tre (5 mnkr Tekniska nämnden, 4,5 mnkr Vård- och omsorgsnämnden
"i årets budget", 10 mnkr AME/Socialnämnden) ej tillagda i demo än, men dokumenterade här
för framtida extraktion.

**Viktig nyans (aldrig hitta på-principen):** dokumentet är daterat som budgetförslag 2025,
INTE ett omdöpt "Valmanifest 2026". Räknas som nivå 1 (eget lokalt program) enligt
källhierarkin eftersom det är SD:s egna, aktuella politiska ställningstaganden — men bör
dubbelkollas mot ett eventuellt nyare/uppdaterat dokument vid omsökning 2026-09-01.
"4,5 mnkr... i årets budget" är dessutom oklart om det är en engångssatsning eller
återkommande — INTE antaget som `_per_ar` utan vidare verifiering.

**Cross-projekt-fynd (för FAKTAGRANSKAREN, inte detta projekt):** samma SD-sida länkar till
flera formella kommunala dokument som troligen redan finns i Faktagranskarens dataset —
motioner, ett initiativärende, en reservation (KF 24-11-06), en protokollsanteckning, och
en **"Fråga till vård och äldre"** som mycket väl kan vara den "enkla fråga" Faktagranskaren-
specen (§9) sökt efter men aldrig hittat exempel på. Bör kollas i Faktagranskaren-tråden,
inte här.
