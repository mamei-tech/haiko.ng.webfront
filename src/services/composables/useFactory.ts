import type {
    IDtoUoM,
    IDtoRole,
    IDtoStaff,
    IDtoProduct,
    IDtoSupplier,
    IDtoWarehouse,
    IDtoSupplierCat,
    IDtoUoMCategory,
    IDtoStrgCategory,
    IStrgCatProdLine,
    IDtoProductSupplierL
} from '@/services/definitions'
import { STRG_PROD_POLICY } from '@/services/definitions'


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
     * When this is used in form mode, the form need to manage a list of UoM that some of it may not exist, the workaround is to work with temporally Id
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
            uType:       -1,
            uCategoryId: uomCatId
        }
    }

    /**
     * Factory method to create an empty Product Supplier Line
     * When this is used in form mode, the form need to manage a list of Supplier for the product in question,
     * the workaround is to work with temporally Id for the list of Suppliers so we allow to pass the row identifier to
     * this method.
     *
     * @param supplierLineId row entity (supplier line in this case) identifier / index. Its just a local / front identifier for a index purpose, so it can be identified on the supplierLine array
     */
    const mkProductSupplierLine = ( supplierLineId: number): IDtoProductSupplierL => {
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

            lResponsibleID: 0,
            weight:         undefined,
            volume:         undefined,
            preDay2Manuf:   undefined,

            supplierLines:     new Array<IDtoProductSupplierL>(),
            suppLinesToDelete: new Array<number>()
        }
    }

    const mkWarehouse = (): IDtoWarehouse => {
        return {
            id:     0,
            wName:  '',
            code:   '',
            suppID: ''
        }
    }

    const mkStrgCategory = (): IDtoStrgCategory => {
        return {
            id:             0,
            allowProdType:  STRG_PROD_POLICY.MIXED,
            sCatName:       '',
            wLocationCount: undefined,

            prodCapacityLine:     new Array<IStrgCatProdLine>(),
            prodCapacityToDelete: new Array<number>()
        }
    }

    const mkStrgCatProductLine = ( prodLineId: number, strgCatID: number ): IStrgCatProdLine => {
        return {
            id: prodLineId,
            strgCatID: strgCatID,
            productID: 0,

            maxCapacity: 0,
            uomLabel: '',
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
        mkProductSupplierLine,

        mkWarehouse,
        mkStrgCategory,
        mkStrgCatProductLine,
    }
}


