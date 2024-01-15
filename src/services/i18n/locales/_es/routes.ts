import { RoutePathNames } from '@/services/definitions'

export default {
    //region ======== ROOTS ===============================================================

    // [ RoutePathNames.dashboard ]: RoutePathNames.dashboard,
    [ RoutePathNames.hub ]: 'Módulos',
    logout: 'salir',

    //#endregion  =========================================================================

    //#region ======= POS =================================================================

    [ RoutePathNames.pos ]: 'POS',

    //#endregion ==========================================================================

    //#region ======= DASHBOARD & REPORTS =================================================

    [ RoutePathNames.dashNReports ]: 'Dashboard & Reportes',

    //#endregion ==========================================================================

    //#region ======= MANAGEMENT ==========================================================

    [ RoutePathNames.dops ]: 'Operaciones Diarias',

    //#endregion ==========================================================================

    //#region ======= INVENTORY ===========================================================

    [ RoutePathNames.inventory ]: 'Inventario',

    [ RoutePathNames.product ]:    '@:{\'entities.product.name\'}',
    [ RoutePathNames.prodCreate ]: '@:crud-actions.create @:entities.product.name',
    [ RoutePathNames.prodEdit ]:   '@:crud-actions.edition @:entities.product.name',

    [ RoutePathNames.munits ]:   '@:{\'entities.uom.section-name\'}',
    [ RoutePathNames.muCreate ]: '@:crud-actions.create @:entities.uom.section-name',
    [ RoutePathNames.muEdit ]:   '@:crud-actions.edition @:entities.uom.section-name',

    //#endregion ==========================================================================

    //#region ======= PRODUCTION ==========================================================

    [ RoutePathNames.bom ]: 'Insumos',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    [ RoutePathNames.purchase ]:       '@:{\'entities.purchase.name\'}',
    [ RoutePathNames.purchaseCreate ]: '@:crud-actions.create @:entities.purchase.section-name',
    [ RoutePathNames.purchaseEdit ]:   '@:crud-actions.edition @:entities.purchase.section-name',

    [ RoutePathNames.supplierCat ]:       '@:{\'entities.supplier-cat.name\'}',
    [ RoutePathNames.supplierCatCreate ]: '@:crud-actions.create @:entities.supplier-cat.name',
    [ RoutePathNames.supplierCatEdit ]:   '@:crud-actions.edition @:entities.supplier-cat.name',

    [ RoutePathNames.supplier ]:       '@:{\'entities.supplier.name\'}',
    [ RoutePathNames.supplierCreate ]: '@:crud-actions.create @:entities.supplier.name',
    [ RoutePathNames.supplierEdit ]:   '@:crud-actions.edition @:entities.supplier.name',

    //#endregion ==========================================================================

    //#region ======= PEOPLE ==============================================================

    [ RoutePathNames.roles ]:       '@:{\'entities.role.section-name\'}',
    [ RoutePathNames.rolesCreate ]: '@:crud-actions.create @:entities.role.section-name',
    [ RoutePathNames.rolesEdit ]:   '@:crud-actions.edition @:entities.role.section-name',

    [ RoutePathNames.staff ]:       '@:{\'entities.staff.section-name\'}',
    [ RoutePathNames.staffCreate ]: '@:crud-actions.create @:entities.staff.section-name',
    [ RoutePathNames.staffEdit ]:   '@:crud-actions.edition @:entities.staff.section-name',

    //#endregion ==========================================================================

    //#region ======= CONFIGURATIONS ======================================================

    [ RoutePathNames.configs ]: 'Configuración',

    //#endregion ==========================================================================

    //#region ======= GALLERY =============================================================

    [ RoutePathNames.gallery ]: 'Galería',

    //#endregion ==========================================================================

}
