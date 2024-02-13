/* NUMERIC FUNCTIONS */
import appConfig from '@/configs/app.conf'

export default function useNumeric () {


    /**
    * Round a number <n>, using the specified decimal <places>
    */
    const roundTo = ( n: number, place: number ) => {
        return +(Math.round(+(n + 'e+' + place)) + 'e-' + place)
    }

    /**
     *  Convert the raw money (integer representation of the real money) as per is in the server, to a human
     *  readable form (user interface)
     *
     *  ❗ We are working with appConfig.app.scale conversion ratio in the raw money representation on the server.
     *
     * @param rawMoneyValue integer representation of the number (raw value)
     * @param rounding ❗ if this was true, the method will round up the decimal places instead of trunk it
     */
    const toUIMoney = ( rawMoneyValue: string | number, rounding: boolean = false ) => {
        let scale = appConfig.app.scale

        if (rawMoneyValue === '0') return '0.00'
        if (rounding) {
            // Math.round(((rawMoneyValue/scale) + Number.EPSILON) * 100) / 100
            return roundTo((+rawMoneyValue / scale), 2)
        }
        else {
            let integer = Math.floor(+rawMoneyValue / scale)
            let floating = (+rawMoneyValue % scale).toString().substring(0, 2)

            return integer + '.' + floating
        }
    }

    /**
     * Convert a Q+ UI representation number like 250.00 to the raw integer representation of the same number
     * using the backend defined scale e.g 25000
     *
     * valUI2Raw = user interface value to raw
     *
     * @param val UI Q+ number representation
     */
    const valUI2Raw = ( val: string | undefined | number = '' ) => {
        if (val === undefined || val === '') return 0
        else if (+val === 0) return val
        else return (+val) * appConfig.app.scale
    }

    /**
     * Get the DateTime now in second
     * Returns the number of seconds elapsed since January 1, 1970 00:00:00 UTC.
     * @param mili if mili is set to true, then milliseconds will be used instead of seconds
     */
    const timeNow = ( mili = false ): number => {
        if (mili) return Date.now()

        return Math.floor(Date.now() / 1000)
    }

    return {
        roundTo,
        valUI2Raw,
        toUIMoney,

        timeNow,
    }
}
