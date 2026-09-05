import Image from "next/image";
import Link from "next/link";
import { editorialDisplay } from "@/lib/editorial-font";
import BondExampleCalculator from "./BondExampleCalculator";
import styles from "./government-bond-guide.module.css";

const DSTA_BUYING = "https://www.dsta.nl/onderwerpen/s/staatslening-kopen";
const DSTA_DSL = "https://www.dsta.nl/actueel/leningvoorwaarden/staatsleningen-dsl-s";
const DSTA_CAPITAL_MARKETS = "https://www.dsta.nl/onderwerpen/k/kapitaalmarkt";
const DSTA_BOND_EXAMPLE =
  "https://www.dsta.nl/actueel/nieuws/2026/07/14/heropening-van-de-dsl-250-15-januari-2031-brengt-euro-327-miljard-op";
const DNB_DEPOSIT_GUARANTEE =
  "https://www.dnb.nl/betrouwbare-financiele-sector/nederlandse-depositogarantie/vragen-nederlandse-depositogarantie/";
const DNB_INVESTOR_COMPENSATION =
  "https://www.dnb.nl/betrouwbare-financiele-sector/beleggerscompensatie/";
const AFM_PROSPECTUS =
  "https://www.afm.nl/nl-nl/consumenten/themas/zelf-beleggen/het-prospectus";
const AFM_COSTS =
  "https://www.afm.nl/nl-nl/consumenten/themas/zelf-beleggen/wat-kost-beleggen";
const TAX_2026 =
  "https://www.belastingdienst.nl/wps/wcm/connect/nl/box-3/content/berekening-box-3-inkomen-2026";
const ESMA_FACTS =
  "https://www.esma.europa.eu/publications-data/questions-answers/1741";

function ArrowIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 10h11M11 6l4 4-4 4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="m4 10 4 4 8-9" />
    </svg>
  );
}

function ExternalLink({ href, children, className }) {
  return (
    <a className={className} href={href} target="_blank" rel="noreferrer">
      {children}
      <ArrowIcon />
    </a>
  );
}

function formatQuarter(value) {
  const match = /^(\d{4})-?Q([1-4])$/i.exec(String(value || ""));
  return match ? `${match[1]} Q${match[2]}` : value || "—";
}

export default function DutchGovernmentBondGuide({ country, preview = false }) {
  const ratio = Number(country?.official_debt_to_gdp_pct);
  const ratioText = Number.isFinite(ratio)
    ? `${new Intl.NumberFormat("nl-NL", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(ratio)}%`
    : "—";
  const period = formatQuarter(country?.official_debt_to_gdp_time);

  return (
    <article className={`${styles.page} ${editorialDisplay.variable} google-anno-skip`}>
      <section className={styles.hero} aria-labelledby="bond-guide-title">
        <div className={styles.shell}>
          {preview ? (
            <div className={styles.previewBar}>
              <span>Conceptpreview · pilot 1 van 27</span>
              <span>Niet geïndexeerd · niet gepubliceerd</span>
            </div>
          ) : null}

          <nav className={styles.breadcrumbs} aria-label="Kruimelpad">
            <Link href="/nl">EU Debt Map</Link>
            <span aria-hidden="true">/</span>
            <Link href="/nl/country/nl">Nederland</Link>
            <span aria-hidden="true">/</span>
            <span>Staatsobligaties</span>
          </nav>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Nederland · staatsobligatiegids</p>
              <h1 id="bond-guide-title">
                Nederlandse staatsobligaties kopen: hoe werkt dat?
              </h1>
              <p className={styles.heroLede}>
                Als particulier koop je een Nederlandse staatsobligatie normaal
                via een bank, broker of beleggingsadviseur. Je koopt een bestaande
                lening tegen de dan geldende marktprijs; niet via een koopknop van
                de overheid.
              </p>
              <ExternalLink href={DSTA_BUYING} className={styles.heroOfficialLink}>
                Bekijk eerst de officiële koopuitleg
              </ExternalLink>
              <dl className={styles.heroFacts}>
                <div>
                  <dt>Rechtstreeks bij de Staat</dt>
                  <dd>Nee</dd>
                  <small>Geen breed retailprogramma</small>
                </div>
                <div>
                  <dt>Gebruikelijke toegang</dt>
                  <dd>Bank of broker</dd>
                  <small>Via de secundaire markt</small>
                </div>
                <div>
                  <dt>Bronnen gecontroleerd</dt>
                  <dd>5 sep. 2026</dd>
                  <small>DSTA, DNB, AFM en Belastingdienst</small>
                </div>
              </dl>
            </div>

            <figure className={styles.heroVisual}>
              <Image
                src="/images/guides/nederlandse-staatsobligaties-kopen-hero.jpg"
                alt="Particuliere belegger die thuis informatie over staatsobligaties bestudeert"
                width={1672}
                height={941}
                priority
                sizes="(max-width: 900px) 100vw, 46vw"
              />
              <div className={styles.answerCard}>
                <span>Het korte antwoord</span>
                <strong>Ja, maar controleer eerst product én afrekenbedrag.</strong>
                <p>
                  Zoek de lening met de ISIN-code en let naast de koers op rente,
                  spread, kosten en de einddatum.
                </p>
              </div>
              <figcaption>Originele redactionele illustratie van EU Debt Map.</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <nav className={styles.chapterNav} aria-label="Op deze pagina">
        <div className={styles.shell}>
          <span>Op deze pagina</span>
          <a href="#routes">Kooproute</a>
          <a href="#zoeken">Lening zoeken</a>
          <a href="#rekenvoorbeeld">Rekenvoorbeeld</a>
          <a href="#risicos">Risico’s</a>
          <a href="#werking">Verdieping</a>
          <a href="#bronnen">Bronnen</a>
        </div>
      </nav>

      <section
        className={`${styles.section} ${styles.shell}`}
        id="routes"
        aria-labelledby="routes-title"
      >
        <header className={styles.sectionIntro}>
          <p className={styles.eyebrow}>01 — Praktische kooproute</p>
          <h2 id="routes-title">Van zoekopdracht naar een controleerbare order.</h2>
          <p>
            Dit zijn de vier praktische stappen voor iemand die één Nederlandse
            staatslening rechtstreeks wil bezitten. Of de lening beschikbaar is en
            welke orderregels gelden, verschilt per aanbieder.
          </p>
        </header>

        <ol className={styles.purchaseSteps}>
          <li>
            <span>01</span>
            <div>
              <h3>Gebruik een beleggingsrekening</h3>
              <p>
                Controleer of je bank of broker handel in losse obligaties aanbiedt;
                een gewone spaarrekening is niet voldoende.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Zoek op naam én ISIN</h3>
              <p>
                De unieke ISIN-code voorkomt dat je een lening met een vergelijkbare
                naam, maar een andere coupon of einddatum selecteert.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Controleer het afrekenbedrag</h3>
              <p>
                Bekijk koers, bied-laatverschil, opgebouwde rente, ordergrootte en
                alle transactie- of bewaarkosten.
              </p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Plaats alleen dan een order</h3>
              <p>
                Kies zelf of het product en de looptijd passend zijn. EU Debt Map
                geeft geen persoonlijke geschiktheidsbeoordeling.
              </p>
            </div>
          </li>
        </ol>

        <aside className={styles.officialAnswer}>
          <div>
            <span className={styles.officialBadge}>Officiële bron</span>
            <strong>Begin bij het Nederlandse Agentschap van Financiën.</strong>
            <p>
              DSTA noemt bank, beleggingsadviseur of broker als route en verkoopt
              zelf geen staatsobligaties aan particuliere beleggers.
            </p>
          </div>
          <ExternalLink href={DSTA_BUYING} className={styles.officialLink}>
            Open de Nederlandse DSTA-uitleg
          </ExternalLink>
        </aside>

        <div className={styles.alternativeRoutes}>
          <article>
            <span>Met begeleiding</span>
            <h3>Beleggingsadviseur</h3>
            <p>
              Een adviseur kan de persoonlijke geschiktheid beoordelen. Houd
              rekening met advies- en dienstverleningskosten.
            </p>
          </article>
          <article>
            <span>Indirect en gespreid</span>
            <h3>Obligatiefonds of ETF</h3>
            <p>
              Je koopt dan een fondsdeel, geen afzonderlijke staatslening. Bekijk
              samenstelling, looptijd, risico en fondskosten.
            </p>
          </article>
        </div>

        {preview ? (
          <aside className={styles.adGuard}>
            <span>Advertentiegrens in dit ontwerp</span>
            <p>
              Een eventuele advertentie komt pas ná het kernantwoord en de
              officiële bron. Nooit tussen een koopstap en de DSTA-link, zodat een
              advertentie niet als aanbevolen broker of overheidsdienst voelt.
            </p>
          </aside>
        ) : null}
      </section>

      <section
        className={`${styles.lookupSection} ${styles.shell}`}
        id="zoeken"
        aria-labelledby="lookup-title"
      >
        <header className={styles.sectionIntro}>
          <p className={styles.eyebrow}>02 — Zoekvoorbeeld, geen aanbeveling</p>
          <h2 id="lookup-title">Zo herken je één specifieke staatslening.</h2>
          <p>
            Onderstaand voorbeeld is een werkelijk uitgegeven lening. Het dient
            alleen om te laten zien welke gegevens je bij een aanbieder controleert;
            de getoonde uitgiftegegevens zijn geen actuele marktprijs.
          </p>
        </header>

        <div className={styles.bondLookup}>
          <div className={styles.bondIdentity}>
            <p>Nederlandse staatslening · officieel voorbeeld</p>
            <h3>DSL 2,50% · 15 januari 2031</h3>
            <dl>
              <div><dt>ISIN</dt><dd>NL0015073TQ2</dd></div>
              <div><dt>Coupon</dt><dd>2,50% per jaar</dd></div>
              <div><dt>Einddatum</dt><dd>15 januari 2031</dd></div>
              <div><dt>DSTA-publicatie</dt><dd>14 juli 2026</dd></div>
            </dl>
            <ExternalLink href={DSTA_BOND_EXAMPLE}>
              Controleer dit voorbeeld bij DSTA
            </ExternalLink>
          </div>

          <aside className={styles.startAmount}>
            <span>Kan ik met €1.000 beginnen?</span>
            <h3>In beginsel noemt DSTA elk gewenst bedrag in euro’s.</h3>
            <p>
              In de praktijk kan je aanbieder een minimale ordergrootte hanteren en
              kunnen beschikbaarheid, liquiditeit en kosten bepalen of €1.000
              uitvoerbaar of economisch zinvol is. Controleer dus de productdetails
              en het volledige afrekenbedrag vóór een order.
            </p>
          </aside>
        </div>

        <div className={styles.marketTerms}>
          <h3>Deze velden zie je vaak in een ordervenster</h3>
          <dl>
            <div><dt>ISIN</dt><dd>Unieke internationale code van precies deze lening.</dd></div>
            <div><dt>Nominale waarde</dt><dd>Bedrag waarover de coupon en aflossing worden berekend.</dd></div>
            <div><dt>Marktkoers</dt><dd>Prijs als percentage van de nominale waarde, meestal exclusief opgebouwde rente.</dd></div>
            <div><dt>Bied / laat</dt><dd>Hoogste koopbod en laagste verkoopprijs; het verschil is de spread.</dd></div>
            <div><dt>Opgebouwde rente</dt><dd>Couponrente sinds de vorige coupondatum die bij afrekening kan worden toegevoegd.</dd></div>
            <div><dt>Einddatum</dt><dd>Datum waarop volgens de voorwaarden de nominale waarde wordt afgelost.</dd></div>
            <div><dt>Rendement tot aflossing</dt><dd>Indicatief jaarrendement als je tot de einddatum aanhoudt en alle betalingen plaatsvinden.</dd></div>
            <div><dt>Afrekenbedrag</dt><dd>Het werkelijk te betalen bedrag inclusief opgebouwde rente en eventuele kosten.</dd></div>
          </dl>
        </div>
      </section>

      <BondExampleCalculator />

      <section
        className={`${styles.section} ${styles.shell}`}
        id="risicos"
        aria-labelledby="risks-title"
      >
        <header className={styles.sectionIntro}>
          <p className={styles.eyebrow}>03 — Risico, bescherming en kosten</p>
          <h2 id="risks-title">Staatsobligatie betekent niet risicoloos.</h2>
          <p>
            Nederland geldt als kredietwaardige uitgever, maar de marktwaarde en
            je werkelijke resultaat blijven afhankelijk van rente, looptijd,
            liquiditeit, kosten en inflatie.
          </p>
        </header>

        <div className={styles.riskGrid}>
          <article><span>Rente</span><h3>Koersrisico</h3><p>Als de marktrente stijgt, kan de prijs van een bestaande obligatie dalen.</p></article>
          <article><span>Koopkracht</span><h3>Inflatierisico</h3><p>Een vaste betaling kan na verloop van tijd minder goederen en diensten kopen.</p></article>
          <article><span>Handel</span><h3>Liquiditeitsrisico</h3><p>De gewenste lening is mogelijk niet direct of alleen tegen een ongunstige spread verhandelbaar.</p></article>
          <article><span>Nettoresultaat</span><h3>Kosten</h3><p>Transactie-, service-, fonds-, valuta- en bewaarkosten kunnen het rendement verlagen.</p></article>
          <article><span>Uitgever</span><h3>Kredietrisico</h3><p>Ook een overheid kan betalingsproblemen krijgen; een hoge kredietwaardigheid is geen garantie.</p></article>
          <article><span>Voor de einddatum</span><h3>Verkooprisico</h3><p>Wie eerder verkoopt, kan meer of minder ontvangen dan de aankoopwaarde.</p></article>
        </div>

        <aside className={styles.protectionNote}>
          <div>
            <span>Geen spaargarantie</span>
            <h3>Een obligatie valt niet onder de depositogarantie.</h3>
            <p>
              De Nederlandse depositogarantie beschermt banktegoeden, niet de
              marktwaarde van aandelen, obligaties of andere beleggingen.
            </p>
            <ExternalLink href={DNB_DEPOSIT_GUARANTEE}>Lees de uitleg van DNB</ExternalLink>
          </div>
          <div>
            <span>Andere bescherming</span>
            <h3>Vermogensscheiding en beleggerscompensatie zijn iets anders.</h3>
            <p>
              Als een beleggingsonderneming beleggingen niet kan teruggeven, kan
              onder voorwaarden compensatie gelden tot €20.000. Dit vergoedt geen
              koersverlies en is geen garantie op aflossing door de uitgever.
            </p>
            <ExternalLink href={DNB_INVESTOR_COMPENSATION}>
              Bekijk de voorwaarden bij DNB
            </ExternalLink>
          </div>
        </aside>

        <div className={styles.cautionGrid}>
          <aside className={styles.taxCard}>
            <span>Belasting is persoonlijk</span>
            <h3>Obligaties vallen in Nederland doorgaans onder box 3.</h3>
            <p>
              De behandeling hangt af van het belastingjaar en je persoonlijke
              situatie. EU Debt Map berekent geen belasting en geeft geen fiscaal
              advies. Controleer altijd de actuele uitleg van de Belastingdienst.
            </p>
            <ExternalLink href={TAX_2026}>Open de box 3-uitleg voor 2026</ExternalLink>
          </aside>

          <aside className={styles.scamCard}>
            <span>Fraudewaarschuwing</span>
            <h3>De Nederlandse Staat heeft geen breed retailprogramma.</h3>
            <p>
              DSTA waarschuwt voor valse berichten over een overheidsprogramma voor
              particuliere beleggers. Maak geen geld over via zo’n advertentie en
              controleer het webadres rechtstreeks bij de overheid.
            </p>
            <ExternalLink href={DSTA_BUYING}>Lees de waarschuwing bij DSTA</ExternalLink>
          </aside>
        </div>
      </section>

      <section className={styles.mechanics} id="werking" aria-labelledby="mechanics-title">
        <div className={styles.shell}>
          <header className={`${styles.sectionIntro} ${styles.sectionIntroLight}`}>
            <p className={styles.eyebrow}>04 — Verdieping</p>
            <h2 id="mechanics-title">Wat koop je precies?</h2>
            <p>
              De houder van een Nederlandse staatsobligatie is schuldeiser van de
              Staat. De Staat betaalt volgens de voorwaarden de coupon en lost de
              nominale waarde op de einddatum af.
            </p>
          </header>

          <div className={styles.flow} aria-label="Van financieringsbehoefte naar aflossing">
            <article><span>1</span><small>Financieringsbehoefte</small><strong>Nederland leent</strong></article>
            <i aria-hidden="true">→</i>
            <article><span>2</span><small>Uitgifte</small><strong>DSL of DTC</strong></article>
            <i aria-hidden="true">→</i>
            <article><span>3</span><small>Bezit</small><strong>Belegger is schuldeiser</strong></article>
            <i aria-hidden="true">→</i>
            <article><span>4</span><small>Einddatum</small><strong>Coupon en aflossing</strong></article>
          </div>

          <div className={styles.instrumentTypes}>
            <article>
              <span>DSL</span>
              <div>
                <h3>Dutch State Loan</h3>
                <p>
                  Gestandaardiseerde staatslening met een oorspronkelijke looptijd
                  van meer dan één jaar, een vaste einddatum en doorgaans een
                  jaarlijkse coupon.
                </p>
              </div>
            </article>
            <article>
              <span>DTC</span>
              <div>
                <h3>Dutch Treasury Certificate</h3>
                <p>
                  Kortlopend schatkistpapier tot één jaar. Een DTC heeft geen
                  tussentijdse coupon en wordt op de einddatum tegen de nominale
                  waarde afgelost.
                </p>
              </div>
            </article>
          </div>

          <aside className={styles.priceNote}>
            <strong>Koers 97% betekent niet dat je €97 ontvangt.</strong>
            <p>
              Bij €1.000 nominale waarde is de kale marktwaarde €970. Daar kunnen
              opgebouwde couponrente, spread, transactiekosten en bewaarkosten
              bijkomen. Vraag je aanbieder naar het volledige afrekenbedrag.
            </p>
          </aside>

          <div className={styles.checkLinks}>
            <ExternalLink href={DSTA_DSL}>Bekijk officiële DSL-voorwaarden</ExternalLink>
            <ExternalLink href={AFM_PROSPECTUS}>Lees de AFM-uitleg over prospectussen</ExternalLink>
          </div>
        </div>
      </section>

      <section className={styles.boundaries} aria-labelledby="boundaries-title">
        <div className={styles.shell}>
          <header className={`${styles.sectionIntro} ${styles.sectionIntroLight}`}>
            <p className={styles.eyebrow}>05 — Onze redactionele grens</p>
            <h2 id="boundaries-title">Uitleggen zonder een belegging aan te prijzen.</h2>
            <p>
              Zuiver feitelijke informatie is iets anders dan een koop- of
              verkoopaanbeveling. Daarom bevat deze gids geen ranglijsten,
              koersdoelen of gepersonaliseerde uitkomsten.
            </p>
          </header>

          <div className={styles.boundaryGrid}>
            <article>
              <span className={styles.boundaryYes}>Dit doet EU Debt Map wel</span>
              <ul>
                <li><CheckIcon />Begrippen in gewone taal uitleggen</li>
                <li><CheckIcon />Officiële routes en bronnen vermelden</li>
                <li><CheckIcon />Fictieve, controleerbare rekenvoorbeelden tonen</li>
                <li><CheckIcon />Risico’s, kosten en onzekerheid zichtbaar maken</li>
              </ul>
            </article>
            <article>
              <span className={styles.boundaryNo}>Dit doet EU Debt Map niet</span>
              <ul>
                <li><b aria-hidden="true">×</b>Zeggen welke obligatie je moet kopen</li>
                <li><b aria-hidden="true">×</b>Een “beste broker” aanbevelen</li>
                <li><b aria-hidden="true">×</b>Een persoonlijke portefeuille samenstellen</li>
                <li><b aria-hidden="true">×</b>Een rendement of toekomstige koers beloven</li>
              </ul>
            </article>
          </div>

          <p className={styles.publisherNote}>
            <strong>Uitgever:</strong> EU Debt Map · <strong>Redactionele status:</strong>{" "}
            conceptpilot · <strong>Broncontrole:</strong> 5 september 2026 · Deze
            pagina is algemene educatieve informatie en geen persoonlijk
            beleggings-, juridisch of fiscaal advies. Voor de redactionele grens is
            ook de <a href={ESMA_FACTS} target="_blank" rel="noreferrer">ESMA-uitleg over feitelijke informatie</a> geraadpleegd.
          </p>
        </div>
      </section>

      <section
        className={`${styles.section} ${styles.shell}`}
        id="bronnen"
        aria-labelledby="sources-title"
      >
        <header className={styles.sectionIntro}>
          <p className={styles.eyebrow}>06 — Controleer bij de bron</p>
          <h2 id="sources-title">Officiële informatie, geen verkooplinks.</h2>
          <p>
            De kernclaims komen van de Nederlandse overheid, DNB, AFM en de
            Belastingdienst. Geen van deze links is een affiliatelink.
          </p>
        </header>

        <div className={styles.sourceList}>
          <ExternalLink href={DSTA_BUYING} className={styles.sourceCard}>
            <span>01 · Nederlandse overheid</span><strong>DSTA — staatslening kopen</strong><small>Kooproute, bedrag, koers, coupon, rente en fraudewaarschuwing</small>
          </ExternalLink>
          <ExternalLink href={DSTA_BOND_EXAMPLE} className={styles.sourceCard}>
            <span>02 · Nederlandse overheid</span><strong>DSTA — DSL 2,50% 15 januari 2031</strong><small>Officiële lening, einddatum en ISIN van het zoekvoorbeeld</small>
          </ExternalLink>
          <ExternalLink href={DSTA_CAPITAL_MARKETS} className={styles.sourceCard}>
            <span>03 · Nederlandse overheid</span><strong>DSTA — kapitaalmarkt en Dutch State Loans</strong><small>Rol van de obligatiehouder, coupon en aflossing</small>
          </ExternalLink>
          <ExternalLink href={DSTA_DSL} className={styles.sourceCard}>
            <span>04 · Nederlandse overheid</span><strong>DSTA — leningsvoorwaarden voor DSL’s</strong><small>Officiële documenten per uitstaande staatslening</small>
          </ExternalLink>
          <ExternalLink href={DNB_DEPOSIT_GUARANTEE} className={styles.sourceCard}>
            <span>05 · Centrale bank</span><strong>DNB — Nederlandse depositogarantie</strong><small>Waarom beleggingen niet onder de spaargarantie vallen</small>
          </ExternalLink>
          <ExternalLink href={DNB_INVESTOR_COMPENSATION} className={styles.sourceCard}>
            <span>06 · Centrale bank</span><strong>DNB — beleggerscompensatie</strong><small>Voorwaarden, vermogensscheiding en grens van €20.000</small>
          </ExternalLink>
          <ExternalLink href={AFM_COSTS} className={styles.sourceCard}>
            <span>07 · Toezichthouder</span><strong>AFM — kosten van beleggen</strong><small>Transactie-, service-, fonds- en bewaarkosten</small>
          </ExternalLink>
          <ExternalLink href={TAX_2026} className={styles.sourceCard}>
            <span>08 · Belastingdienst</span><strong>Box 3 in 2026</strong><small>Actuele indeling van obligaties als beleggingen en andere bezittingen</small>
          </ExternalLink>
        </div>
        <p className={styles.sourceReview}>
          Alle bovenstaande bronnen zijn geraadpleegd op 5 september 2026.
        </p>
      </section>

      <section className={styles.debtConnection} aria-labelledby="debt-connection-title">
        <div className={`${styles.shell} ${styles.debtConnectionGrid}`}>
          <div>
            <p className={styles.eyebrow}>Van obligatie terug naar staatsschuld</p>
            <h2 id="debt-connection-title">Bekijk de schuld die Nederland financiert.</h2>
            <p>
              Staatsobligaties zijn één van de instrumenten achter de totale
              staatsschuld. Bekijk het officiële schuldniveau, de gemodelleerde
              live teller en de positie van Nederland binnen de EU.
            </p>
            <Link className={styles.debtLink} href="/nl/country/nl">
              Open staatsschuld Nederland <ArrowIcon />
            </Link>
          </div>
          <dl>
            <div><dt>Officiële schuldquote</dt><dd>{ratioText}</dd></div>
            <div><dt>Referentieperiode</dt><dd>{period}</dd></div>
            <div><dt>Databron schuldquote</dt><dd>Eurostat</dd></div>
          </dl>
        </div>
      </section>

      {preview ? (
        <section className={`${styles.roadmap} ${styles.shell}`} aria-labelledby="roadmap-title">
          <div>
            <p className={styles.eyebrow}>Previewnotitie · groeiplan</p>
            <h2 id="roadmap-title">Eerst bewijzen dat deze pilot werkt.</h2>
          </div>
          <ol>
            <li><span>Nu</span><strong>Nederlandse gids inhoudelijk en visueel beoordelen</strong></li>
            <li><span>Na akkoord</span><strong>Publiceren en koppelen vanaf de landpagina</strong></li>
            <li><span>8–12 weken</span><strong>Zoekvragen en gebruik in Search Console volgen</strong></li>
            <li><span>Daarna</span><strong>Duitsland, Frankrijk, België en Italië afzonderlijk onderzoeken</strong></li>
          </ol>
        </section>
      ) : null}
    </article>
  );
}
