import type {
    IDtoUoM,
    IDtoRole,
    IDtoStaff,
    IDtoProduct,
    IDtoSupplier,
    IDtoSupplierCat,
    IDtoUoMCategory,
    IDtoProductSupplierL,
} from '@/services/definitions'


/**
 * This composable has the same responsibility of the constructors in the backend (.net)
 * Acts like a collection of helpers method to created default / empty object of a specific type
 */
export default function useFactory() {

    //#region ======= FACTORY METHODS =====================================================

    const mkStaff = (): IDtoStaff => {
        return {
            id:           0,
            firstName:    '',
            username:     '',
            roleId:       0,
            isActive:     true,
            cell:         0,
            avatarPath:   '',
            lastName:     '',
            email:        '',
            locale:       '',
            password:     '',
            passwordConf: ''
        }
    }

    const mkRole = (): IDtoRole => {
        return {
            id:            0,
            rName:         '',
            description:   '',
            permsToGrant:  [],
            permsToRemove: []
        }
    }

    const mkUoMCategory = (): IDtoUoMCategory => {
        return {
            id:            0,
            ucName:        '',
            units:         new Array<IDtoUoM>(),
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
            uCategoryId: uomCatId
        }
    }

    /**
     * Factory method to create an empty Product Supplier Line
     * When this is used in form mode, the form need to manage a list of Supplier for the product in question,
     * the workaround is to work with temporally Id for the list of Suppliers so we allow to pass the row identifier to
     * this method.
     *
     * @param supplierLineId row entity (supplier line in this case) identifier
     * @param productId Product identifier that the provider is related to
     */
    const mkProductSupplierLine = ( supplierLineId: number, productId: number ): IDtoProductSupplierL => {
        return {
            id:           supplierLineId,
            supplierId:   0,            // default supplier
            supplierCode: '',
            sku:          '',
            sPrice:       '1.00',
            currencyId:   1,            // default currency
            sTax:         0,
            isActive:     true,
            sName:        undefined
        }
    }

    const mkSupplierCat = (): IDtoSupplierCat => {
        return {
            id:           0,
            scColor:      '#000000',
            scName:       '',
            sCount:       0,
            sDescription: ''
        }
    }

    const mkSupplier = (): IDtoSupplier => {
        return {
            id:             0,
            sName:          '',
            contactName:    undefined,
            sContactNotes:  undefined,
            sInternalNotes: undefined,
            sCategoryID:    '',

            sEmail:      undefined,
            sPhone:      undefined,
            cell:        '',
            sWebSite:    undefined,
            sAddress:    undefined,
            countryCode: undefined,
            stateCode:   undefined,
            zip:         undefined,

            isCompany: false,
            isActive:  true,

            pCount:              0,
            purchasesCountPend:  0,
            purchasesCountTotal: 0,
            purchasesCountValue: 0
        }
    }

    const mkProduct = (): IDtoProduct => {
        return {
            id:                 0,
            pName:              '',
            notePurchase:       undefined,
            noteSell:           undefined,
            noteTransfer:       undefined,
            picPath:            undefined,
            isActive:           true,
            canBePurchased:     true,
            canBeSold:          false,
            doWeTrackInventory: true,
            pCategoryID:        1,

            sellCode:       undefined,
            pUoMID:         1,
            pUoMPurchaseID: 1,
            sellPrice:      1.00,
            sellTax:        undefined,

            pTotalStock:             0,
            pTotalStockValue:        0,
            pTotalSalesCountInMonth: 0,
            pTotalSalesValueInMonth: 0,
            pTotalPurchasesIn3Month: 0,
            pCountBoMRecipes:        0,

            cost: undefined,

            lResponsibleID: undefined,
            weight:         undefined,
            volume:         undefined,
            preDay2Manuf:   undefined,

            supplierLines:     new Array<IDtoProductSupplierL>(),
            suppLinesToDelete: new Array<number>()
        }
    }

    //#endregion ==========================================================================

    return {
        mkRole,
        mkStaff,

        mkUoM,
        mkUoMCategory,

        mkSupplier,
        mkSupplierCat,

        mkProduct,
        mkProductSupplierLine
    }
}


