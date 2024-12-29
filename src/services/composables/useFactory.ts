import {
    INV_STATUS,
    ADDRESS_TYPE,
    SHIPPING_POL,
    WARE_LOC_TYPE,
    STRG_PROD_POLICY,
    CORE_PICKING_TYPE,
    RESERVATION_METHODS,
} from '@/services/definitions'
import useDates from '@/services/composables/useDates'
import type {
    IDtoUoM,
    IDtoMove,
    IDtoRole,
    IDtoStaff,
    IDtoPicking,
    IDtoProduct,
    IDtoSupplier,
    IDtoWarehouse,
    IDtoUoMCategory,
    IDtoPickingType,
    IDtoSupplierCat,
    IDtoStrgCategory,
    IStrgCatProdLine,
    IDtoWareLocation,
    IDtoProductSupplierL,
} from '@/services/definitions'
import {  } from '@/services/definitions/entities/types-move'


const { date2UIStr } = useDates()

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
            uType:       '',
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
            pName:          '',
            internalNotes:  undefined,
            suppCategoryID: '',
            parentID:       '',

            email:       undefined,
            phone:       undefined,
            cell:        '',
            website:     undefined,
            jobPosition: undefined,
            street:      undefined,
            city:        undefined,
            countryCode: undefined,
            stateCode:   undefined,
            zip:         undefined,

            isCompany: false,
            isActive:  true,

            pCount:              0,
            purchasesCountPend:  0,
            purchasesCountTotal: 0,
            purchasesCountValue: 0,

            cmpDisplayName: undefined,
            pType:          undefined,

            extData: []
        }
    }

    /** Extended version
     */
    const mkSupplierExt = (): IDtoSupplier => {
        return {
            ...mkSupplier(),
            pType: ADDRESS_TYPE.OTHER
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
            suppID: '',
            suppAddressID: ''
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

    const mkStrgCatProductLine = ( prodLineId: number = 0, strgCatID: number ): IStrgCatProdLine => {
        return {
            id: prodLineId,
            strgCatID: strgCatID,
            productID: 0,

            maxCapacity: 0,
            uomLabel: '',
        }
    }

    const mkWareLocation = (): IDtoWareLocation => {
        return {
            id: 0,

            lName:     '',
            lFullName: '',
            lType:     WARE_LOC_TYPE.INTERNAL,
            lNotes:    undefined,

            warehouseID: 0,
            parentID:    0,
            strgCatID:   0,

            isActive:        true,
            isScrapLocation: false,

            pCount:           0,
            stockValInCount:  0,
            stockValOutCount: 0,
            stockValCurrent:  0,

            created: undefined,
            updated: undefined,
            deleted: undefined
        }
    }

    const mkPickType = (): IDtoPickingType => {
        return {
            id: 0,

            tName:     '',
            iName:     '',
            seqCode:   '',
            pCoreType: CORE_PICKING_TYPE.EMPTY,
            isActive:  true,
            tColor:    '#000000',

            resMethod:     RESERVATION_METHODS.AT_CONFIRMATION,
            resDaysBefore: undefined,

            defSrcWLocationID:  0,
            defDestWLocationID: 0
        }
    }

    const mkPicking = (): IDtoPicking => {
        return {
            id:                  0,
            contactId:           0,
            pickingType:         0,
            pSrcWareLocationId:  0,
            pDestWareLocationId: 0,
            pSrcDocument:        undefined,
            pScheduleDate:       date2UIStr(new Date()),
            pShippingPolicy:     SHIPPING_POL.DIRECT,
            pResponsibleId:      2,                     // #2 (at the moment ot writing this) is 'The Manager' on database
            pNotes:              undefined,

            moves:               new Array<IDtoMove>(),

            //-- IDtoPickingBase props

            pickName: undefined,
            state:    INV_STATUS.DRAFT
        }
    }

    /**
     * Factory for the creation of an inventory picking move line
     * Remember that 'transfer' and 'picking' in the inventory context, are the same thing
     *
     * @param moveId -> object identifier. When the line is new, the index will be negative 'cause obviously the object doesn't exist on the system yet. Check 'h_intentMoveCreate' on the ViewFormTransfer.vue file
     * @param dsd -> means default schedule date
     */
    const mkPickingMoveLine = ( moveId: number = 0, dsd: Date | string | undefined = undefined ): IDtoMove => {
        return {
            id:              moveId,

            mDeadLineDate:   undefined,
            mScheduleDate:   dsd,

            mUoMId:          0,
            moveDescription: '',

            mProdId:         0,
            prodUoMQty:      0,

            moveName:        undefined
        }
    }

    //#endregion ==========================================================================

    return {
        mkRole,
        mkStaff,

        mkUoM,
        mkUoMCategory,

        mkSupplier,
        mkSupplierExt,
        mkSupplierCat,

        mkProduct,
        mkProductSupplierLine,
        mkPickingMoveLine,

        mkWarehouse,
        mkWareLocation,

        mkStrgCategory,                 // warehouse storage location category
        mkStrgCatProductLine,

        mkPicking,
        mkPickType,
    }
}
