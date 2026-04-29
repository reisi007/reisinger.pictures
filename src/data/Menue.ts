export type NavLink = { href: string; label: string; external?: boolean; };
export type NavGroup = { label: string; subItems: NavLink[]; };
export type NavItem = NavLink | NavGroup;

export const businessLinks: NavItem[] = [
  { href: '/business/', label: 'Übersicht' },
  { href: '/business/corporate/', label: 'Corporate & Headshots' },
  { href: '/business/sport/', label: 'Sport & Event-Reportagen' },
  { href: '/business/kundenportal/', label: 'Portal & Lieferung' },
  { href: '/business/preise/', label: 'Preise & Kalkulator' },
  { href: 'https://portal.reisinger.pictures', label: 'Portal Login', external: true },
];

export const privateLinks: NavItem[] = [
  { href: '/privat/', label: 'Übersicht' },
  { href: '/beauty/', label: 'Beauty' },
  { 
    label: 'Akt', 
    subItems: [
      { href: '/akt/', label: 'Portfolio' },
      { href: '/akt/ablauf/', label: 'Ablauf & Infos' }
    ] 
  },
  { href: '/couples/', label: 'Pärchen' },
  { href: '/privat/preise/', label: 'Preise & Pakete' },
];

export const infoLinks: NavItem[] = [
  { href: '/testimonials/', label: 'Bewertungen' },
  { href: '/kurse/', label: 'Kurse' },
  { href: '/einblicke/', label: 'Blog' },
  { href: '/sport/', label: 'Sport' },
];
