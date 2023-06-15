import type { IDtoSupplierCat, IDtoUoMCategory } from '@/services/definitions'
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
            units: new Array<IDtoUoM>(),
            unitsToDelete: new Array<number>()
        }
    }

    /**
     * Factory method to create an empty UoM
     * When this is used in form mode, the form need to manage a list of UoM, the workaround is to work with temporally Id
     * for the list of UoM so we allow to pass the UoM identifier to this method.
     *
     * @param uomId UoM identifier*
     * @param uomCatId UoM category Id.
     */
    const mkUoM = ( uomId: number, uomCatId: number ): IDtoUoM => {
        return {
            id:          uomId,
            isActive:    true,
            uName:       '',
            uRatio:      1,
            uType:       0,
            uCategoryId: uomCatId,
        }
    }

    const mkSupplierCat = (): IDtoSupplierCat => {
        return {
            id: 0,
            scColor: '#000000',
            scName: '',
            sCount: 0,
            sDescription: ''
        }
    }

    //#endregion ==========================================================================

    return {
        mkRole,
        mkStaff,
        mkUoM,
        mkUoMCategory,
        mkSupplierCat
    }
}


