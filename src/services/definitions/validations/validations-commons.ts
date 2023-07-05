import { i18n } from '@/services/i18n'
import { regex, required, min, max, email, integer } from '@vee-validate/rules'

// https://github.com/logaretm/vee-validate/issues/2297

const { t } = i18n.global

/** Just permit words with just letters and spaces. Not allows spaces at the end.
 * The value hast to end with letters.
 */
export const regAlphaNSpaces: RegExp = /^([a-z|A-Z|À-ÿ]+( ){0,1})+[a-z|A-Z|À-ÿ]$/
export const regOnlyAlphanumericAndSpaces: RegExp = /^([a-z|A-Z|À-ÿ|0-9]+( ){0,1})+[a-z|A-Z|À-ÿ|0-9]( )*$/
export const regOnlyAlphanumericAndSpacesWithDots: RegExp = /^([a-z|A-Z|À-ÿ|0-9|\.]+( ){0,1})+[a-z|A-Z|À-ÿ|0-9|\.]( )*$/
export const regOnlyAlphanumericNoSpaces: RegExp = /^[a-zA-ZÀ-ÿ]+(\d*[a-zA-ZÀ-ÿ]*)*$/
export const regWebSiteURL: RegExp = /^(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+(?:\.[a-zA-Z]+)+$/
export const regDecimalDotSeparator: RegExp = /^\d+\.?\d*$/
export const regHTMLColorNoAlpha: RegExp = /^#(?:[0-9a-fA-F]{3}){1,2}$/

/**
 * Only match with characters, numbers, underscores and dots, No spaces. Good for using against with nicknames or system usernames
 */
export const regAlphaDigitsUnderscoreNDots: RegExp = /^[a-zA-ZÀ-ÿ][a-zA-ZÀ-ÿ0-9._]*$/

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
        if (!regex(value, { regex: regAlphaDigitsUnderscoreNDots })) return t('validation.only-alpha-digits-underscore-dots')
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
     * allowed: regAlphaDigitsUnderscoreNDots       Underscore and dots allowed
     *
     * @param value str to be validated
     * @param minLength minimum string length allowed
     * @param maxLength maximum string length allowed
     * @param isThisRequired tell if the field value need to be present mandatory
     */
    nameNoSpaceValidation: ( value: string, minLength = 4, maxLength = 20, isThisRequired: boolean = true ): boolean | string => {
        if (isThisRequired && !required(value)) return t('validation.required')
        if (!regex(value, { regex: regAlphaDigitsUnderscoreNDots })) return t('validation.only-alpha-digits-underscore-dots')
        if (!min(value, { length: minLength })) return t('validation.min-length', { length: minLength })
        if (!max(value, { length: maxLength })) return t('validation.max-length', { length: maxLength })

        return true
    },

    /**
     * A common description field validation
     * allowed: regOnlyAlphanumericAndSpaces
     *
     * @param value str to be validated
     * @param minLength minimum string length allowed
     * @param maxLength maximum string length allowed
     * @param isThisRequired tell if the field value need to be present mandatory
     */
    description: ( value: string, minLength = 4, maxLength = 80, isThisRequired: boolean = true ): boolean | string => {
        if (isThisRequired && !required(value)) return t('validation.required')
        if (!regex(value, { regex: regOnlyAlphanumericAndSpacesWithDots })) return t('validation.only-alpha-digits-spaces')
        if (!min(value, { length: minLength })) return t('validation.min-length', { length: minLength })
        if (!max(value, { length: maxLength })) return t('validation.max-length', { length: maxLength })

        return true
    }
}

//endregion =============================================================================

