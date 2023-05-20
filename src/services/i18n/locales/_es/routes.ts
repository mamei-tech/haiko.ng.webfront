import { RoutePathNames } from '@/services/definitions'

export default {
    //region ======== ROOTS =================================================================
    [ RoutePathNames.dashboard ]: RoutePathNames.dashboard,
    logout: 'salir',
    //endregion =============================================================================

    //#region ======== ROLES ================================================================
    [ RoutePathNames.roles ]:       '@:{\'entities.role.section-name\'}',
    [ RoutePathNames.rolesCreate ]: '@:crud-actions.create @:entities.role.section-name',
    [ RoutePathNames.rolesEdit ]:   '@:crud-actions.edition @:entities.role.section-name',
    //#endregion  ===========================================================================

    //#region ======== STAFF ================================================================
    [ RoutePathNames.staff ]:       '@:{\'entities.staff.section-name\'}',
    [ RoutePathNames.staffCreate ]: '@:crud-actions.create @:entities.staff.section-name',
    [ RoutePathNames.staffEdit ]:   '@:crud-actions.edition @:entities.staff.section-name',
    //#endregion  ===========================================================================

    //#region ======== UOM ==================================================================
    [ RoutePathNames.munits ]:   '@:{\'entities.uom.section-name\'}',
    [ RoutePathNames.muCreate ]: '@:crud-actions.create @:entities.uom.section-name',
    [ RoutePathNames.muEdit ]:   '@:crud-actions.edition @:entities.uom.section-name',
    //#endregion  ===========================================================================

    //#region ======== PURCHASE =============================================================
    [ RoutePathNames.purchase ]:       '@:{\'entities.purchase.name\'}',
    [ RoutePathNames.purchaseCreate ]: '@:crud-actions.create @:entities.purchase.section-name',
    [ RoutePathNames.purchaseEdit ]:   '@:crud-actions.edition @:entities.purchase.section-name',
    //#endregion  ===========================================================================

    //#region ======== SUPPLIERS ============================================================
    [ RoutePathNames.suppliers ]:       '@:{\'entities.suppliers.name\'}',
    [ RoutePathNames.suppliersCreate ]: '@:crud-actions.create @:entities.suppliers.section-name',
    [ RoutePathNames.suppliersEdit ]:   '@:crud-actions.edition @:entities.suppliers.section-name',
    //#endregion  ===========================================================================

    //#region ======== SUPPLIERS CATEGORIES =================================================
    [ RoutePathNames.suppliersCat ]:       '@:{\'entities.suppliers-cat.name\'}',
    [ RoutePathNames.suppliersCatCreate ]: '@:crud-actions.create @:entities.suppliers-cat.section-name',
    [ RoutePathNames.suppliersCatEdit ]:   '@:crud-actions.edition @:entities.suppliers-cat.section-name'
    //#endregion  ===========================================================================


}
