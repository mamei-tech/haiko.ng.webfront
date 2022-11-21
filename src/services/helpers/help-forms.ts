// Helpers functions to be used in form views
//
// ===========================================================
import type { IMultiselectBasic, IRoleBasic } from '@/services/definitions'


/**
 * Maps the roles data format coming from Roles Nomenclator
 */
export function mapRolesNom2Multiselect( roleNomeData: Array<IRoleBasic> ): Array<IMultiselectBasic> {

    return roleNomeData.map((roleData: IRoleBasic) => {
        return { value: roleData.id, label: roleData.rName }
    })
}
