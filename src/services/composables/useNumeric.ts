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
        timeNow
    }
}
