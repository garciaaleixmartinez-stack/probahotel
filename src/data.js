/* ============================================================
   PAUta · Dades
   Dades PAU 2027 verificades l'11/11/2026.
   Estructura de la prova: Reial Decret 534/2024 (comú a tot l'Estat).
   Temari: blocs orientatius basats en el currículum de 2n de batxillerat
   (Reial Decret 243/2022). Cada comissió publica les seves orientacions.
   ============================================================ */

const VERIFIED_AT = '11/11/2026';
const DEFAULT_EXAM = '2027-06-01';

const PENDING = 'Pendent de publicar';

const REGIONS = [
  { id: 'and', name: 'Andalusia', ord: '1, 2 i 3 de juny', ext: '29 i 30 de juny i 1 de juliol', first: '2027-06-01', status: 'oficial', coLang: null, organ: 'Distrito Único Andaluz', note: 'Matemàtiques II i Matemàtiques Aplicades a les CCSS II no poden ponderar totes dues a 0,2 alhora: només compta la millor de les dues.', rule: 'and-math', unis: ['US', 'UGR', 'UMA', 'UCO', 'UCA', 'UHU', 'UJA', 'UAL', 'UPO'] },
  { id: 'ara', name: 'Aragó', ord: '1, 2 i 3 de juny', ext: '29 i 30 de juny i 1 de juliol', first: '2027-06-01', status: 'oficial', coLang: null, organ: 'Universidad de Zaragoza', note: '', unis: ['Unizar'] },
  { id: 'ast', name: 'Astúries', ord: '1, 2 i 3 de juny', ext: '5, 6 i 7 de juliol', first: '2027-06-01', status: 'oficial', coLang: null, organ: 'Universidad de Oviedo', note: '', unis: ['Uniovi'] },
  { id: 'bal', name: 'Illes Balears', ord: '1, 2 i 3 de juny', ext: '29 i 30 de juny i 1 de juliol', first: '2027-06-01', status: 'provisional', coLang: 'cat', organ: 'Universitat de les Illes Balears', note: 'Dates publicades per la UIB en una pàgina encara marcada com a provisional.', unis: ['UIB'] },
  { id: 'can', name: 'Canàries', ord: '1, 2, 3 i 4 de juny', ext: PENDING, first: '2027-06-01', status: 'parcial', coLang: null, organ: 'Gobierno de Canarias', note: 'L’extraordinària encara no té dates confirmades a la web oficial.', unis: ['ULL', 'ULPGC'] },
  { id: 'cnt', name: 'Cantàbria', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: null, organ: 'Universidad de Cantabria', note: '', unis: ['UC'] },
  { id: 'clm', name: 'Castella-la Manxa', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: null, organ: 'Universidad de Castilla-La Mancha', note: 'Els models d’examen de 2027 ja són publicats.', unis: ['UCLM'] },
  { id: 'cyl', name: 'Castella i Lleó', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: null, organ: 'Universitats públiques de Castella i Lleó', note: '', unis: ['USAL', 'UVa', 'ULE', 'UBU'] },
  { id: 'cat', name: 'Catalunya', ord: '1, 2 i 3 de juny', ext: '6, 7 i 8 de juliol', first: '2027-06-01', status: 'oficial', coLang: 'cat', organ: 'Oficina d’Accés a la Universitat', note: 'Primer any amb l’extraordinària al juliol (fins ara era al setembre).', unis: ['UB', 'UAB', 'UPC', 'UPF', 'UdG', 'UdL', 'URV'] },
  { id: 'val', name: 'Comunitat Valenciana', ord: '1, 2 i 3 de juny', ext: '30 de juny i 1 i 2 de juliol', first: '2027-06-01', status: 'oficial', coLang: 'val', organ: 'Comissió Gestora de la PAU (GVA)', note: '', unis: ['UV', 'UPV', 'UA', 'UJI', 'UMH'] },
  { id: 'ext', name: 'Extremadura', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: null, organ: 'Universidad de Extremadura', note: '', unis: ['UEx'] },
  { id: 'gal', name: 'Galícia', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: 'gal', organ: 'CiUG', note: 'Els models d’examen de 2027 ja són publicats.', unis: ['USC', 'UDC', 'UVigo'] },
  { id: 'mad', name: 'Comunitat de Madrid', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: null, organ: 'Universitats públiques de Madrid', note: 'Els models d’examen de 2027 ja són publicats.', unis: ['UCM', 'UAM', 'UC3M', 'UPM', 'URJC', 'UAH'] },
  { id: 'mur', name: 'Regió de Múrcia', ord: '1, 2 i 3 de juny', ext: '29 i 30 de juny i 1 de juliol', first: '2027-06-01', status: 'oficial', coLang: null, organ: 'UM i UPCT', note: '', unis: ['UM', 'UPCT'] },
  { id: 'nav', name: 'Navarra', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: 'eus', coOptional: true, organ: 'Universidad Pública de Navarra', note: 'L’examen de basc només s’hi afegeix si l’has cursat al batxillerat.', unis: ['UPNA'] },
  { id: 'pv', name: 'País Basc', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: 'eus', organ: 'UPV/EHU', note: '', unis: ['UPV/EHU'] },
  { id: 'rio', name: 'La Rioja', ord: PENDING, ext: PENDING, first: null, status: 'pendent', coLang: null, organ: 'Universidad de La Rioja', note: '', unis: ['UR'] },
  { id: 'ceu', name: 'Ceuta', ord: '1, 2 i 3 de juny', ext: '29 i 30 de juny i 1 de juliol', first: '2027-06-01', status: 'provisional', coLang: null, organ: 'Universidad de Granada', note: 'Segueix el calendari andalús (Universitat de Granada).', rule: 'and-math', unis: ['UGR'] },
  { id: 'mel', name: 'Melilla', ord: '1, 2 i 3 de juny', ext: '29 i 30 de juny i 1 de juliol', first: '2027-06-01', status: 'provisional', coLang: null, organ: 'Universidad de Granada', note: 'Segueix el calendari andalús (Universitat de Granada).', rule: 'and-math', unis: ['UGR'] }
];

const STATUS = {
  oficial: { label: 'Oficial', cls: 'ok' },
  provisional: { label: 'Provisional', cls: 'warn' },
  parcial: { label: 'Parcialment oficial', cls: 'warn' },
  pendent: { label: 'Pendent de publicar', cls: 'muted' }
};

/* ---------- Matèries i blocs de temari ---------- */
const SUBJECTS = {
  cas: { name: 'Llengua Castellana i Literatura II', short: 'Castellà', color: '#BE185D', topics: ['Comprensió i resum de textos', 'Text argumentatiu i comentari crític', 'Sintaxi: oració composta', 'Morfologia, lèxic i semàntica', 'Literatura espanyola del s. XX (fins al 1939)', 'Literatura espanyola des del 1939', 'Normativa i ortografia'] },
  cat: { name: 'Llengua Catalana i Literatura II', short: 'Català', color: '#0066CC', topics: ['Comprensió i resum de textos', 'Producció de textos argumentatius', 'Sintaxi: oració composta', 'Pronoms febles', 'Lèxic, semàntica i normativa', 'Literatura catalana del s. XX', 'Literatura catalana actual i lectures prescriptives'] },
  val: { name: 'Valencià: Llengua i Literatura II', short: 'Valencià', color: '#0066CC', topics: ['Comprensió i resum de textos', 'Producció de textos argumentatius', 'Sintaxi: oració composta', 'Pronoms febles', 'Lèxic, semàntica i normativa', 'Literatura del s. XX', 'Literatura actual i lectures prescriptives'] },
  gal: { name: 'Lingua Galega e Literatura II', short: 'Gallec', color: '#0066CC', topics: ['Comprensió i resum de textos', 'Producció de textos argumentatius', 'Sintaxi i morfologia', 'Lèxic i normativa', 'Sociolingüística', 'Literatura gallega del s. XX', 'Literatura gallega actual'] },
  eus: { name: 'Euskara eta Literatura II', short: 'Basc', color: '#0066CC', topics: ['Comprensió i resum de textos', 'Producció de textos argumentatius', 'Gramàtica i sintaxi', 'Lèxic i normativa', 'Literatura basca del s. XX', 'Literatura basca actual'] },
  eng: { name: 'Llengua Estrangera II: Anglès', short: 'Anglès', color: '#7C3AED', topics: ['Reading comprehension', 'Grammar: tenses and conditionals', 'Grammar: passive and reported speech', 'Vocabulary and phrasal verbs', 'Writing: opinion essay', 'Writing: other text types'] },
  his: { name: 'Història d’Espanya', short: 'Història', color: '#C2410C', topics: ['Arrels històriques fins al s. XVIII', 'Crisi de l’Antic Règim i liberalisme (1808–1874)', 'La Restauració (1874–1931)', 'Segona República i Guerra Civil (1931–1939)', 'El franquisme (1939–1975)', 'Transició i democràcia (1975–actualitat)'] },
  fil: { name: 'Història de la Filosofia', short: 'Filosofia', color: '#B45309', topics: ['Filosofia antiga: Plató i Aristòtil', 'Filosofia medieval: Agustí i Tomàs d’Aquino', 'Racionalisme i empirisme: Descartes i Hume', 'Il·lustració: Kant', 'S. XIX: Marx i Nietzsche', 'Filosofia del s. XX'] },
  mat: { name: 'Matemàtiques II', short: 'Matemàtiques', color: '#1E7B34', topics: ['Matrius i determinants', 'Sistemes d’equacions lineals', 'Geometria a l’espai', 'Límits i continuïtat', 'Derivades i aplicacions', 'Integrals', 'Probabilitat'] },
  macs: { name: 'Matemàtiques Aplicades a les CCSS II', short: 'Mates CCSS', color: '#15803D', topics: ['Matrius i sistemes', 'Programació lineal', 'Funcions, límits i derivades', 'Integrals i àrees', 'Probabilitat', 'Distribucions binomial i normal'] },
  lat: { name: 'Llatí II', short: 'Llatí', color: '#9F1239', topics: ['Morfologia nominal', 'Morfologia verbal', 'Sintaxi de l’oració', 'Traducció de textos', 'Lèxic i evolució', 'Literatura llatina'] },
  cg: { name: 'Ciències Generals', short: 'Ciències Gen.', color: '#0E7490', topics: ['Metodologia científica', 'La Terra i els seus sistemes', 'Matèria i reaccions químiques', 'Moviment, forces i energia', 'Biologia, salut i biotecnologia', 'Sostenibilitat i medi ambient'] },
  dart: { name: 'Dibuix Artístic II', short: 'Dibuix Art.', color: '#A21CAF', topics: ['Forma i estructura', 'Llum, clarobscur i volum', 'El color', 'Perspectiva intuïtiva', 'Figura humana', 'Projecte gràfic'] },
  amus: { name: 'Anàlisi Musical II', short: 'Anàlisi Mus.', color: '#A21CAF', topics: ['Elements del llenguatge musical', 'Forma musical', 'Música medieval i renaixentista', 'Barroc i Classicisme', 'Romanticisme', 'Música dels s. XX i XXI'] },
  aesc: { name: 'Arts Escèniques II', short: 'Arts Esc.', color: '#A21CAF', topics: ['Història de les arts escèniques', 'Teoria i anàlisi de l’espectacle', 'Interpretació', 'Dramatúrgia', 'Escenografia i posada en escena', 'Arts escèniques contemporànies'] },
  bio: { name: 'Biologia', short: 'Biologia', color: '#16A34A', topics: ['Biomolècules', 'La cèl·lula', 'Metabolisme', 'Genètica molecular', 'Genètica mendeliana i evolució', 'Microbiologia i biotecnologia', 'Immunologia'] },
  qui: { name: 'Química', short: 'Química', color: '#0891B2', topics: ['Estructura atòmica i taula periòdica', 'Enllaç químic', 'Termodinàmica química', 'Cinètica química', 'Equilibri químic', 'Àcids i bases', 'Reaccions redox', 'Química orgànica'] },
  fis: { name: 'Física', short: 'Física', color: '#2563EB', topics: ['Camp gravitatori', 'Camp elèctric', 'Camp magnètic i inducció', 'Vibracions i ones', 'Òptica', 'Física moderna'] },
  geo: { name: 'Geologia i Ciències Ambientals', short: 'Geologia', color: '#65A30D', topics: ['Mineralogia i petrologia', 'Tectònica de plaques', 'Geomorfologia', 'Riscos geològics', 'Recursos naturals', 'Medi ambient i sostenibilitat'] },
  dtec: { name: 'Dibuix Tècnic II', short: 'Dibuix Tèc.', color: '#475569', topics: ['Geometria plana', 'Transformacions geomètriques', 'Sistema dièdric', 'Sistema axonomètric', 'Perspectiva cònica', 'Normalització'] },
  teng: { name: 'Tecnologia i Enginyeria II', short: 'Tecnologia', color: '#334155', topics: ['Materials', 'Màquines i mecanismes', 'Sistemes elèctrics i electrònics', 'Sistemes automàtics i control', 'Sistemes pneumàtics i hidràulics', 'Energia i sostenibilitat'] },
  emp: { name: 'Empresa i Disseny de Models de Negoci', short: 'Empresa', color: '#0F766E', topics: ['L’empresa i l’entorn', 'Models de negoci (Canvas)', 'Producció i productivitat', 'Màrqueting', 'Comptabilitat i estats financers', 'Anàlisi econòmica i financera', 'Inversió i finançament'] },
  geog: { name: 'Geografia', short: 'Geografia', color: '#CA8A04', topics: ['Relleu d’Espanya', 'Clima i hidrografia', 'Paisatges naturals', 'Població', 'Sectors econòmics', 'Ciutat i territori', 'Espanya a la UE i al món'] },
  hart: { name: 'Història de l’Art', short: 'Hist. Art', color: '#DB2777', topics: ['Art grec i romà', 'Art romànic i gòtic', 'Renaixement', 'Barroc', 'S. XIX: del Neoclassicisme a l’Impressionisme', 'Avantguardes del s. XX', 'Art contemporani'] },
  gre: { name: 'Grec II', short: 'Grec', color: '#9F1239', topics: ['Morfologia nominal', 'Morfologia verbal', 'Sintaxi', 'Traducció de textos', 'Lèxic i etimologia', 'Literatura grega'] }
};

const CO_LANG_SUBJECT = { cat: 'cat', val: 'val', gal: 'gal', eus: 'eus' };

const MODALITIES = [
  { id: 'ct', name: 'Ciències i Tecnologia', options: ['mat'] },
  { id: 'hcs', name: 'Humanitats i Ciències Socials', options: ['macs', 'lat'] },
  { id: 'gen', name: 'General', options: ['cg'] },
  { id: 'apl', name: 'Arts plàstiques, imatge i disseny', options: ['dart'] },
  { id: 'mae', name: 'Música i arts escèniques', options: ['amus', 'aesc'] }
];

const ADMISSION_OPTIONS = ['mat', 'macs', 'bio', 'qui', 'fis', 'geo', 'dtec', 'teng', 'emp', 'geog', 'hart', 'lat', 'gre', 'his', 'fil'];

/* ---------- Banc de preguntes (respostes verificades) ---------- */
// [pregunta, [opcions], índex correcte, explicació]
const BANK = {
  his: [
    ['En quin any es va aprovar en referèndum la Constitució espanyola vigent?', ['1975', '1977', '1978', '1981'], 2, 'Es va aprovar en referèndum el 6 de desembre de 1978.'],
    ['En quin any es va promulgar la Constitució de Cadis, “la Pepa”?', ['1808', '1812', '1837', '1869'], 1, 'Les Corts de Cadis la van promulgar el 19 de març de 1812.'],
    ['Quan es va proclamar la Segona República?', ['14 d’abril de 1931', '18 de juliol de 1936', '13 de setembre de 1923', '6 d’octubre de 1934'], 0, 'Es va proclamar el 14 d’abril de 1931, després de les eleccions municipals.'],
    ['A quin polític s’associa la desamortització eclesiàstica de 1836?', ['Madoz', 'Mendizábal', 'Espartero', 'Narváez'], 1, 'Juan Álvarez Mendizábal va impulsar la desamortització dels béns del clero regular el 1836.'],
    ['Qui va dissenyar el sistema polític de la Restauració i el torn de partits?', ['Sagasta', 'Prim', 'Cánovas del Castillo', 'Maura'], 2, 'Antonio Cánovas del Castillo en va ser l’artífex; s’alternava al poder amb el Partit Liberal de Sagasta.'],
    ['En quin any es va produir l’intent de cop d’Estat del 23-F?', ['1977', '1979', '1981', '1982'], 2, 'El 23 de febrer de 1981, durant la investidura de Leopoldo Calvo-Sotelo.'],
    ['Quan va entrar Espanya a la Comunitat Econòmica Europea?', ['1982', '1986', '1992', '1995'], 1, 'L’adhesió es va fer efectiva l’1 de gener de 1986.'],
    ['Entre quins anys va durar la dictadura de Primo de Rivera?', ['1917–1923', '1923–1930', '1930–1936', '1939–1945'], 1, 'Va començar amb el cop d’Estat de setembre de 1923 i va acabar amb la seva dimissió el gener de 1930.'],
    ['Quina llei de 1976 va obrir el camí cap a la democràcia des de les institucions franquistes?', ['Llei d’Amnistia', 'Llei per a la Reforma Política', 'Llei de Successió', 'Llei Orgànica de l’Estat'], 1, 'La Llei per a la Reforma Política es va aprovar en referèndum el desembre de 1976.'],
    ['Quan va començar la Guerra Civil espanyola?', ['Juliol de 1936', 'Octubre de 1934', 'Febrer de 1936', 'Abril de 1939'], 0, 'Va començar amb el cop d’Estat del 17-18 de juliol de 1936.']
  ],
  fil: [
    ['Quin filòsof va formular la teoria de les Idees?', ['Aristòtil', 'Plató', 'Sòcrates', 'Epicur'], 1, 'Per a Plató, les Idees són realitats eternes i immutables que existeixen en el món intel·ligible.'],
    ['De qui és la frase “Penso, per tant existeixo”?', ['Hume', 'Kant', 'Descartes', 'Locke'], 2, 'René Descartes la formula al Discurs del mètode com a primera veritat indubtable.'],
    ['Qui va formular l’imperatiu categòric?', ['Kant', 'Hegel', 'Marx', 'Mill'], 0, 'Immanuel Kant el planteja com el principi suprem de la moralitat.'],
    ['Quin autor va escriure que “Déu ha mort”?', ['Marx', 'Nietzsche', 'Sartre', 'Schopenhauer'], 1, 'Friedrich Nietzsche ho escriu a La gaia ciència.'],
    ['Qui va proposar les cinc vies per demostrar l’existència de Déu?', ['Agustí d’Hipona', 'Guillem d’Ockham', 'Tomàs d’Aquino', 'Anselm de Canterbury'], 2, 'Tomàs d’Aquino les exposa a la Suma teològica.'],
    ['Amb quin filòsof associes el materialisme històric i la plusvàlua?', ['Marx', 'Comte', 'Nietzsche', 'Rousseau'], 0, 'Karl Marx explica la història a partir de les relacions de producció i la lluita de classes.'],
    ['Quin empirista va dir que la causalitat és fruit de l’hàbit?', ['Locke', 'Berkeley', 'Hume', 'Bacon'], 2, 'David Hume sosté que la connexió causal no es percep: la suposem per costum.'],
    ['Qui va desenvolupar el raciovitalisme?', ['Unamuno', 'Ortega y Gasset', 'Zambrano', 'Xirau'], 1, 'José Ortega y Gasset defensa la “raó vital”: “Jo sóc jo i la meva circumstància”.']
  ],
  cas: [
    ['¿Qué tipo de oración es “Aunque llueva, iremos al concierto”?', ['Subordinada adverbial causal', 'Subordinada adverbial concesiva', 'Coordinada adversativa', 'Subordinada adjetiva'], 1, '“Aunque” introduce una objeción que no impide la acción principal: es concesiva.'],
    ['En “Dijo que vendría”, ¿qué función tiene “que vendría”?', ['Sujeto', 'Complemento directo', 'Atributo', 'Complemento circunstancial'], 1, 'Es una subordinada sustantiva que funciona como complemento directo de “dijo”.'],
    ['¿Quién escribió La familia de Pascual Duarte (1942)?', ['Miguel Delibes', 'Camilo José Cela', 'Carmen Laforet', 'Ana María Matute'], 1, 'Camilo José Cela; la novela inaugura el tremendismo.'],
    ['¿Qué autor escribió Poeta en Nueva York?', ['Rafael Alberti', 'Luis Cernuda', 'Federico García Lorca', 'Pedro Salinas'], 2, 'Federico García Lorca, poeta de la Generación del 27.'],
    ['En “El libro que me prestaste es genial”, “que me prestaste” es una…', ['Subordinada sustantiva', 'Subordinada adjetiva o de relativo', 'Subordinada adverbial', 'Coordinada'], 1, 'Complementa al sustantivo “libro”, su antecedente.'],
    ['¿Quién es el autor de Luces de bohemia, la obra que define el esperpento?', ['Valle-Inclán', 'Unamuno', 'Baroja', 'Buero Vallejo'], 0, 'Ramón María del Valle-Inclán.'],
    ['¿Quién escribió Tiempo de silencio (1962)?', ['Juan Goytisolo', 'Luis Martín-Santos', 'Juan Marsé', 'Rafael Sánchez Ferlosio'], 1, 'Luis Martín-Santos; abre la renovación de la novela experimental.'],
    ['¿Qué tipo de palabra es “sacacorchos” según su formación?', ['Derivada', 'Compuesta', 'Parasintética', 'Simple'], 1, 'Une dos lexemas: “saca” y “corchos”.']
  ],
  cat: [
    ['Quin tipus d’oració és “Encara que plogui, sortirem”?', ['Subordinada adverbial causal', 'Subordinada adverbial concessiva', 'Coordinada adversativa', 'Subordinada adjectiva'], 1, '“Encara que” introdueix un obstacle que no impedeix l’acció principal.'],
    ['Qui va escriure Solitud (1905)?', ['Víctor Català', 'Narcís Oller', 'Joaquim Ruyra', 'Prudenci Bertrana'], 0, 'Víctor Català, pseudònim de Caterina Albert.'],
    ['Qui és l’autora de La plaça del Diamant?', ['Montserrat Roig', 'Mercè Rodoreda', 'Maria Aurèlia Capmany', 'Maria Barbal'], 1, 'Mercè Rodoreda la va publicar el 1962.'],
    ['Com se substitueix “Dona el llibre a la Maria” amb pronoms febles?', ['Dona-li’l', 'Dona-l’hi', 'Dona-li-el', 'Dona-lo-li'], 1, 'La combinació CD masculí singular + CI singular és “l’hi”.'],
    ['Qui va escriure Nosaltres, els valencians (1962)?', ['Vicent Andrés Estellés', 'Joan Fuster', 'Enric Valor', 'Manuel Sanchis Guarner'], 1, 'Joan Fuster, assagista de Sueca.'],
    ['Qui és l’autora de Pedra de tartera?', ['Maria Barbal', 'Carme Riera', 'Montserrat Roig', 'Isabel-Clara Simó'], 0, 'Maria Barbal la va publicar el 1985.'],
    ['Qui va escriure Bearn o la sala de les nines?', ['Llorenç Villalonga', 'Baltasar Porcel', 'Miquel dels Sants Oliver', 'Gabriel Alomar'], 0, 'Llorenç Villalonga, autor mallorquí.'],
    ['Quin és el plural de “llapis”?', ['llapissos', 'llapis', 'llapisos', 'llapissis'], 1, 'Els mots plans acabats en -s són invariables: un llapis, dos llapis.']
  ],
  eng: [
    ['If I ___ more time, I would travel more.', ['have', 'had', 'will have', 'would have'], 1, 'Second conditional: if + past simple, would + infinitive.'],
    ['She has lived here ___ 2015.', ['for', 'since', 'during', 'from'], 1, '“Since” goes with a point in time; “for” with a period.'],
    ['Passive: “They built the bridge in 1990.”', ['The bridge was built in 1990.', 'The bridge has built in 1990.', 'The bridge built in 1990.', 'The bridge is built in 1990.'], 0, 'Past simple passive: was/were + past participle.'],
    ['Reported speech: “I am tired,” he said.', ['He said he is tired.', 'He said he was tired.', 'He said he has been tired.', 'He said I was tired.'], 1, 'The present simple backshifts to the past simple.'],
    ['By the time we arrived, the film ___.', ['already started', 'has already started', 'had already started', 'was already start'], 2, 'Past perfect: an action finished before another past action.'],
    ['I’m looking forward to ___ you.', ['see', 'seeing', 'saw', 'have seen'], 1, '“Look forward to” is followed by the -ing form.'],
    ['Despite ___ tired, she finished the race.', ['be', 'was', 'being', 'to be'], 2, '“Despite” is followed by a noun or an -ing form.'],
    ['Which connector is closest in meaning to “however”?', ['therefore', 'nevertheless', 'moreover', 'because'], 1, 'Both introduce a contrast.']
  ],
  mat: [
    ['Quina és la derivada de f(x) = x³?', ['x²', '3x²', '3x³', 'x⁴/4'], 1, 'Regla de la potència: (xⁿ)′ = n·xⁿ⁻¹.'],
    ['Quant val ∫ 2x dx?', ['2', 'x²', 'x² + C', '2x² + C'], 2, 'Una primitiva de 2x és x²; cal afegir la constant d’integració.'],
    ['Quant val el determinant de la matriu (1 2 / 3 4)?', ['−2', '2', '10', '−10'], 0, '1·4 − 2·3 = −2.'],
    ['Quant val el límit de sin(x)/x quan x tendeix a 0?', ['0', '1', '∞', 'No existeix'], 1, 'És un límit notable: val 1.'],
    ['Quina és la derivada de e^(2x)?', ['e^(2x)', '2e^(2x)', '2x·e^(2x)', 'e^(2x)/2'], 1, 'Regla de la cadena: (e^u)′ = u′·e^u.'],
    ['Segons Rouché-Frobenius, un sistema és compatible determinat quan…', ['rang A ≠ rang A*', 'rang A = rang A* = nombre d’incògnites', 'rang A = rang A* < nombre d’incògnites', 'det A = 0'], 1, 'Si els rangs coincideixen i són iguals al nombre d’incògnites, hi ha solució única.'],
    ['Quant val ∫ de 0 a 1 de x dx?', ['1', '1/2', '2', '0'], 1, '[x²/2] de 0 a 1 = 1/2.'],
    ['Si A és 2×3 i B és 3×4, quina dimensió té A·B?', ['3×3', '2×4', '4×2', 'No es poden multiplicar'], 1, 'Files d’A per columnes de B: 2×4.'],
    ['Quina és la derivada de ln(x)?', ['1/x', 'ln(x)/x', 'x', 'eˣ'], 0, '(ln x)′ = 1/x per a x > 0.'],
    ['Quant val P(A ∪ B)?', ['P(A) + P(B)', 'P(A) · P(B)', 'P(A) + P(B) − P(A ∩ B)', 'P(A) − P(B)'], 2, 'Cal restar la intersecció perquè no es compti dues vegades.']
  ],
  macs: [
    ['En programació lineal amb regió factible fitada, on s’assoleix l’òptim?', ['Al centre de la regió', 'En un vèrtex de la regió', 'Fora de la regió', 'Sempre a l’origen'], 1, 'L’òptim d’una funció lineal s’assoleix en un vèrtex (o en un costat sencer).'],
    ['Quina és la mitjana d’una binomial B(n, p)?', ['n + p', 'n·p', 'n·p·(1 − p)', 'p/n'], 1, 'μ = n·p; la variància és n·p·(1 − p).'],
    ['Si Z segueix una N(0, 1), quant val P(Z ≤ 0)?', ['0', '0,25', '0,5', '1'], 2, 'La normal estàndard és simètrica respecte de 0.'],
    ['Quina és la derivada de f(x) = x² + 3x?', ['2x + 3', 'x + 3', '2x', '2x² + 3'], 0, 'Es deriva terme a terme.'],
    ['Dos esdeveniments A i B són independents si…', ['P(A ∩ B) = 0', 'P(A ∩ B) = P(A)·P(B)', 'P(A) = P(B)', 'P(A ∪ B) = 1'], 1, 'És la definició d’independència.'],
    ['A què és igual la transposada (A·B)ᵗ?', ['Aᵗ·Bᵗ', 'Bᵗ·Aᵗ', 'A·B', 'B·A'], 1, 'La transposada d’un producte inverteix l’ordre.'],
    ['Una funció és creixent en un interval si en ell…', ['f′(x) < 0', 'f′(x) > 0', 'f(x) > 0', 'f″(x) > 0'], 1, 'El signe de la derivada indica la monotonia.'],
    ['Per a què serveix el teorema de Bayes?', ['Calcular probabilitats a posteriori', 'Calcular mitjanes', 'Resoldre sistemes', 'Calcular límits'], 0, 'Permet calcular P(Aᵢ | B) a partir de P(B | Aᵢ).']
  ],
  emp: [
    ['Com es calcula el punt mort o llindar de rendibilitat?', ['CF / (P − CVu)', 'CF · P', '(P − CVu) / CF', 'Ingressos − costos'], 0, 'Són les unitats a partir de les quals l’empresa té beneficis.'],
    ['Com es calcula el fons de maniobra?', ['Actiu no corrent − Passiu no corrent', 'Actiu corrent − Passiu corrent', 'Patrimoni net − Passiu', 'Actiu total − Passiu total'], 1, 'Indica la capacitat de pagar els deutes a curt termini.'],
    ['Quin és el capital mínim d’una societat anònima?', ['3.000 €', '60.000 €', '120.000 €', 'No n’hi ha'], 1, 'La Llei de Societats de Capital fixa 60.000 € per a la SA.'],
    ['Quants blocs té el Business Model Canvas?', ['4', '6', '9', '12'], 2, 'Té 9 blocs, des dels segments de clients fins a l’estructura de costos.'],
    ['En una anàlisi DAFO, quins factors són interns?', ['Amenaces i oportunitats', 'Debilitats i fortaleses', 'Fortaleses i oportunitats', 'Tots quatre'], 1, 'Debilitats i fortaleses depenen de l’empresa; amenaces i oportunitats, de l’entorn.'],
    ['Com es calcula la productivitat d’un factor?', ['Producció / quantitat del factor', 'Costos / producció', 'Benefici / vendes', 'Producció · preu'], 0, 'Mesura la producció per unitat de factor utilitzat.'],
    ['Què indica un VAN positiu?', ['Que la inversió no és rendible', 'Que la inversió és rendible a la taxa de descompte fixada', 'Que el projecte té pèrdues', 'Que el TIR és zero'], 1, 'El valor actual dels fluxos supera la inversió inicial.'],
    ['Quines són les 4P del màrqueting mix?', ['Producte, preu, distribució i promoció', 'Pla, preu, persona i producte', 'Producte, publicitat, premsa i preu', 'Preu, públic, procés i promoció'], 0, 'En anglès: product, price, place i promotion.']
  ],
  geog: [
    ['Quin és el riu més llarg que discorre íntegrament per Espanya?', ['Tajo', 'Ebre', 'Duero', 'Guadalquivir'], 1, 'L’Ebre; el Tajo és més llarg però també passa per Portugal.'],
    ['Quin és el cim més alt d’Espanya?', ['Mulhacén', 'Aneto', 'Teide', 'Pica d’Estats'], 2, 'El Teide, a Tenerife, fa uns 3.715 m.'],
    ['Quin clima té estius secs i calorosos i hiverns suaus?', ['Oceànic', 'Mediterrani', 'De muntanya', 'Subtropical humit'], 1, 'És el tret principal del clima mediterrani.'],
    ['Què mesura la taxa de natalitat?', ['Naixements per 1.000 habitants en un any', 'Fills per dona', 'Naixements totals d’un país', 'Població menor de 15 anys'], 0, 'Els fills per dona són l’índex sintètic de fecunditat.'],
    ['Quantes comunitats autònomes té Espanya?', ['15', '17', '19', '20'], 1, '17 comunitats, més les ciutats autònomes de Ceuta i Melilla.'],
    ['Quin sector agrupa el comerç, el turisme i l’educació?', ['Primari', 'Secundari', 'Terciari', 'Quaternari'], 2, 'El terciari és el sector serveis.']
  ],
  bio: [
    ['En quin orgànul es fa la respiració cel·lular aeròbia?', ['Ribosoma', 'Mitocondri', 'Aparell de Golgi', 'Lisosoma'], 1, 'El cicle de Krebs i la cadena respiratòria tenen lloc al mitocondri.'],
    ['Quina base nitrogenada té l’ARN i no l’ADN?', ['Timina', 'Uracil', 'Citosina', 'Adenina'], 1, 'A l’ARN l’uracil substitueix la timina.'],
    ['Què produeix la meiosi?', ['2 cèl·lules diploides', '4 cèl·lules haploides', '2 cèl·lules haploides', '4 cèl·lules diploides'], 1, 'Dues divisions successives a partir d’una cèl·lula diploide.'],
    ['Quin enzim sintetitza ARN a partir d’ADN?', ['ADN polimerasa', 'ARN polimerasa', 'Ligasa', 'Helicasa'], 1, 'L’ARN polimerasa fa la transcripció.'],
    ['On té lloc la fase lluminosa de la fotosíntesi?', ['Estroma', 'Membrana dels tilacoides', 'Citoplasma', 'Nucli'], 1, 'Els fotosistemes són a la membrana dels tilacoides.'],
    ['Quines cèl·lules produeixen els anticossos?', ['Limfòcits T', 'Limfòcits B (cèl·lules plasmàtiques)', 'Macròfags', 'Eritròcits'], 1, 'Els limfòcits B es diferencien en cèl·lules plasmàtiques.']
  ],
  qui: [
    ['A 25 °C, una dissolució àcida té un pH…', ['Més gran que 7', 'Igual a 7', 'Més petit que 7', 'Igual a 14'], 2, 'A 25 °C el pH neutre és 7.'],
    ['Quin valor té el nombre d’Avogadro?', ['6,022·10²³ mol⁻¹', '3·10⁸ mol⁻¹', '1,6·10⁻¹⁹ mol⁻¹', '9,8 mol⁻¹'], 0, 'Són les partícules que hi ha en un mol.'],
    ['Què és l’oxidació?', ['Guanyar electrons', 'Perdre electrons', 'Guanyar protons', 'Perdre neutrons'], 1, 'L’espècie que s’oxida perd electrons.'],
    ['Quin enllaç té el NaCl?', ['Covalent', 'Iònic', 'Metàl·lic', 'Pont d’hidrogen'], 1, 'Un metall i un no-metall que intercanvien electrons.'],
    ['Què fa un catalitzador?', ['Augmenta l’energia d’activació', 'Disminueix l’energia d’activació', 'Desplaça l’equilibri', 'Es consumeix en la reacció'], 1, 'Augmenta la velocitat de reacció sense consumir-se.'],
    ['Quin grup funcional és −COOH?', ['Alcohol', 'Àcid carboxílic', 'Èster', 'Aldehid'], 1, 'És el grup carboxil.']
  ],
  fis: [
    ['En quina unitat del SI es mesura la força?', ['Joule', 'Newton', 'Watt', 'Pascal'], 1, '1 N = 1 kg·m/s².'],
    ['Segons la llei de Coulomb, la força entre càrregues és…', ['Proporcional a la distància', 'Inversament proporcional al quadrat de la distància', 'Independent de la distància', 'Inversament proporcional a la distància'], 1, 'F = k·q₁·q₂ / r².'],
    ['Quina és la velocitat aproximada de la llum en el buit?', ['3·10⁵ m/s', '3·10⁸ m/s', '3·10¹⁰ m/s', '340 m/s'], 1, 'c ≈ 299.792.458 m/s.'],
    ['Com es calcula l’energia d’un fotó?', ['E = m·c²', 'E = h·f', 'E = ½·m·v²', 'E = q·V'], 1, 'Relació de Planck: h és la constant de Planck i f, la freqüència.'],
    ['El període d’un pèndol simple (petites oscil·lacions) depèn de…', ['La massa', 'La longitud i la gravetat', 'L’amplitud', 'La massa i la longitud'], 1, 'T = 2π·√(L/g).'],
    ['Què descriu la llei de Faraday-Lenz?', ['La gravitació', 'La inducció electromagnètica', 'La refracció', 'L’efecte fotoelèctric'], 1, 'Una variació del flux magnètic indueix una força electromotriu.']
  ],
  lat: [
    ['Quin cas fa la funció de subjecte en llatí?', ['Acusatiu', 'Nominatiu', 'Genitiu', 'Datiu'], 1, 'El nominatiu és el cas del subjecte i de l’atribut.'],
    ['Qui va escriure l’Eneida?', ['Ovidi', 'Horaci', 'Virgili', 'Lucreci'], 2, 'Publi Virgili Maró.'],
    ['A quina declinació pertany rosa, rosae?', ['Primera', 'Segona', 'Tercera', 'Quarta'], 0, 'Genitiu singular en -ae: primera declinació.'],
    ['Qui va escriure De bello Gallico?', ['Ciceró', 'Juli Cèsar', 'Sal·lusti', 'Titus Livi'], 1, 'Són els comentaris de Cèsar sobre la guerra de les Gàl·lies.']
  ],
  hart: [
    ['Qui va pintar Les Menines?', ['Goya', 'Velázquez', 'El Greco', 'Murillo'], 1, 'Diego Velázquez, 1656.'],
    ['Quin artista va pintar el Guernica (1937)?', ['Dalí', 'Miró', 'Picasso', 'Gris'], 2, 'Pablo Picasso, per al pavelló de la República a l’Exposició de París.'],
    ['Quin ordre arquitectònic té el Partenó?', ['Jònic', 'Dòric', 'Corinti', 'Toscà'], 1, 'És el gran exemple d’ordre dòric.'],
    ['Qui va pintar la volta de la Capella Sixtina?', ['Rafael', 'Leonardo', 'Miquel Àngel', 'Botticelli'], 2, 'Miquel Àngel, entre 1508 i 1512.'],
    ['Qui és l’arquitecte de la Sagrada Família?', ['Domènech i Montaner', 'Gaudí', 'Puig i Cadafalch', 'Jujol'], 1, 'Antoni Gaudí s’hi va dedicar des del 1883.']
  ]
};
BANK.val = BANK.cat;

/* ---------- Mètode d’estudi per tipus de sessió ---------- */
const METHOD = {
  teoria: { label: 'Teoria', icon: 'book', tip: 'Llegeix el tema i fes-ne un esquema propi. Després tanca els apunts i explica’l en veu alta com si l’ensenyessis (tècnica Feynman). Acaba responent 3 preguntes sense mirar.' },
  exercicis: { label: 'Exercicis tipus PAU', icon: 'pencil', tip: 'Fes exercicis d’exàmens oficials d’anys anteriors sense mirar la solució. Corregeix amb els criteris de correcció de la teva comunitat i apunta cada error a la llista d’errors.' },
  simulacre: { label: 'Simulacre', icon: 'clock', tip: 'Condicions reals: 90 minuts, sense mòbil i només el material permès. Corregeix-lo l’endemà amb els criteris oficials i posa’t nota.' },
  correccio: { label: 'Correcció i punts febles', icon: 'target', tip: 'Repassa la llista d’errors i torna a fer, sense ajuda, els exercicis que vas fallar. Si un error es repeteix, torna a la teoria d’aquell tema.' },
  repas: { label: 'Repàs actiu', icon: 'repeat', tip: 'Recuperació activa: fes les flashcards pendents i repassa els temes que toquen pel repàs espaiat (fa 1, 7 i 21 dies). No rellegeixis: intenta recordar abans de mirar.' },
  final: { label: 'Repàs final', icon: 'repeat', tip: 'Res de temari nou. Repassa esquemes i flashcards, revisa fórmules i dates clau i dorm bé.' }
};