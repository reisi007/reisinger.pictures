const akt = [
    'lippen',
    'hemd-bw',
    'rote-dessous',
    'bad-pink',
    'schwarz1',
    'schwarz2',
    'bett',
    "outdoor",
    'schwarz3',
    'mund',
    'po',
    'farbe-unterhose',
    'brust',
];

const beauty = [
    'herbst1',
    'dunkel',
    "wien2",
    'studio1',
    'winter1',
    "freinberg1",
    'studio2',
    'hohesgras1',
    'ubahn',
    'bunt',
    'spielplatz',
    'kunstuni',
    "schloss1",
    "donau1",
    'gitter',
    'cola1',
    'blumen',
    'lampe',
    "studio6",
    'sommer1',
    'studio3',
    'winter2',
    'altstadt',
    'hohesgras2',
    "wien1",
    'bw1',
    "herbst2",
    'sommer2',
    'cola2',
    'porträt',
    'sessel',
    'turm1',
    'turnen',
    'studio4',
    'farbe1',
    "herbst4",
    'bw2',
    'farbe2',
    "altstadt2",
    'gras',
    'studio5',
    'landhaus1',
    "herbst3",
    "ourdoorblitz1",
    'muster',
    "portraet1",
    'bank',
    'turm2',
    'landhaus2',
    'hohesgras3',
    'grafitti',
    'bogen',
    'holz',
];

const couples = [
    "baum1",
    'freinberg',
    'hochzeit',
    "schule1",
    'feld',
    'leonding',
    'see1',
    "baum2",
    'park1',
    'sonne2',
    "see2",
    'park2',
    'sonne',
];

const tanz = [
    'studio1',
    'eisenbahn1',
    'mogdi1',
    "see1",
    'bruecke',
    'studio2',
    'bw1',
    'eisenbahn2',
    'eisenbahn3',
    'studio3',
    'herbst',
    'ballet1',
    'studio4',
    'cheer',
    'schloss',
    'ballet2',
    'eisenbahn4',
    'sonne',
];

const sport = [
    'cheer1',
    "lask22",
    "galatasaray2",
    "bwl18",
    "steel03",
    'lask1',
    'basketball1',
    'football1',
    "oefb5",
    'basketball2',
    "steel01",
    "lask23",
    'astros1',
    "lask24",
    'bwl1',
    'oefb1',
    'basketball3',
    "galatasaray1",
    'bwl2',
    'lask2',
    'bwl3',
    'lask3',
    'bwl4',
    'lask4',
    "bwl19",
    'football2',
    'basketball4',
    'lask5',
    'basketball5',
    "lask20",
    "steel04",
    'oefb-damen1',
    'basketball6',
    'lask6',
    'football3',
    'eishockey1',
    "lask21",
    'football4',
    'basketball7',
    'lask7',
    'basketball8',
    'lask8',
    "steel02",
    'basketball14',
    'bwl5',
    'oefb2',
    'bwl6',
    'bwl7',
    'oefb3',
    'basketball9',
    'football5',
    "lask25",
    'basketball10',
    'lask9',
    'bwl8',
    'basketball11',
    'lask10',
    'bwl9',
    'lask11',
    'cheer2',
    'eishockey2',
    'lask12',
    'oefb4',
    'tennis1',
    'eishockey3',
    'oefb9',
    'lask13',
    'bwl10',
    'lask14',
    'eishockey4',
    'bwl11',
    'lask14',
    'eishockey5',
    'bwl12',
    'lask15',
    'basketball12',
    'lask16',
    'bwl13',
    'bwl14',
    'oefb6',
    'bwl15',
    'oefb7',
    'bwl16',
    'lask17',
    'bwl17',
    'oefb8',
    'lask18',
    'basketball13',
    'lask19',
    'eishockey6',
];

const turnen = [
    "pbs1",
    "pbs2",
    "pbs3",
    "pbs4",
    "pbs5",
    "pbs6",
    "pbs7",
]

const outdoor = [
    "altstadt2",
    "eisenbahn1",
    "herbst",
    "holz",
    "hohesgras2",
    "see1",
    "sonne",
    "lampe",
    "landhaus1",
    "leonding",
    "spielplatz",
    "turm1",
    "turm2",
    "winter2",
];

const indoor = [
    "studio6",
    "studio1",
    "dunkel",
    "farbe2",
    "studio2",
    "mogdi1",
    "farbe-unterhose",
    "rote-dessous",
    "sessel",
];


export const IMAGE_BY_CATEGORY: Record<string, string[]> = {akt, beauty, couples, tanz, sport, turnen};
export const IMAGE_STRIPS: Record<string, string[]> = {indoor, outdoor}