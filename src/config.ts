// Vallöftesgranskaren — partikonfiguration
// Se VALLOFTESGRANSKAREN-SPEC.md §2 för källhierarki-definition (nivå 1–4).
// Källäget kartlagt 2026-08-18, ska omsökas enligt OMSOKNING_DATUM (SPEC §9).

export type KallNiva = 1 | 2 | 3 | 4;

export interface PartiConfig {
  kod: string;
  namn: string;
  kalla_niva: KallNiva;
  kalla_url: string | null;
  kalla_typ: "lokalt_program" | "lokalt_utspel" | "nationellt_program" | "ej_hittat";
  senast_sokt: string; // ISO-datum
  anteckning?: string;
}

export const PARTIER: PartiConfig[] = [
  {
    kod: "s",
    namn: "Socialdemokraterna",
    kalla_niva: 1,
    kalla_url: "https://alingsas.socialdemokraterna.se/alingsas/val-2026/vart-valmanifest",
    kalla_typ: "lokalt_program",
    senast_sokt: "2026-08-18",
    anteckning: "Eget kommunpolitiskt handlingsprogram 2027–2030 (PDF) + separat valmanifest (PDF).",
  },
  {
    kod: "mp",
    namn: "Miljöpartiet de gröna",
    kalla_niva: 1,
    kalla_url: null,
    kalla_typ: "lokalt_program",
    senast_sokt: "2026-08-18",
    anteckning:
      "Lokalt manifest 'Alingsås vinner på grön politik' mottaget som uppladdad PDF 2026-08-18. " +
      "Ej hittat via sökning — mp.se/alingsas visade fortfarande gamla 2023–2026-manifestet. " +
      "Se data/raw/mp/ för källfilen.",
  },
  {
    kod: "sd",
    namn: "Sverigedemokraterna",
    kalla_niva: 2,
    kalla_url: "https://sd.se/alingsas",
    kalla_typ: "lokalt_utspel",
    senast_sokt: "2026-08-18",
    anteckning: "Löpande textsida med lokala sakförslag. Ingen PDF, ej tydligt daterad till 2026 — verifiera vid extraktion.",
  },
  {
    kod: "c",
    namn: "Centerpartiet",
    kalla_niva: 3,
    kalla_url: null,
    kalla_typ: "nationellt_program",
    senast_sokt: "2026-08-18",
    anteckning: "Nationellt valmanifest 'Sverige kan mer' (2026-06-16). Ingen lokal Alingsås-programtext hittad.",
  },
  {
    kod: "l",
    namn: "Liberalerna",
    kalla_niva: 3,
    kalla_url: null,
    kalla_typ: "nationellt_program",
    senast_sokt: "2026-08-18",
    anteckning: "Nationellt manifest finns. Lokalt bara odokumenterade medborgardialog-möten.",
  },
  {
    kod: "v",
    namn: "Vänsterpartiet",
    kalla_niva: 1,
    kalla_url: null,
    kalla_typ: "lokalt_program",
    senast_sokt: "2026-08-19",
    anteckning:
      "Egen lokal 'Vänsterpartiet Alingsås Valplattform 2026' mottagen som uppladdad PDF 2026-08-19. " +
      "Strukturerad i tydliga teman (Vi stärker välfärden / Trygga bostäder åt alla / Alingsås bästa " +
      "arbetsgivare / Social hållbarhet / Ett rödgrönt Alingsås) med explicita 'Våra skarpaste " +
      "förslag'-listor per tema — mer extraktionsvänligt format än MP:s rättighetsformulering.",
  },
  {
    kod: "m",
    namn: "Moderaterna",
    kalla_niva: 4,
    kalla_url: null,
    kalla_typ: "ej_hittat",
    senast_sokt: "2026-08-18",
    anteckning: "Nationellt handlingsprogram pågår fortfarande. Lokal sida visar bara nomineringsstämma.",
  },
  {
    kod: "kd",
    namn: "Kristdemokraterna",
    kalla_niva: 4,
    kalla_url: null,
    kalla_typ: "ej_hittat",
    senast_sokt: "2026-08-18",
    anteckning: "Inget nationellt eller lokalt program publicerat ännu.",
  },
  {
    kod: "kp",
    namn: "Kommunistiska partiet",
    kalla_niva: 4,
    kalla_url: null,
    kalla_typ: "ej_hittat",
    senast_sokt: "2026-08-18",
    anteckning: "Ej djupsökt — dök upp i kandidatstatistiken för Alingsås KF-valet 2026.",
  },
];

// Ägarbeslut 2026-08-18 (SPEC §9): omsök samtliga källor igen inför kampanjens slutskede.
export const OMSOKNING_DATUM = "2026-09-01";
