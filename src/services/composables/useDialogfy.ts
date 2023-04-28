import { i18n } from '@/services/i18n'
//@ts-ignore               this is 'cause we are customizing the sweetalert2 scss, we don't need de original styles files
import Swal from 'sweetalert2/dist/sweetalert2.min.js'

import type { SweetAlertOptions, SweetAlertResult } from 'sweetalert2'
import type { TActionKind, EntityGenericNames } from '@/services/definitions'
import type { Function1 } from '@/services/definitions'


const { t } = i18n.global

export default function useDialogfy() {

    // Another alternative for using vue i18n ❗inside a setup
    // const { t } = useI18n({ useScope: 'global' })
    // import { useI18n } from 'vue-i18n'
    // see more here https://github.com/kazupon/vue-i18n/issues/276 | https://stackoverflow.com/questions/57049471/problem-to-use-vuei18n-outside-a-component | https://stackoverflow.com/questions/48238906/vue-project-tests-are-failing-when-i-added-vue-i18n-karma-mocha-phantomjs | https://stackoverflow.com/questions/57049471/problem-to-use-vuei18n-outside-a-component  |https://github.com/intlify/vue-i18n-next/tree/master/examples/composition

    /***
     * Basic dialog for a simple message.
     * @param txt The text for the dialog
     */
    const dfyBasicOKBtn = ( txt: string ): void => {
        Swal.fire({
            titleText:        txt,
            showDenyButton:   true,
            showCancelButton: true
        } as SweetAlertOptions)
    }

    const dfyShowAlert = ( title: string, txt: string ): void => {
        Swal.fire({
            titleText: title,
            text:      txt,
            icon:      'warning'
        } as SweetAlertOptions)
    }

    /***
     * Dialog for confirm a deletion, showing the confirm and decline buttons.
     * @param subject Subject or type of entity of the deletion operation.
     * @param target Target to be deleted.
     * @param callback Function callback to be call if the dialog was confirm
     * @param ref Subject Entity reference e.g identifier, name or something like that
     * @Deprecated Just a sample method. Don't use it.
     */
    const dfyDeleteConfirmations = (

        // TIP This was from another project, I think we are not using this

        subject: string,
        target: string,
        callback: Function1<string>,
        ref: undefined | string = undefined
    ): void => {
        let text = 'Are you sure you want to delete this catalog ?'

        if (ref !== undefined && typeof ref === 'string')
            text = `Are you sure you want to the delete the ${ ref } ?`

        Swal.fire({
            icon          : 'warning',
            titleText     : `${ subject } Deletion`,
            text          : text,
            showDenyButton: true
        } as SweetAlertOptions).then(( result: SweetAlertResult ) => {
            if (result.isConfirmed) callback(target)
        })
    }

    /**
     * Create a dialog from which to confirm an action
     * over the given target
     * @param action Kind of action to confirm. Eg. create, delete
     * @param subject The subject entity of the operation / action
     * @param ref Subject Entity reference e.g identifier, name or something like that
     * @param extraMsg Option string that can be used as extra information in the confirmation dialog
     * @param isBulk Tells if the call is for a plural subject (more than one). Eg. in bulk actions
     * @returns true if ok clicked, false otherwise
     */
    async function dfyConfirmation( action: TActionKind, subject: EntityGenericNames, ref: undefined | string = undefined, extraMsg:string = '', isBulk = false ): Promise<boolean> {

        let text = t('dialogs.confirmation', {
            action:  t(`crud-actions.${ action }`),
            plural:  isBulk ? t('others.this-ones') : '',                      // just for spanish by now
            subject: t(`entities.${ subject }.name`, {ref: ref})})

        if (extraMsg !== '')
            text = text + '. ' + extraMsg

        let result: SweetAlertResult = await Swal.fire({
            icon:           'warning',
            titleText:      t('dialogs.confirm'),
            text:           text,
            showDenyButton: true
        })

        return result.isConfirmed
    }

    return {

        dfyShowAlert,
        dfyBasicOKBtn,
        dfyDeleteConfirmations,
        dfyConfirmation

    }
}
