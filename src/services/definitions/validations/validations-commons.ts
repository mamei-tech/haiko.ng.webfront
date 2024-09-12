import { i18n } from '@/services/i18n'
import useCommon from '@/services/composables/useCommon'
import { regex, required, min, max, email, integer, min_value, max_value } from '@vee-validate/rules'

// https://github.com/logaretm/vee-validate/issues/2297

const { t } = i18n.global
const { isUndOrEmptyStr } = useCommon()

/** Just permit words with just letters and spaces. Not allows spaces at the end.
 * The value hast to end with letters.
 */
export const regOnlyAlphaNOSpacesCaps: RegExp = /^([A-Z|À-ÿ])+$/
export const regOnlyAlphaNOSpaces: RegExp = /^([a-z|A-Z|À-ÿ])+$/
export const regAlphaNHyphens: RegExp = /^([a-z|A-Z|À-ÿ]+([-|_]){0,1})+[a-z|A-Z|À-ÿ]$/
export const regAlphanumNHyphensLowerCaps: RegExp = /^([a-z|0-9]+([-|_]){0,1})+[a-z|0-9]$/
export const regAlphaNSpaces: RegExp = /^([a-z|A-Z|À-ÿ]+( ){0,1})+[a-z|A-Z|À-ÿ]$/
export const regOnlyAlphanumNSpaces: RegExp = /^([a-z|A-Z|À-ÿ|0-9]+( ){0,1})+[a-z|A-Z|À-ÿ|0-9]$/
export const regOnlyAlphanumNSpacesWithDots: RegExp = /^([a-z|A-Z|À-ÿ|0-9|\.]+( ){0,1})+[a-z|A-Z|À-ÿ|0-9|\.]$/
export const regOnlyAlphanumNSpacesWithDotsNHyphen: RegExp = /^([a-zA-ZÀ-ÿ0-9\._-]+( )?)+[a-zA-ZÀ-ÿ0-9_-](?!.*\.$)$/         // can takes dots but it can't finish with dots.
export const regOnlyAlphanumericNoSpaces: RegExp = /^[a-zA-ZÀ-ÿ]+(\d*[a-zA-ZÀ-ÿ]*)*$/
export const regWebSiteURL: RegExp = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+$/
export const regDecimalDotSeparator: RegExp = /^\d+\.?\d*$/
export const regHTMLColorNoAlpha: RegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/
export const regNumeric: RegExp = /^(\d)*(\.){0,1}(\d){1,2}$/           // integers and decimals (dot separator) with just two spaces eg. 100.25 or 100


/**
 * Only match with characters, numbers, underscores and dots, No spaces. Good for using against with nicknames or system usernames
 */
export const regAlphaUnderscoreNDots: RegExp = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9\._]*$/

/**
 * Strong password validation regex. Requirements are:
 * - at least two uppercase letters.
 * - at least one special case letter (!@#$&._*)
 * - at least two digits
 * - at least three lowercase letters
 * - length 8 minimum, 20 tops
 */
export const regStrongPassword: RegExp = /^(?=.*[A-ZÀ-ÿ].*[A-ZÀ-ÿ])(?=.*[!@#$&._*])(?=.*[0-9].*[0-9])(?=.*[a-zÀ-ÿ].*[a-zÀ-ÿ].*[a-zÀ-ÿ]).{8,20}$/    // https://stackoverflow.com/questions/5142103/regex-to-validate-password-strength

//region ======== COMMON VALIDATIONS FIELDS RULES =======================================

export const VSchemaCommon = {

    username: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!regex(value, { regex: regAlphaUnderscoreNDots })) return t('validation.only-alpha-digits-underscore-dots')
        if (!min(value, { length: 4 })) return t('validation.min-length', { length: 4 })
        if (!max(value, { length: 26 })) return t('validation.max-length', { length: 30 })

        return true
    },

    firstName: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        if (!regex(value, { regex: regAlphaNSpaces })) return t('validation.only-alpha-spaces')
        if (!min(value, { length: 3 })) return t('validation.min-length', { length: 3 })
        if (!max(value, { length: 30 })) return t('validation.max-length', { length: 30 })

        return true
    },

    lastName: ( value: string ): boolean | string => {
        if (!regex(value, { regex: regAlphaNSpaces })) return t('validation.only-alpha-spaces')
        if (!min(value, { length: 5 })) return t('validation.min-length', { length: 5 })
        if (!max(value, { length: 30 })) return t('validation.max-length', { length: 30 })
        return true
    },

    cell: ( value: string, isThisRequired: boolean = true ): boolean | string => {
        if (isThisRequired && !required(value)) return t('validation.required')
        if (!integer(value)) return t('validation.cellphone')
        if (!min(value, { length: 7 })) return t('validation.min-length', { length: 7 })
        if (!max(value, { length: 10 })) return t('validation.max-length', { length: 10 })

        return true
    },

    email: ( value: string ): boolean | string => {
        if (!max(value, { length: 100 })) return t('validation.max-length', { length: 100 })
        if (!email(value)) return t('validation.email')
        return true
    },

    phone:         ( value: string, isThisRequired: boolean = false, validationInstance: any ): boolean | string => {
        if (!integer(value)) return t('validation.cellphone')
        if (!min(value, { length: 7 })) return t('validation.min-length', { length: 7 })
        if (!max(value, { length: 10 })) return t('validation.max-length', { length: 10 })

        if (!isUndOrEmptyStr(validationInstance.form.cell))
            if (validationInstance.form.cell === value) return t('validation.same-phone')

        return true
    },

    /**
     * Intent to be used in any field for a simple 'required' check
     * @param value
     */
    justARequiredField: ( value: string ): boolean | string => {
        if (!required(value)) return t('validation.required')
        return true
    },

    /**
     * Common Name validation when no space is needed
     * allowed: regAlphaUnderscoreNDots       Underscore and dots allowed
     *
     * @param value str to be validated
     * @param minLength minimum string length allowed
     * @param maxLength maximum string length allowed
     * @param isThisRequired tell if the field value need to be present mandatory
     * @param cregex Custom regular expression to be matched up
     * @param cregexMsg Custom regular expression message to show if cregex don't match with the given value
     */
    nameValidation: (
                        value: string,
                        minLength = 4,
                        maxLength = 20,
                        isThisRequired: boolean = true,
                        cregex: RegExp = regAlphaUnderscoreNDots,
                        cregexMsg: string = t('validation.only-alpha-digits-underscore-dots')

                    ): boolean | string => {
        if (isThisRequired && !required(value)) return t('validation.required')
        if (!regex(value, { regex: cregex })) return cregexMsg
        if (!min(value, { length: minLength })) return t('validation.min-length', { length: minLength })
        if (!max(value, { length: maxLength })) return t('validation.max-length', { length: maxLength })

        return true
    },

    /**
     * A common description or note field validation
     * allowed: regOnlyAlphanumNSpaces
     *
     * @param value str to be validated
     * @param minLength minimum string length allowed
     * @param maxLength maximum string length allowed
     * @param isThisRequired tell if the field value need to be present mandatory
     */
    notes: ( value: string, minLength = 4, maxLength = 80, isThisRequired: boolean = true ): boolean | string => {
        if (isThisRequired && !required(value)) return t('validation.required')

        // FIXME this here, creates some sort of regex performance malfunction, seems related to the size of the string when increase, commenting this for now
        // if (!regex(value, { regex: regOnlyAlphanumNSpacesWithDots })) return t('validation.only-alpha-digits-spaces')

        if (!min(value, { length: minLength })) return t('validation.min-length', { length: minLength })
        if (!max(value, { length: maxLength })) return t('validation.max-length', { length: maxLength })

        return true
    },

    /**
     * This is a custom numerical validation function
     *
     * @param value target value to b validated
     * @param minVal allowed minimum value
     * @param maxVal allowed maximum value
     * @param int tells if we must validate it as integer (true) o as a decimal number
     * @param isThisRequired tells if the field / property is required
     */
    numerical:  ( value: string, minVal = 0, maxVal = 500000000, int: boolean = false, isThisRequired: boolean = true ): boolean | string => {
        if (!isThisRequired && (+value == 0 || value == undefined)) return true
        if (isThisRequired && !required(value)) return t('validation.required')

        if (int)
            if (!regex(value, { regex: regNumeric })) return t('validation.only-positive-numbers')     // eg. 100.25 or 100
        else
            if (!integer(value)) return t('validation.only-integers')

        if (!min_value(value, { min: minVal })) return t('validation.min-value', { value: minVal })
        if (!max_value(value, { max: maxVal })) return t('validation.max-value', { value: maxVal })

        return true
    }
}

//endregion =============================================================================

