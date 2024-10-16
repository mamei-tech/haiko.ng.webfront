
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
     * Recursively, map a javascript object to FormData interface. Eg to be used as a multipart/form-data HTTP request
     * ❗ When we know the Javascript object to be converted will have other nested objects or lists, we must uses this recursive method instead the normal 'toFormData' (written above).
     * If we use this method in those scenarios, the object should be converted properly to a FormData
     * @param object Any object that need to be mapped to a FormData
     */
    const toFormDataR = ( object: any, formData = new FormData(), parentKey = '' ) => {
        for (const key in object) {

            const value = object[ key ]                                         // saving the value for convenience
            const currentKey = parentKey ? `${ parentKey }[${ key }]` : key     // saving the curren key for convenience, concatenating with the parent so we are capable of mountain the classing HTML form data indentation

            if (object[ key ] !== null && typeof object[ key ] === 'object' && !(object[ key ] instanceof File))        // if the property is an object and not null, and not a File, we dive in recursively
                toFormDataR(object[ key ], formData, currentKey)
            else {
                if (Array.isArray(value))
                    for (let i = 0; i < value.length; i++) {
                        if (typeof value[ i ] === 'object' && value[ i ] !== null && !(value[ i ] instanceof File))     // similar situation again, if the property is an object and not null, and not a File, we dive in recursively
                            toFormDataR(value[ i ], formData, `${ currentKey }[${ i }]`)
                        else formData.append(`${ currentKey }[${ i }]`, value[ i ])                          // this case handle the js File type situation, need to add directly to the form data
                    }
                else formData.append(currentKey, value)
            }
        }
        return formData
    }

    /**
     * Debounce function for wait X milliseconds until callback
     *
     * @param func callback to be invoked pass 'wait' milliseconds
     * @param wait4 milliseconds to be waited until invoke callback function | default to 1 seconds = 1000 milliseconds
     */
     function debounce( func: Function, wait4: number = 1000 ): ( ...args: any[] ) => void {
        let timeoutId: any

        return function( this: any, ...args: any[] ) {
            const context = this

            clearTimeout(timeoutId)

            timeoutId = setTimeout(() => {
                func.apply(context, args)
            }, wait4)
        }
    }

    // simpler alternative with no context handling
    /*function debounce( callback: Function, wait: number ) {
        let timerId: any
        return ( ...args: any[] ) => {
            clearTimeout(timerId)
            timerId = setTimeout(() => {
                callback(...args)
            }, wait)
        }
    }*/

    /**
     * Just tell if the value is undefined
     * @param val value tu be check
     */
    const isUnd = (val: string | undefined | number | object) => {
        return val === undefined
    }

    /**
     * Return TRUE if the given string is 'undefined' or a empty string or has the zero value
     * @param val
     */
    const isUndEmpZero = (val: string | undefined | number | object) => {
        return val === undefined || val === '' || val === 0;
    }

    return {
        cap,
        toFormData,
        toFormDataR,

        debounce,

        isUnd,
        isUndEmpZero,
    }
}
