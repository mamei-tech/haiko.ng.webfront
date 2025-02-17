/* DATES & TIMES FUNCTIONS */
import { i18n } from '@/services/i18n'
import appConfig from '@/configs/app.conf'

const { t } = i18n.global

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

        const mm = String(now.getMonth()+1).padStart(2, '0')
        const dd = String(now.getDate()).padStart(2, '0')           // no, isn't '.getDay'. That is for the day of the week
        const hh = String(now.getHours()).padStart(2, '0')
        const mn = String(now.getMinutes()).padStart(2, '0')

        return `${ yy }-${ mm }-${ dd }T${ hh }:${ mn }`                   // putting al together complaint with ISO 8601 format
    }

    /**
     * Calculates the time difference between the given date and the current time,
     * and returns a human-readable string indicating the elapsed or remaining time.
     *
     * The function supports both past and future dates. For past dates, it returns
     * the elapsed time (e.g., "2 days ago"). For future dates, it returns the
     * remaining time (e.g., "3 hours remaining"). If the difference is less than
     * a second, it returns "Just about now".
     *
     * @param {string} dateStr - The date string in ISO 8601 format (e.g., "YYYY-MM-DDTHH:MM:SS").
     * @returns {string} A human-readable string describing the time difference.
     *
     * @example
     * // Current date: 2023-10-03T12:00:00
     * strDate2Diff("2023-10-01T12:00:00"); // Returns "2 days ago"
     * strDate2Diff("2023-10-05T12:00:00"); // Returns "2 days remaining"
     * strDate2Diff("2023-10-03T12:00:01"); // Returns "1 second remaining"
     * strDate2Diff("2023-10-03T12:00:00"); // Returns "Just about now"
     */
    const strDate2Diff = ( dateStr: string ): string => {
        const now       = new Date()
        const givenDate = new Date(dateStr)

        const diff = givenDate.getTime() - now.getTime()                // the value of 'diff' will be in milliseconds

        const s = diff < 0                                              // s = seconds
            ? Math.floor(-diff / 1000)                               // time is behind (in the past)
            : Math.floor(diff / 1000)                                // future is ahead in the future
        const m = Math.floor(s / 60)                                 // m = minutes
        const h = Math.floor(m / 60)                                 // h = hours
        const d = Math.floor(h / 24)                                 // d = days

        const headI18nKey = diff < 0 ? 'data.elapsed-time' : 'data.remaining-time'

        if (d > 0)
            return t(headI18nKey, { value: d, kind: t('data.days') })
        else if (h > 0)
            return t(headI18nKey, { value: h, kind: t('data.hours') })
        else if (m > 0)
            return t(headI18nKey, { value: m, kind: t('data.minutes') })
        else if (s > 0)
            return t(headI18nKey, { value: s, kind: t('data.seconds') })
        else
            return t('data.just-about-now')
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
        strDate2Diff,
        minDateForInput,
    }
}
