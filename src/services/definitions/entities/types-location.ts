import type { IIndexable } from '@/services/definitions'


/**
 * Define the very basic data of a country
 */
export interface ICountryBasic extends IIndexable {

    /**
     * country name
     */
    cName: string
    /**
     * international country code
     */
    code: string
}

/**
 * Define the very basic data of a country province / state
 */
export interface ICountryStatesBasic extends IIndexable {

    /**
     * country province / state name
     */
    sName: string
    /**
     * international country code
     */
    code: string
}
