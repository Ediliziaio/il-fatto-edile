# Mappa di differenziazione — rete editoriale edilizia (Domus Group)

> **Documento di riferimento unico.** Prima di riposizionare uno di questi siti,
> leggere questa mappa e aggiornarla nello stesso commit. Senza un riferimento
> condiviso, sessioni parallele riassegnano gli stessi territori e ricreano la
> sovrapposizione che la differenziazione deve eliminare — è già successo.

Ultimo aggiornamento: 2026-09-01 (asset ilfattoedile)

## Perché esiste

Otto siti dello stesso editore trattavano gli stessi temi presentandosi allo
stesso modo (*"News, bonus e guide per l'edilizia italiana"* su quasi tutti).
Google indicizza ciò che aggiunge valore al suo indice: il settimo sito che
ripete gli stessi contenuti non ne aggiunge, quindi viene scansionato e non
indicizzato. La differenziazione serve a dare a ciascun dominio una ragione
d'esistere autonoma.

**Regola:** un territorio, un sito. L'assegnazione si fonda sul contenuto che il
sito **ha già**, non su un'idea a tavolino.

## Assegnazione

| Sito | Territorio esclusivo | Fondamento nel contenuto | Asset distintivo |
|---|---|---|---|
| **rassegnaedile.it** | Prezzi e costi | 28/35 articoli con prezzi, 522 importi, 43 tabelle | `/prezzi/` — Osservatorio, 79 voci, schema `Dataset` |
| **ilcardine.it** | Efficienza energetica e impianti | 11/39 articoli nel cluster (quota maggiore) | guide su involucro, FV, pompe di calore, VMC |
| **mediaedile.it** | Classifiche produttori e marchi | 20/30 articoli sono classifiche (67%) | `/produttori` — Indice, 144 marchi, `ItemList` |
| **edilizia24ore.it** | News e attualità di settore | 14/44 news, unico con categoria dedicata | cronaca quotidiana del settore |
| **ilfattoedile.it** | Cantiere e pratica professionale | 22 classifiche su pratiche, non su prodotti | `/checklist` — Indice, 159 controlli, `CollectionPage`+`ItemList` |
| **corrieredile.it** | B2B imprese e professionisti | titoli rivolti a "imprese, artigiani, professionisti" | normativa e mercato per chi lavora |
| **ilgiornaleedile.it** | Comparatori / guide alla scelta | 7 comparatori interattivi già online | `/comparatore/` — strumenti di confronto |
| **infissimedia.it** | Serramenti e infissi | verticale monotematico | l'unico già verticalizzato |

## Territori liberi

Non ancora presidiati, assegnabili a un sito che ne abbia i contenuti:

- **Incentivi, bonus e fisco** — spazio ad alto volume, oggi nessuno lo tiene
  in esclusiva
- **Materiali e prodotti da costruzione**
- **Sostenibilità e costruzione green**

## Distinzioni delicate da presidiare

Alcuni confini sono sottili e vanno tenuti espliciti nei testi, altrimenti
ricollassano:

- **mediaedile vs ilgiornaleedile** — la *classifica* esprime una graduatoria
  redazionale ("i 5 migliori produttori"); il *comparatore* affianca specifiche
  e criteri e lascia scegliere il lettore. Se ilgiornaleedile inizia a
  pubblicare classifiche, la distinzione sparisce.
- **edilizia24ore vs corrieredile vs ilfattoedile** — attualità generalista
  (24ore), informazione rivolta alle imprese (corriere), pratica operativa di
  cantiere (ilfatto). Il rischio è che tutti e tre scivolino su "news di
  settore".
- **rassegnaedile vs tutti** — i prezzi sono trasversali: gli altri siti possono
  citare costi dentro le loro guide, ma l'**indice aggregato dei prezzi** resta
  di rassegnaedile.

## Cosa serve a ciascun sito, oltre al posizionamento

Il titolo differenziato è necessario ma non sufficiente. Ogni sito dovrebbe
avere **un asset che gli altri non possono replicare** — è ciò che dà a Google
una ragione concreta per indicizzarlo:

- fatto: rassegnaedile (Osservatorio prezzi, 79 voci), mediaedile (Indice
  produttori, 144 marchi), ilgiornaleedile (7 comparatori), ilfattoedile
  (Indice checklist, 159 controlli)
- da fare: ilcardine, edilizia24ore, corrieredile

## Avvertenza operativa

Più sessioni hanno lavorato in parallelo su questi repository sovrascrivendosi:
in un caso lo stesso sito dichiarava due identità diverse in file diversi
(`index.html` contro il titolo renderizzato). Prima di modificare, verificare
sempre `git log` e lo stato del working tree.

## Deviazioni corrette

- **2026-09-01 — ilfattoedile.it**: una sessione parallela lo aveva riposizionato
  su *"Imprese, professioni e politiche delle costruzioni"* (title, `SITE`,
  `llms.txt`), invadendo il territorio B2B di corrieredile.it — esattamente la
  collisione che questa mappa avverte di evitare. Riportato al territorio
  assegnato («Cantiere e pratica professionale») in title, meta, `llms.txt`,
  chi-siamo e intro di rubrica, e dotato dell'asset che gli mancava.
