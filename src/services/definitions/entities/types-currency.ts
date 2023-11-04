import type { IIndexable } from '@/services/definitions'

/**
 * Define the very basic data of a Currency entity
 */
export interface ICurrencyBasic extends IIndexable {

    /**
     * Currency denomination in letters (USD, CUP, RUP, etc). Should be complaint with the ISO code
     */
    cDenomination: string
}
