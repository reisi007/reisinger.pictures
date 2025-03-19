export type Menue = (MenueItem | SubMenu)[];

export enum Visibility {
    ALWAYS,
    DEV_ONLY,
    PROD_ONLY,
}

export type MenueItem = {
    href: string,
    name: string,
    visibility?: Visibility,

}

export type SubMenu = {
    name: string,
    baseHref: string,
    items: MenueItem[],
    visibility?: Visibility,
}

export function isSubMenu(item: MenueItem | SubMenu): item is SubMenu {
    return (item as SubMenu).baseHref !== undefined;
}

export function isMenuItem(item: MenueItem | SubMenu): item is MenueItem {
    return !isSubMenu(item);
}


