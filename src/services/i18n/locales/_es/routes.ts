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

    [ RoutePathNames.inventory ]: '@:data.overview',

    [ RoutePathNames.product ]:     '@:table-headers.products',
    [ RoutePathNames.productForm ]: '{action} @:table-headers.products',

    [ RoutePathNames.munits ]: '@:{\'entities.uom.section-name\'}',
    [ RoutePathNames.muForm ]: '{action} @:entities.uom.section-name',

    [ RoutePathNames.warehouseList ]: '@:{\'entities.warehouse.section-name\'}',
    [ RoutePathNames.warehouseForm ]: '{action} @:entities.warehouse.section-name',

    [ RoutePathNames.wlocationList ]: '@:{\'entities.wlocation.section-name\'}',
    [ RoutePathNames.wlocationForm ]: '{action} @:entities.wlocation.section-name',

    [ RoutePathNames.strgcategoryList ]: '@:{\'entities.strgcategory.section-name\'}',
    [ RoutePathNames.strgcategoryForm ]: '{action} @:entities.strgcategory.section-name',

    //#endregion ==========================================================================

    //#region ======= PRODUCTION ==========================================================

    [ RoutePathNames.bom ]: 'Insumos',

    //#endregion ==========================================================================

    //#region ======= PURCHASE ============================================================

    [ RoutePathNames.purchase ]:     '@:{\'entities.purchase.name\'}',
    [ RoutePathNames.purchaseForm ]: '{action} @:entities.purchase.section-name',

    [ RoutePathNames.supplierCat ]:     '@:{\'entities.supplier-cat.name\'}',
    [ RoutePathNames.supplierCatForm ]: '{action} @:entities.supplier-cat.name',

    [ RoutePathNames.supplier ]:     '@:{\'entities.supplier.name\'}',
    [ RoutePathNames.supplierForm ]: '{action} @:entities.supplier.name',

    //#endregion ==========================================================================

    //#region ======= PEOPLE ==============================================================

    [ RoutePathNames.roles ]:     '@:{\'entities.role.section-name\'}',
    [ RoutePathNames.rolesForm ]: '{action} @:entities.role.section-name',

    [ RoutePathNames.staff ]:     '@:{\'entities.staff.section-name\'}',
    [ RoutePathNames.staffForm ]: '{action} @:entities.staff.section-name',

    //#endregion ==========================================================================

    //#region ======= CONFIGURATIONS ======================================================

    [ RoutePathNames.configs ]: 'Configuración',

    //#endregion ==========================================================================

    //#region ======= GALLERY =============================================================

    [ RoutePathNames.gallery ]: 'Galería',

    //#endregion ==========================================================================

}
