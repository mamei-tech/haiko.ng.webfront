/* DATES & TIMES FUNCTIONS */
import appConfig from '@/configs/app.conf'

const gmtOffset = appConfig.server.utc_offset

/**
 * DT means date & time
 */
export default function useDates() {


    /**
     * Tries to figure a proper minimum date-time to be used in a 'datetime-local' input. e.g when pass times isn't a
     * valid option
     *
     * @param forceTomorrows Whe true, it will force +24hrs if method called starting from 21hrs (to close to tomorrow)
     */
    const minDateForInput = ( forceTomorrows: boolean = false ): string => {

        const now = new Date()                                             // getting teh current time

        if (forceTomorrows)
        {
            const offset = now.getHours() > 21 ? 2 : 1
            now.setDate(now.getDate() + offset)
        }

        const yy = now.getFullYear()                                       // getting teh date data so we can properly format it
        const mm = String(now.getMonth()).padStart(2, '0')
        const dd = String(now.getDay()).padStart(2, '0');
        const hh = forceTomorrows ? '00' : String(now.getHours()).padStart(2, '0');
        const mn = forceTomorrows ? '00' : String(now.getMinutes()).padStart(2, '0');

        return `${ yy }-${ mm }-${ dd }T${ hh }:${ mn }`                   // putting al together complaint with ISO 8601 format
    }

    /**
     * Convert the date object parameter, to a date string compatible with an HTML UI date / time input
     * @param d Date Javascript object to be converted to a string format
     */
    const date2UIStr = ( d: Date ) => {

        const now = new Date()                                             // getting teh current time
        const yy = now.getFullYear()                                       // getting teh date data so we can properly format it
        const mm = String(now.getMonth()).padStart(2, '0')
        const dd = String(now.getDay()).padStart(2, '0');
        const hh = String(now.getHours()).padStart(2, '0');
        const mn = String(now.getMinutes()).padStart(2, '0');

        return `${ yy }-${ mm }-${ dd }T${ hh }:${ mn }`                   // putting al together complaint with ISO 8601 format
    }

    /**
     * Using the defined GMT / UTC offset defined in the 'app.conf.ts' config file, this method applies that offset
     * for converting the given UTC date object to a localized (time-zone) one.
     *
     * @param utcDate
     */
    const toLocal = (utcDate: Date): Date => {
        utcDate.setHours(utcDate.getHours() + gmtOffset)
        return utcDate
    }

    return {
        toLocal,
        date2UIStr,
        minDateForInput,
    }
}
