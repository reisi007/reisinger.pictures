export type NavLink = { href: string; label: string; external?: boolean; };
export type NavGroup = { label: string; subItems: NavLink[]; };
export type NavItem = NavLink | NavGroup;

export const mainLinks: NavItem[] = [
  { href: '/sport/', label: 'Sport' },
  { href: '/business/', label: 'B2B Angebote' },
  { href: '/privat/', label: 'Privat Angebote' },
  { href: '/einblicke/', label: 'Einblicke' }
];
