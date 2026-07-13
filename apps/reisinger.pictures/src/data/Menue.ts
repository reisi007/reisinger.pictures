export type NavLink = { href: string; label: string; external?: boolean; };
export type NavGroup = { label: string; subItems: NavLink[]; };
export type NavItem = NavLink | NavGroup;

export const mainLinks: NavItem[] = [
  { href: '/', label: 'Startseite & Blog' },
  { href: '/shootings/sport/', label: 'Sport' },
  {
    label: 'Shootings',
    subItems: [
      { href: '/shootings/akt/', label: 'Akt & Boudoir' },
      { href: '/shootings/beauty/', label: 'Beauty & Portrait' },
      { href: '/shootings/couples/', label: 'Pärchen' }
    ]
  },
  { href: '/preise/', label: 'Preise' },
  { href: '/ueber-mich/', label: 'Über mich' }
];
