import type { IIndexable } from '@/services/definitions'


/**
 * Category of the Units of Measurement
 */
export interface IDtoUoMCategory extends IIndexable {
    ucName: string,
    units: Array<IDtoUoM>
}

/**
 * Unit of Measurement Dto
 */
export interface IDtoUoM extends IIndexable {
    uName: string,
    uCategoryId: number,
    uType: number,
    uRatio: number,
    isActive: boolean
}
