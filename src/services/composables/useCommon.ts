/* COMMON FUNCTIONS */

export default function useCommon () {

    /***
     * Capitalize the first letter of a string
     */
    const cap = (str: string): string => { return str.charAt(0).toUpperCase() + str.substring(1) }

    /**
     * Map a javascript object to FormData interface. Eg to be used as a multipart/form-data HTTP request
     * @param object Any object that need to be mapped to a FormData
     */
    const toFormData = ( object: any ) => Object.keys(object).reduce(( formData, key ) => {
        formData.append(key, object[ key ])
        return formData
    }, new FormData())

    /**
    * Round a number <n>, usig the specified decimal <places>
    */
    const roundTo = ( n: number, place: number ) => {
        return +(Math.round(+(n + 'e+' + place)) + 'e-' + place)
    }


    /**
     *  Convert the raw money (integer representation of the real money) as per is in the server, to a human
     *  readable form (user interface)
     *
     *  ❗ We are working with 100K conversion ratio in the raw money representation on the server.
     *
     * @param rawMoneyValue integer representation of the number (raw value)
     * @param rounding ❗ if this was true, the method will round up the decimal places instead of trunk it
     */
    const toUIMoney = ( rawMoneyValue: string, rounding: boolean = false ) => {
        if (rawMoneyValue === '0') return '0.00'
        if (rounding) {
            // Math.round(((rawMoneyValue/100000) + Number.EPSILON) * 100) / 100
            return roundTo((+rawMoneyValue / 100000), 2)
        }
        else {
            let integer = Math.floor(+rawMoneyValue / 100000)
            let floating = (+rawMoneyValue % 100000).toString().substring(0, 2)

            return integer + '.' + floating
        }
    }

    return {
        cap,
        roundTo,
        toUIMoney,
        toFormData,
    }
}
