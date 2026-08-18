# VALLÖFTESGRANSKAREN — Systemspecifikation: Prissatta kommunlöften för Alingsås

**Version 0.1 · 2026-08-18 · Status: Utkast, väntar på ägarbeslut i §9**
**Målgrupp: autonom LLM-byggagent (Claude Code eller likvärdig) med tillgång till filsystem, terminal och webb.**

> Arbetsnamn. Byggd enligt samma generella mall som Faktagranskaren
> (`ARKITEKTURMALL-civic-tech.md`) och inspirerad direkt av [utlovat.se](https://utlovat.se)
> (samma upphovsperson och repo som drygast.nu: `github.com/bambapappa/valflask`, CC BY 4.0 —
> ska krediteras "utlovat.se" vid faktisk återanvändning av deras metod/kod). Skillnaden mot
> utlovat.se: kommunnivå istället för riksnivå, med två extra analysfält (konsekvenser för
> verksamheten/medborgarna) som utlovat.se inte har.

---

## 0. Instruktion till byggagenten — läs detta först

1. **Läs hela dokumentet** innan du skriver en rad kod. Läs även `FAKTAGRANSKAREN-SPEC.md` och
   `ARKITEKTURMALL-civic-tech.md` — den här specen återanvänder deras pipeline-skelett och
   utökar det, den uppfinner inte ett nytt mönster.
2. **Två helt olika sorters innehåll i den här appen, med olika sanningskrav:**
   - **Citat och belopp från källan** → verbatimgrind, ren kod, exakt som Faktagranskaren.
   - **Prisuppskattningar, konsekvensanalys** → AI-genererad tolkning. Får ALDRIG presenteras
     som fakta. Varje sådant fält har `typ: "analys"` och en synlig konfidensnivå. Blanda
     aldrig dessa två kategorier i samma UI-yta utan tydlig visuell åtskillnad.
3. **Neutralitetsprincipen är hårdare här än i Faktagranskaren.** Faktagranskaren återger bara
   vad som redan hände (beslut, röster) — svårt att vinkla. Den här appen genererar bedömningar
   av vad som *skulle* hända. Det är en betydligt större risk för att AI:n omedvetet gynnar ett
   parti i formulering eller urval. Se §4.3 (neutralitetsgrinden) och R6.
4. **Hitta aldrig på uppgifter.** Om ett löfte inte går att prissätta eller konsekvensbedöma
   utifrån konkret underlag (nyckeltal, jämförbart exempel, egen text i löftet) — lämna fältet
   tomt med den föreskrivna texten. Gissa aldrig ett belopp eller en konsekvens.
5. **Avvikelser och egna val** loggas i `DECISION_LOG.md`, samma disciplin som Faktagranskaren.
6. **Allt användarvänt innehåll på svenska.** Kod och commit-meddelanden på engelska.
7. **Fristående drift.** Helt separat repo, hosting och branding från både Faktagranskaren och
   mpvalinfo — se §8 (juridik/etik) för motivering.

---

## 1. Vision, mål och icke-mål

### 1.1 Problem

utlovat.se prissätter riksdagspartiernas löften mot statens budgetutrymme. Inget motsvarande
finns för kommunnivå. Alingsås-väljare kan läsa lokala vallöften men saknar en samlad, neutral
bild av: (a) vad löftena skulle kosta kommunen, (b) vad kommunen faktiskt har råd med, och
(c) vad ett löfte konkret skulle innebära — för kommunens egen verksamhet och för medborgarna.

**Källäget är ojämnt** (kartlagt 2026-08-18, se `DECISION_LOG.md`): av 9 partier i Alingsås KF
har endast **S** ett tydligt avgränsat lokalt kommunalt program. Övriga har antingen bara
nationell politik, spridda lokala utspel utan sammanhållet dokument, eller inget alls ännu.
Detta är inte ett engångsproblem att lösa och glömma — det ska vara en synlig, uppdaterad del
av datamodellen (se §4.1, fältet `kalltackning`).

### 1.2 Vision

**Vallöftesgranskaren** är en neutral, statisk webbtjänst som samlar Alingsåspartiernas lokala
vallöften inför valet 2026, prissätter dem med öppen metod och transparent konfidensnivå, och
beskriver — strikt sakligt, aldrig värderande — vilka konsekvenser respektive löfte skulle få
för kommunens verksamhet och för medborgarna.

### 1.3 Mål (mätbara)

- **G1:** Samtliga 9 partiers offentligt publicerade lokala vallöften för Alingsås kommunval
  2026 fångade senast 1 september 2026 (12 dagar före valet 13 september).
- **G2:** 100 % av citerade löftestexter verifierade ordagrant mot källan (samma verbatimgrind
  som Faktagranskaren).
- **G3:** Varje prisuppskattning och konsekvensanalys taggad med explicit konfidensnivå
  (§4.2) — aldrig en dold uppskattning som ser ut som fakta.
- **G4:** Källtäckning per parti synlig på sajten, uppdaterad varje körning — motsvarande
  utlovat.se:s "sidor lästa"-kolumn.
- **G5:** Total driftkostnad < 1 500 kr/år (samma budgetram som Faktagranskaren).
- **G6:** Neutralitetsgrinden (§5, steg 5b) körd på 100 % av genererade konsekvensfält innan
  publicering.

### 1.4 Icke-mål

- **Ingen ranking av "bästa parti"** eller sammanvägt betyg. Bara fakta + tydligt märkt analys,
  medborgaren drar egna slutsatser — matchar Faktagranskarens icke-mål 1.4.
- **Ingen bedömning av önskvärdhet.** "Konsekvens för medborgarna" beskriver VAD som händer,
  aldrig OM det är bra eller dåligt.
- **Inga löften utan skriftlig källa.** Muntliga utspel i debatter/intervjuer tas inte med om
  de inte också finns nedskrivna i ett parti-publicerat dokument eller på partiets egen sida.
- **Ingen realtidsbevakning.** Uppdatering 2–3 ggr/vecka fram till valet räcker (löften
  publiceras i ryck, inte kontinuerligt).

---

## 2. Källor och källhierarki

### 2.1 Kartlagt läge (2026-08-18) — se `DECISION_LOG.md` för fullständiga URL:er

| Parti | Lokalt kommunalt program? | Nivå (se §2.2) |
|---|---|---|
| S | Ja — eget PDF-program + valmanifest | 1 |
| SD | Ja, löpande textsida, ej daterad/strukturerad | 2 |
| MP | Ja — "Alingsås vinner på grön politik", eget lokalt manifest 2026 (fångat via manuell uppladdning 2026-08-18, inte hittat vid sökning — lokala sidan visade fortfarande 2023–2026-manifestet) | 1 |
| C | Nej — bara nationellt valmanifest | 3 |
| L | Nej — bara nationellt manifest + odokumenterad medborgardialog | 3 |
| V | Nej — bara regional VG-valplattform (nämner Alingsås en gång) | 3 |
| M | Nej — inget hittat, nationellt program pågår fortfarande | 4 |
| KD | Nej — inget nationellt eller lokalt program klart ännu | 4 |
| Kommunistiska partiet | Ej undersökt | okänd |

### 2.2 Källhierarki (per löfte, inte per parti — ett parti kan ha löften på flera nivåer)

1. **Eget lokalt kommunalt program/valmanifest** — högst konfidens, räknas fullt i kommunsumman.
2. **Lokala konkreta utspel** (nyhetsinlägg, pressmeddelande, blogginlägg med sakförslag för
   Alingsås specifikt) — räknas in, märks `kalla_niva: 2`.
3. **Nationellt program, tydligt märkt "rikspolitik, ej kommunspecifik"** — visas i UI:t för
   kontext men **exkluderas ur kommunens totalsumma** (annars felaktig jämförelse mellan
   partier med olika mängd lokalt material — samma "sidor lästa"-problem som utlovat.se löser).
4. **Inget hittat** — partiet listas ändå (transparens), med texten "Inget lokalt program
   publicerat ännu" och datum för senaste sökning.

**Omsökning:** källorna ska sökas om minst en gång till närmare valet (förslagsvis 1 september),
eftersom flera partier troligen publicerar program under kampanjens gång.

---

## 3. Arkitektur i ett ögonkast

Samma grundprincip som mallen: statisk sajt, all bearbetning i pipeline, git som databas.
Utökad med två nya steg (prissättning, konsekvensanalys) och en ny grindtyp (neutralitet).

```
KÄLLA                                     PIPELINE (GitHub Actions)                    PUBLIKT
────────────────────────────              ──────────────────────────────────           ────────
partiernas egna hemsidor/PDF:er   ──┐      1. fetch        hämta löftestexter            Netlify +
(se §2)                            │      2. extract      LLM A → kandidatlöften          GitHub Pages
                                    │      3. gates-A      verbatimgrind (citat)           (samma
        Kolada (kommunala          │      4. price        LLM A → prisuppskattning        mönster som
        nyckeltal, öppet API)  ────┤         + konfidensnivå (§4.2)                        Faktagranskaren)
                                    │      5. consequences LLM A → verksamhet/medborgare
        kommunens budget-/         │         (§4.1, kort format, en mening/fält)
        VP-dokument (PDF)      ────┘      5b. gates-B      neutralitetsgrind (ren kod +
                                              checklista, LLM B granskar formulering)
                                           6. verify        LLM B, oberoende, sak + neutral
                                           7. archive       Wayback-snapshot
                                           8. link          löfte → parti, kategori, källniva
                                           9. publish       data/*.json, hash, changelog
                                          10. build         statisk sajt
```

---

## 4. Datamodell

### 4.1 Löfte (`loften.json` — array av poster)

```json
{
  "id": "l-2026-alingsas-0001",
  "parti": "s",
  "titel": "Avgiftsfri kulturskola och simskola",
  "quote": "Vi vill göra kulturskola och simskola avgiftsfri.",
  "kategori": "barn-utbildning | vård-omsorg | ekonomi | infrastruktur | miljö-klimat | demokrati | övrigt",
  "kalla_niva": 1,
  "source": {
    "url": "https://alingsas.socialdemokraterna.se/alingsas/val-2026/vart-valmanifest",
    "archive_url": "https://web.archive.org/web/.../...",
    "dokument_typ": "lokalt_program | lokalt_utspel | nationellt_program | ej_hittat",
    "fetched_at": "2026-08-18T10:00:00Z"
  },
  "pris": {
    "belopp_mkr_per_ar": 3.2,
    "konfidens": "explicit | nyckeltal | nedskalat | ej_mojlig",
    "grund": ["kolada_nyckeltal_N12345", "kulturskola_alingsas_2025_deltagarantal"],
    "typ": "analys"
  },
  "konsekvenser": {
    "verksamhet": {
      "text": "Kräver bortfall av avgiftsintäkter till kultur- och utbildningsnämnden, ingen förändring av personalbehov.",
      "grund": ["nuvarande_avgiftsintakt_kulturskola"],
      "typ": "analys",
      "konfidens": "medel"
    },
    "medborgare": {
      "text": "Berör barnfamiljer som idag betalar avgift för kulturskola/simskola; ingen effekt för övriga.",
      "grund": ["malgrupp_i_loftestext"],
      "typ": "analys",
      "konfidens": "hog"
    }
  },
  "extraction": { "model": "...", "verified_by": "...", "run_id": "2026-08-18T10" }
}
```

### 4.2 Prissättningsstege (invariant R1)

1. **`explicit`** — beloppet står uttryckt i löftestexten. Ingen uppskattning, bara extraktion.
2. **`nyckeltal`** — beräknat från kommunal styckkostnad (Kolada öppet API, eller kommunens
   egna budgetdokument).
3. **`nedskalat`** — skalat proportionellt från ett redan prissatt nationellt löfte (samma
   sakfråga), efter Alingsås andel av rikets befolkning (~42 900 / ~10,7 miljoner ≈ 0,40 %).
   Lägsta konfidens av de tre prissatta nivåerna, ska märkas tydligt i UI (samma `≈`-konvention
   som utlovat.se).
4. **`ej_mojlig`** — inget försvarbart underlag. `belopp_mkr_per_ar: null`, `grund: []`,
   löftet visas ändå men utan summa.

### 4.2b R7 — rättighetsformulerade punkter kräver konkretionsfilter

**Fynd (MP:s manifest 2026):** partiprogram formulerade som "Som [roll] har du rätt till..."
blandar konkreta, prissättbara åtgärder ("subventionerat fritidskort", "biblioteksfilial i
Ingared") med vaga ställningstaganden utan mätbar åtgärd ("rätt till ett fritt och oberoende
kulturliv"). Extract-steget (LLM A) ska bara skapa en löftespost när punkten innehåller en
**konkret, avgränsad åtgärd** — inte ett allmänt värderingsuttalande. Tumregel: går det att
svara på "vad exakt ska kommunen göra, och går det i princip att sätta ett årtal eller ett
klart avslutat tillstånd på det?" — om nej, exkludera eller flagga som `konkretion: "lag"`
(visas i UI utan prissättningsförsök, `pris.konfidens: "ej_mojlig"` sätts automatiskt utan att
prissättningssteget ens körs). Gäller alla partier, inte bara MP — samma neutralitetsskäl som
R6: skulle annars straffa partier som skriver konkret jämfört med partier som skriver löst.

### 4.3 Konsekvensfält — format och grind (invariant R2, utökat med R6)

- **Kort format, en mening per fält** (ägarbeslut 2026-08-18) — minimerar utrymme för
  partiskhet i formuleringen jämfört med längre resonemang.
- **`grund[]` obligatoriskt** vid icke-tomt `text`-fält: pekar på vilket nyckeltal, jämförbart
  exempel, eller vilken uttrycklig målgrupps-formulering i löftestexten som ligger till grund.
  Inget fritt resonemang utan spårbar grund.
- **R6 — neutralitetsgrind:** körs på VARJE konsekvensfält innan publicering, av modell B
  (samma modell som gör `verify`, men med ett separat neutralitetsprompt). Kontrollerar:
  (a) inga värdeladdade ord ("tyvärr", "lyckligtvis", "orealistiskt"), (b) symmetrisk
  detaljnivå oavsett parti — ett parti får inte systematiskt få kortare/torftigare
  konsekvensbeskrivningar än ett annat, (c) ingen implicit ställning till om konsekvensen är
  önskvärd. Underkänt → till `needs_review`, samma disciplin som verbatimgrinden.

### 4.4 Källtäckning (fält på partinivå, `partier.json`)

```json
{
  "parti": "s",
  "antal_loften": 14,
  "kalla_niva_fordelning": { "1": 12, "2": 2, "3": 0, "4": 0 },
  "senast_sokt": "2026-08-18"
}
```
Visas som en egen sida (`/kalltackning`), motsvarande utlovat.se:s transparens kring "sidor
lästa" — annars straffas partier som skrivit mest konkret (idag: S) i jämförelse med partier
som ännu inte publicerat något.

---

## 5. Jämförelseram

Löftenas totala kostnad ställs mot **båda**:
- **Kommunens investeringsutrymme** — hämtas ur senaste antagna budget-/VP-dokument
  (`alingsas.se`, sök efter "budget" eller "verksamhetsplan").
- **Kommunalskatteöret** — samma dokument brukar ange "1 öre kommunalskatt ≈ X mkr/år" som en
  redan uträknad, offentlig siffra. Inget vi uppskattar själva.

Endast löften med `kalla_niva: 1` eller `2` räknas in i kommunens totalsumma (se §2.2, punkt 3).

---

## 6. Teknikval

Samma som Faktagranskaren (§6 i den specen): Astro, TypeScript/Node 22, GitHub Actions,
Netlify + GitHub Pages, Anthropic API, Pagefind. Nytt tillägg: Kolada öppet API för kommunala
nyckeltal (`api.kolada.se`, ingen nyckel krävs).

---

## 7. Sidor & URL-schema

| URL | Innehåll |
|---|---|
| `/` | Total kostnadsbild, jämförelse mot budgetutrymme/skatteöre |
| `/parti/[kod]` | Alla löften för ett parti, källtäckning |
| `/lofte/[id]/[slug]` | Enskilt löfte: citat, pris, konsekvenser, källa + arkivlänk |
| `/kalltackning` | Öppen redovisning av källäge per parti (§4.4) |
| `/metod` | Prissättningsstege, neutralitetsgrind, öppen metodik |
| `/om` | Neutralitetslöfte |
| `/api` | Öppet JSON-API |

---

## 8. Juridik och etik

- **Neutralitetslöfte:** identisk metod och grindar för alla 9 partier, oavsett källäge.
  Fristående repo, hosting och branding — ingen koppling till mpvalinfo, som är medvetet
  partiskt internt verktyg (se `ARKITEKTURMALL-civic-tech.md`-principen om institutionell
  separation).
- **Attribution:** metodpraxis inspirerad av utlovat.se — kreditera "utlovat.se" om kod eller
  metod återanvänds direkt (CC BY 4.0, samma villkor som drygast.nu).
- **Rättelser:** synliga, aldrig i tysthet — egen `/rattelser`-sida, samma princip som
  Faktagranskaren §8.

---

## 9. Öppna frågor (ägarbeslut)

- **Omsökningsdatum för källor** — BESLUTAT (2026-08-18): 1 september 2026.
- **Kommunistiska partiet** — BESLUTAT: inkluderas, samma neutrala grindar som övriga 8 partier.
- **Hantering av löften som ändras/dras tillbaka** — BESLUTAT: ingen `history[]`-mekanism,
  kort tidshorisont fram till valet gör den onödig.
- **Hosting** — BESLUTAT: Netlify, samma mönster som Faktagranskaren och mpvalinfo. Fristående
  site, ingen delad branding. Provisoriskt sitenamn `vallofte-alingsas.netlify.app` tills
  ägaren väljer ett permanent namn/domän.
- **Namn och domän** — kvarstår, arbetsnamn "Vallöftesgranskaren" används tills vidare.

---

*Slut på specifikation (utkast). Byggagent: vänta på svar på §9 innan pipeline-arbetet påbörjas
skarpt — särskilt Kolada-verifieringen, eftersom prissättningsstegens nivå 2 (§4.2) vilar på den.*
