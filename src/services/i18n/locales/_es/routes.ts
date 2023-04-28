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

    //#region ======== ROLES ================================================================
    [ RoutePathNames.munits ]:   '@:{\'entities.uom.section-name\'}',
    [ RoutePathNames.muCreate ]: '@:crud-actions.create @:entities.uom.section-name',
    [ RoutePathNames.muEdit ]:   '@:crud-actions.edition @:entities.uom.section-name'
    //#endregion  ===========================================================================

}
