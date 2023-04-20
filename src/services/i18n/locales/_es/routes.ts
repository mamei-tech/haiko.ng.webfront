import { RoutePathNames } from '@/services/definitions'

export default {
    //region ======== ROOTS =================================================================
    [ RoutePathNames.dashboard ]: RoutePathNames.dashboard,
    logout: 'salir',
    //endregion =============================================================================

    //region ======== CATALOGS ==============================================================
    // [ RoutePathNames.catalogs ]: 'Catálogos',
    // [ RoutePathNames.catalogsForm ]: 'Editar Catálogo',
    // 'catalog-create': 'Crear Catálogo',
    // [ RoutePathNames.catalogsDetails ]: 'Detalles de Catálogo',
    //endregion =============================================================================

    //region ======== USERS =================================================================
    // [ RoutePathNames.users ]: 'Usuarios',
    // [ RoutePathNames.roles ]: RoutePathNames.roles,
    //endregion =============================================================================

    //#region ======== STORES ===============================================================
    // [ RoutePathNames.stores ]: "@:{'stores.stores'}s",
    // [ RoutePathNames.storesMenus ]: "Gestión de @:{'menu.menu'}s",
    // [ RoutePathNames.storesForm ]: 'Editar @:stores.stores',
    // [ RoutePathNames.storeCreate ]: '@:crud-actions.create @:stores.stores',
    //
    // [ RoutePathNames.storeMenuDetails ]: 'Detalles de @:menu.menu',
    // [ RoutePathNames.storeMenuCreate ]: '@:crud-actions.create @:menu.menu',
    //#endregion  ===========================================================================

    //#region ======== ROLES ================================================================
    [ RoutePathNames.roles ]:       '@:{\'entities.role.section-name\'}',
    [ RoutePathNames.rolesCreate ]: '@:crud-actions.create @:entities.role.section-name',
    [ RoutePathNames.rolesEdit ]:   '@:crud-actions.edition @:entities.role.section-name',
    //#endregion  ===========================================================================

    //#region ======== STAFF ================================================================
    [ RoutePathNames.staff ]:       '@:{\'entities.staff.section-name\'}',
    [ RoutePathNames.staffCreate ]: '@:crud-actions.create @:entities.staff.section-name',
    [ RoutePathNames.staffEdit ]:   '@:crud-actions.edition @:entities.staff.section-name',
    // [ RoutePathNames.storesMenus ]: "Gestión de @:{'menu.menu'}s",
    // [ RoutePathNames.storeMenuDetails ]: 'Detalles de @:menu.menu',
    // [ RoutePathNames.storeMenuCreate ]: '@:crud-actions.create @:menu.menu',
    //#endregion  ===========================================================================

    //#region ======== ITEMS ================================================================
    // [ RoutePathNames.items ]: "@:{'items.menu-item'}s",
    // [ RoutePathNames.itemsForm ]: 'Editar @:items.menu-item',
    // [ RoutePathNames.itemCreate ]: '@:crud-actions.create @:items.menu-item'
    //#endregion  ===========================================================================

    //#region ======== ROLES ================================================================
    [ RoutePathNames.munits ]:   '@:{\'entities.munits.section-name\'}',
    [ RoutePathNames.muCreate ]: '@:crud-actions.create @:entities.munits.section-name',
    [ RoutePathNames.muEdit ]:   '@:crud-actions.edition @:entities.munits.section-name'
    //#endregion  ===========================================================================

    //#region ======== AUTH =================================================================
    //#endregion  ===========================================================================
}
