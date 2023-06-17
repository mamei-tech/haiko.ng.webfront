<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">

                <CmpCard :hasFormBackBtn="true" v-on:doClick="h_back">

                    <!-- FORM -->
                    <form class="form-horizontal">

                        <!-- id -->
                        <div class="row">
                            <div class="col-md-9">
                                <CmpBasicInput
                                        disabled
                                        placeholder="###########"
                                        name="id"
                                        type="hidden"
                                        v-model="iniFormData.id"
                                />
                            </div>
                        </div>

                        <div class="row">

                            <div class="col-xm-12 col-md-6">

                                <!-- supplier category name -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t("form.fields-common.firstname") }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.supplier-cat-name')"
                                                name="scName"
                                                type="text"
                                                v-model="iniFormData.sDescription"
                                        />
                                    </div>
                                </div>

                                <!-- supplier category description -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t( "data.description" ) }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                placeholder="..."
                                                name="sDescription"
                                                type="text"
                                                v-model="iniFormData.sDescription"
                                        />
                                    </div>
                                </div>

                            </div>

                            <div class="col-xm-12 col-md-6">

                                <!-- supplier category color -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t("data.color") }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('data.description')"
                                                name="scColor"
                                                type="color"
                                                v-model="iniFormData.scColor"
                                        />
                                    </div>
                                </div>

                            </div>

                        </div>
                    </form>

                    <!-- FORM ACTION BUTTONS -->
                    <template v-slot:footer>
                        <CmpFormActionsButton
                                :show-delete="cpt_fMode === 'edit'"
                                v-on:saveIntent="h_beforeSubmit"
                                v-on:deleteIntent="h_delete"
                                v-on:cancelIntent="h_back"
                        />
                    </template>
                </CmpCard>

            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useToast } from 'vue-toastification'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { ApiSupplier } from '@/services/api/api-supplier'
import { ACTION_KIND_STR, ENTITY_NAMES, FMODE, KEYS, OPS_KIND_STR, RoutePathNames } from '@/services/definitions'
import { VSchemaSupplierCat } from '@/services/definitions/validations/validations-suppliers'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton } from '@/components'

import type { ComputedRef } from 'vue'
import type { IDtoSupplierCat, TFormMode } from '@/services/definitions'
import { i18n } from '@/services/i18n'


export default defineComponent({
    name: 'ViewFormSuppCategories',
    components: {
        CmpCard,
        CmpBasicInput,
        CmpBaseButton,
        CmpCollapseItem,
        CmpBasicCheckbox,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global
        const route = useRoute()
        const router = useRouter()

        const { fmode, id } = route.params                                      // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        const toast = useToast()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()
        const { mkSupplierCat } = useFactory()

        const iniFormData = reactive<IDtoSupplierCat>(mkSupplierCat())          // initial form data
        let formDataFromServer: IDtoSupplierCat | undefined = undefined         // aux variable to save entity data requested from the server

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================

        /**
         * Vue hook before component is mounted in the DOM
         * If this view is called as edit mode rather than creation mode, we need to call the backend API
         * asking for the resource so we can populate the datatable
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(async () => {

            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                formDataFromServer = await ApiSupplier.getStaffById(+id)

                // setValues(formDataFromServer)
                resetForm( {
                    errors: {},
                    values: { ...formDataFromServer }
                })
            }

            // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
            window.addEventListener('keydown', h_keyboardKeyPress)
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
            window.removeEventListener('keydown', h_keyboardKeyPress)
        })
        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Action for edit the supplier category
         * @param editedSupplierCat object containing the edited information
         * @param doWeNeedToStay This value, in this context, tells if the clicked button was the 'Applied' or the 'Save'
         */
        const a_edit = ( editedSupplierCat: IDtoSupplierCat, doWeNeedToStay: boolean ): void => {

            ApiSupplier.reqUpdateSupplierCategory(editedSupplierCat)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.UPDATE, editedSupplierCat.scName)

                // so now what ?
                if(!doWeNeedToStay) h_back()                                  // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.UPDATE))
        }

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newSupplierCat payload with the data for the request
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newSupplierCat: IDtoSupplierCat, doWeNeedToStay: boolean) => {
             ApiSupplier.insertSupplierCat(newSupplierCat).then(() => {

                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.ADDITION, newSupplierCat.scName)

                // so now what ?
                if(!doWeNeedToStay) h_back()                                  // so we are going back to the data table
                else resetForm({ values: mkSupplierCat() })              // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.ADDITION))
        }

        /**
         * Request the deletion of a supplier category to the backend
         * @param catId Supplier category identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async (catId: number, ref: undefined | string = undefined ): Promise<void> => {

            ApiSupplier.reqDeleteSuppCat(catId)
            .then(( response: any ) => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.DELETION)
                h_back()
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.DELETION))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, setValues, setFieldValue, resetForm } = useForm<IDtoSupplierCat>({
            validationSchema: VSchemaSupplierCat,
            initialValues:    iniFormData,
            initialErrors:    undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
        //#endregion ==========================================================================

        //region ======== EVENTS HANDLERS & WATCHERS ==========================================

        /**
         * Handles the form submission event through the vee-validate 'SubmissionHandler' so we can take advantage of all
         * the its validation logic but using with own logic inserted as callback
         *
         * @param evt The DOM event coming from our Vue UI custom component (CmpFormActionsButton in this case)
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = ( evt: Event, doWeNeedToStay: boolean ) => {
            evt.preventDefault()

            // handling the submission with vee-validate method
            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) h_back()               // was no changes (no dirty) with the data, so going back normally
            }).call(this)
        }

        const h_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.supplierCat })
        }

        const h_delete = async ( evt: any ) => {

            if (fmode as TFormMode != FMODE.EDIT) return
            if (+id == 1) dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-default'))

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.SUPPLIER_CAT, '', t('dialogs.supp-cat-del-confirmation'))
            if (wasConfirmed) a_reqDelete(+id)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) h_back()                       // going back if SCAPE is pressed
        }


        //#endregion ==========================================================================

        return {
            iniFormData,

            cpt_fMode,

            h_back,
            h_delete,
            h_beforeSubmit,
            h_keyboardKeyPress
        }
    }

})
</script>

<style scoped>
</style>
