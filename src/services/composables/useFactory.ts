import type { IDtoUoMCategory } from '@/services/definitions'
import type { IDtoRole, IDtoStaff, IDtoUoM } from '@/services/definitions'


export default function useFactory() {

    //#region ======= FACTORY METHODS =====================================================

    const mkStaff = (): IDtoStaff => {
        return {
            id: 0,
            firstName: '',
            username: '',
            roleId: 0,
            isActive: true,
            cell: 0,
            avatarPath: '',
            lastName: '',
            email: '',
            locale: '',
            password: '',
            passwordConf: '',
        }
    }

    const mkRole = (): IDtoRole => {
        return {
            id: 0,
            rName: "",
            description: "",
            permsToGrant: [],
            permsToRemove: [],
        }
    }

    const mkUoMCategory = (): IDtoUoMCategory => {
        return {
            id: 0,
            ucName: "",
            units: new Array<IDtoUoM>()
        }
    }

    //#endregion ==========================================================================

    return {
        mkRole,
        mkStaff,
        mkUoMCategory
    }
}


