import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { SITE } from '@/data/articles';
import { AUTHORS } from '@/data/authors';
import { useSeo } from '@/lib/seo';

function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 pt-10">
      <header className="border-b-2 border-neutral-950 pb-4">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.25em] text-red-700">Informazioni legali</p>
        <h1 className="mt-1 font-serif text-4xl font-black text-neutral-950">{title}</h1>
        <p className="mt-2 font-sans text-xs text-neutral-500">Ultimo aggiornamento: {updated}</p>
      </header>
      <div className="legal-body pb-4">{children}</div>
    </main>
  );
}

const H2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mt-10 font-serif text-2xl font-black text-neutral-950">{children}</h2>
);
const H3 = ({ children }: { children: ReactNode }) => (
  <h3 className="mt-6 font-serif text-lg font-bold text-neutral-900">{children}</h3>
);
const P = ({ children }: { children: ReactNode }) => (
  <p className="mt-4 font-body text-[17px] leading-[1.75] text-neutral-800">{children}</p>
);
const UL = ({ items }: { items: string[] }) => (
  <ul className="mt-4 list-disc space-y-2 pl-6 font-body text-[16px] leading-relaxed text-neutral-800">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

export function PrivacyPage() {
  useSeo({
    title: `Privacy Policy | ${SITE.name}`,
    description:
      'Informativa sul trattamento dei dati personali ai sensi del Regolamento (UE) 2016/679 (GDPR) del sito Il Fatto Edile: titolare, finalità, basi giuridiche, diritti degli interessati.',
    canonical: `${SITE.domain}/privacy`,
  });

  return (
    <LegalLayout title="Privacy Policy" updated="21 luglio 2026">
      <P>
        La presente informativa descrive le modalità di trattamento dei dati personali degli utenti che consultano il
        sito {SITE.name} (di seguito, il «Sito»), ai sensi dell’art. 13 del Regolamento (UE) 2016/679 («GDPR») e
        della normativa nazionale vigente in materia di protezione dei dati personali.
      </P>

      <H2>1. Titolare del trattamento</H2>
      <P>
        Titolare del trattamento è {SITE.name} (di seguito, il «Titolare»). Per qualsiasi richiesta relativa alla
        privacy è possibile scrivere all’indirizzo email privacy@ilfattoedile.it. I riferimenti completi del
        Titolare saranno indicati in questa sezione a seguito della registrazione della testata giornalistica.
      </P>

      <H2>2. Tipologie di dati raccolti</H2>
      <H3>Dati di navigazione</H3>
      <P>
        I sistemi informatici e le procedure software preposte al funzionamento del Sito acquisiscono, nel normale
        esercizio, alcuni dati la cui trasmissione è implicita nell’uso dei protocolli di comunicazione Internet:
        indirizzi IP, tipo di browser, sistema operativo, orari delle richieste e parametri relativi al dispositivo.
        Questi dati vengono utilizzati al solo fine di ricavare informazioni statistiche anonime sull’uso del
        Sito e per controllarne il corretto funzionamento.
      </P>
      <H3>Dati forniti volontariamente</H3>
      <P>
        L’iscrizione alla newsletter e l’invio di richieste tramite i recapiti pubblicati comportano la
        raccolta dell’indirizzo email e degli eventuali dati inseriti volontariamente nel messaggio (nome,
        cognome, ragione sociale).
      </P>
      <H3>Cookie</H3>
      <P>
        Per il dettaglio sui cookie utilizzati dal Sito, sulle finalità e sulle modalità di gestione del consenso si
        rimanda alla Cookie Policy.
      </P>

      <H2>3. Finalità e basi giuridiche del trattamento</H2>
      <UL
        items={[
          'Erogazione dei contenuti editoriali e funzionamento tecnico del Sito — legittimo interesse del Titolare (art. 6, par. 1, lett. f GDPR).',
          'Invio della newsletter richiesta — esecuzione di misure precontrattuali e contrattuali (art. 6, par. 1, lett. b GDPR).',
          'Risposta alle richieste inviate ai recapiti di contatto — legittimo interesse e misure precontrattuali.',
          'Analisi statistiche aggregate sull’utilizzo del Sito — consenso dell’interessato, ove raccolto tramite il cookie banner (art. 6, par. 1, lett. a GDPR).',
          'Pubblicità personalizzata e profilazione — esclusivamente previo consenso espresso tramite il cookie banner.',
          'Adempimento di obblighi di legge, regolamenti o normativa comunitaria (art. 6, par. 1, lett. c GDPR).',
        ]}
      />

      <H2>4. Modalità del trattamento e conservazione</H2>
      <P>
        Il trattamento è effettuato con strumenti informatici e telematici, con logiche strettamente correlate alle
        finalità indicate e con misure di sicurezza idonee a garantire riservatezza e integrità dei dati. I dati della
        newsletter sono conservati fino a richiesta di cancellazione; i dati di contatto per il tempo necessario a
        gestire la richiesta; i log di navigazione secondo i tempi tecnici del fornitore di hosting.
      </P>

      <H2>5. Comunicazione e diffusione dei dati</H2>
      <P>
        I dati non sono diffusi. Possono venire a conoscenza dei dati soggetti autorizzati dal Titolare e fornitori di
        servizi tecnici (hosting, manutenzione, invio newsletter) nominati, ove ricorra, responsabili del trattamento
        ai sensi dell’art. 28 GDPR. L’elenco aggiornato dei responsabili è disponibile su richiesta.
      </P>

      <H2>6. Diritti degli interessati</H2>
      <P>In qualità di interessato, l’utente può esercitare in qualsiasi momento i diritti previsti dagli artt. 15-22 GDPR:</P>
      <UL
        items={[
          'Accesso ai dati personali e alle informazioni sul trattamento.',
          'Rettifica dei dati inesatti e integrazione di quelli incompleti.',
          'Cancellazione dei dati («diritto all’oblio»), nei casi previsti.',
          'Limitazione e opposizione al trattamento.',
          'Portabilità dei dati, per i trattamenti basati su consenso o contratto.',
          'Revoca del consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente.',
        ]}
      />
      <P>
        Le richieste possono essere inviate a privacy@ilfattoedile.it. Resta fermo il diritto di proporre reclamo
        all’autorità di controllo competente (Garante per la protezione dei dati personali — www.garanteprivacy.it).
      </P>

      <H2>7. Modifiche alla presente informativa</H2>
      <P>
        Il Titolare può aggiornare la presente informativa per adeguarla a modifiche normative o dei servizi offerti.
        La versione vigente è quella pubblicata su questa pagina con l’indicazione della data di ultimo
        aggiornamento.
      </P>
    </LegalLayout>
  );
}

export function CookiePolicyPage() {
  useSeo({
    title: `Cookie Policy | ${SITE.name}`,
    description:
      'Cookie policy del sito Il Fatto Edile: cosa sono i cookie, quali utilizziamo (tecnici, analitici, marketing), come gestire o revocare il consenso.',
    canonical: `${SITE.domain}/cookie-policy`,
  });

  const reopenBanner = () => {
    localStorage.removeItem('ife-cookie-consent-v1');
    window.dispatchEvent(new Event('ife-open-cookie-banner'));
  };

  return (
    <LegalLayout title="Cookie Policy" updated="21 luglio 2026">
      <P>
        La presente Cookie Policy descrive l’utilizzo dei cookie e degli strumenti di tracciamento sul sito{' '}
        {SITE.name}, in conformità al GDPR, al Codice Privacy (D.Lgs. 196/2003 come novellato) e alle Linee guida del
        Garante per la protezione dei dati personali in materia di cookie.
      </P>

      <H2>1. Cosa sono i cookie</H2>
      <P>
        I cookie sono piccoli file di testo che i siti visitati inviano al dispositivo dell’utente, dove vengono
        memorizzati per essere ritrasmessi agli stessi siti alla visita successiva. Consentono il funzionamento
        tecnico del sito, la raccolta di statistiche e — previo consenso — la personalizzazione dei contenuti e della
        pubblicità.
      </P>

      <H2>2. Cookie utilizzati da questo sito</H2>
      <H3>a) Cookie tecnici (necessari)</H3>
      <P>
        Indispensabili per il funzionamento del Sito e per la memorizzazione delle preferenze espresse sul consenso.
        Non richiedono il consenso dell’utente.
      </P>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse font-sans text-sm">
          <thead>
            <tr>
              <th className="border border-neutral-300 bg-neutral-950 px-3 py-2 text-left text-white">Nome</th>
              <th className="border border-neutral-300 bg-neutral-950 px-3 py-2 text-left text-white">Finalità</th>
              <th className="border border-neutral-300 bg-neutral-950 px-3 py-2 text-left text-white">Durata</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-neutral-300 px-3 py-2">ife-cookie-consent-v1</td>
              <td className="border border-neutral-300 px-3 py-2">Memorizza le scelte espresse nel cookie banner</td>
              <td className="border border-neutral-300 px-3 py-2">12 mesi</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H3>b) Cookie di analisi (previo consenso)</H3>
      <P>
        Utilizzati per raccogliere informazioni statistiche, in forma aggregata e anonimizzata, sul numero di utenti e
        sulle pagine visitate. Vengono installati solo se l’utente presta il consenso tramite il banner o le
        preferenze.
      </P>

      <H3>c) Cookie di marketing e profilazione (previo consenso)</H3>
      <P>
        Utilizzati per mostrare annunci pubblicitari pertinenti negli spazi dedicati del Sito e per misurare
        l’efficacia delle campagne, anche da parte di partner terzi. Vengono installati esclusivamente previo
        consenso espresso.
      </P>

      <H2>3. Gestione del consenso</H2>
      <P>
        Al primo accesso viene mostrato un banner che consente di accettare tutti i cookie, rifiutare quelli non
        necessari o personalizzare le preferenze per categoria. La scelta viene conservata per 12 mesi e può essere
        modificata in qualsiasi momento.
      </P>
      <p className="mt-6">
        <button
          onClick={reopenBanner}
          className="bg-red-700 px-5 py-2.5 font-sans text-xs font-bold uppercase tracking-wider text-white hover:bg-red-600"
        >
          Modifica le preferenze cookie
        </button>
      </p>
      <P>
        È inoltre possibile gestire o eliminare i cookie direttamente dalle impostazioni del proprio browser. La
        disattivazione dei cookie tecnici può compromettere il funzionamento del Sito.
      </P>

      <H2>4. Titolare e contatti</H2>
      <P>
        Per qualsiasi informazione relativa all’uso dei cookie è possibile scrivere a privacy@ilfattoedile.it. Per
        le informazioni complete sul trattamento dei dati personali si rimanda alla Privacy Policy.
      </P>
    </LegalLayout>
  );
}

export function ChiSiamoPage() {
  useSeo({
    title: `Chi siamo | ${SITE.name}`,
    description:
      'Il Fatto Edile è il quotidiano digitale dedicato all’edilizia italiana: la redazione, la missione editoriale e i valori della testata.',
    canonical: `${SITE.domain}/chi-siamo`,
  });

  return (
    <LegalLayout title="Chi siamo" updated="21 luglio 2026">
      <P>
        <strong>{SITE.name}</strong> è un quotidiano digitale indipendente dedicato al mondo delle costruzioni:
        notizie, guide, classifiche e approfondimenti per imprese edili, artigiani, tecnici, progettisti e privati che
        costruiscono, ristrutturano e riqualificano il patrimonio edilizio italiano.
      </P>

      <H2>La missione editoriale</H2>
      <P>
        L’edilizia è uno dei motori dell’economia italiana, ma chi ci lavora ogni giorno fatica a trovare
        informazione chiara, verificabile e scritta da chi conosce davvero il cantiere. Il Fatto Edile nasce per
        questo: tradurre norme, dati di mercato e innovazione tecnica in contenuti utili, con un taglio pratico e un
        linguaggio diretto.
      </P>

      <H2>Cosa pubblichiamo</H2>
      <UL
        items={[
          'News: le notizie essenziali su normativa, mercato, cantieri e innovazione, con i fatti spiegati subito.',
          'Guide Top 5: selezioni ragionate sulle cinque cose da sapere su bonus, materiali, strumenti e tendenze.',
          'Classifiche Top 10: le dieci risposte alle domande più cercate da professionisti e privati.',
          'Approfondimenti per categoria: Normativa & Bonus, Mercato & Economia, Innovazione & Digitale, Materiali & Prodotti, Sostenibilità, Progetti & Cantieri, Sicurezza, Eventi & Fiere.',
        ]}
      />

      <H2>Il metodo</H2>
      <P>
        Ogni contenuto è verificato prima della pubblicazione, riporta data di pubblicazione e di aggiornamento, ed è
        firmato dalla redazione. Le guide vengono riviste periodicamente per mantenerle allineate all’evoluzione
        normativa e di mercato. Le eventuali collaborazioni commerciali e i contenuti sponsorizzati sono sempre
        contrassegnati in modo riconoscibile.
      </P>

      <H2>La redazione</H2>
      <P>
        La redazione è composta da firme con aree di competenza stabili: ciascuna presidia un ambito specifico del
        comparto costruzioni e risponde dei contenuti che firma. Da ogni scheda si accede alla biografia, al contatto
        diretto e all’archivio completo degli articoli. Per la redazione centrale: redazione@ilfattoedile.it.
      </P>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {AUTHORS.map((a) => (
          <li key={a.slug} className="border border-neutral-200 bg-neutral-50 p-4">
            <Link
              to={`/autore/${a.slug}`}
              className="font-serif text-lg font-bold text-neutral-950 hover:text-red-700 hover:underline"
            >
              {a.name}
            </Link>
            <p className="mt-0.5 font-sans text-xs font-bold uppercase tracking-[0.15em] text-red-700">{a.role}</p>
            <p className="mt-1.5 font-sans text-sm leading-relaxed text-neutral-600">{a.beat}</p>
          </li>
        ))}
      </ul>
    </LegalLayout>
  );
}

export function ContattiPage() {
  useSeo({
    title: `Contatti e pubblicità | ${SITE.name}`,
    description:
      'Contatti de Il Fatto Edile: redazione, segnalazioni, ufficio commerciale e informazioni per le inserzioni pubblicitarie sul sito.',
    canonical: `${SITE.domain}/contatti`,
  });

  return (
    <LegalLayout title="Contatti e pubblicità" updated="21 luglio 2026">
      <P>
        Per entrare in contatto con {SITE.name} puoi usare i recapiti qui sotto, scegliendo il canale più adatto alla
        tua richiesta.
      </P>

      <H2>Redazione</H2>
      <P>
        Per segnalazioni, comunicati stampa, correzioni e proposte di approfondimento:{' '}
        <strong>redazione@ilfattoedile.it</strong>. Leggiamo tutto: le segnalazioni dai cantieri e dalle imprese sono
        il cuore della nostra informazione.
      </P>

      <H2>Pubblicità e partnership</H2>
      <P>
        Il Sito dispone di spazi pubblicitari in diversi formati (leaderboard, half page, rectangle, in-article) in
        home page, nelle pagine di categoria e all’interno degli articoli. Per disponibilità, listini e progetti
        speciali — native advertising, contenuti sponsorizzati, DEM alla nostra community — scrivi a{' '}
        <strong>pubblicita@ilfattoedile.it</strong>.
      </P>

      <H2>Newsletter</H2>
      <P>
        Per problemi con l’iscrizione o la cancellazione dalla newsletter:{' '}
        <strong>newsletter@ilfattoedile.it</strong>. In ogni email è comunque presente il link di disiscrizione.
      </P>

      <H2>Privacy</H2>
      <P>
        Per l’esercizio dei diritti previsti dal GDPR (accesso, rettifica, cancellazione, opposizione):{' '}
        <strong>privacy@ilfattoedile.it</strong>. Dettagli nella Privacy Policy e nella Cookie Policy.
      </P>
    </LegalLayout>
  );
}
