import type { IDtoRole, IDtoStaff, IDtoUoM, IDtoSupplier, IDtoSupplierCat, IDtoUoMCategory } from '@/services/definitions'


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

    const mkSupplier = (): IDtoSupplier => {
        return {
            id: 0,
            sName: '',
            contactName: undefined,
            sContactNotes: undefined,
            sInternalNotes: undefined,
            sCategoryID: '',

            sEmail: undefined,
            sPhone: undefined,
            cell: '',
            sWebSite: undefined,
            sAddress: undefined,
            countryCode: undefined,
            stateCode: undefined,
            zip: undefined,

            isCompany: false,
            isActive: true,

            pCount: 0,
            purchasesCountPend: 0,
            purchasesCountTotal: 0,
            purchasesCountValue: 0
        }
    }

    //#endregion ==========================================================================

    return {
        mkRole,
        mkStaff,

        mkUoM,
        mkUoMCategory,

        mkSupplier,
        mkSupplierCat
    }
}


