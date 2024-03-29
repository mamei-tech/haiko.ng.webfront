<template>
  <transition appear name="page-fade">
    <div class="row">

      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- FORM -->
          <form class="form-horizontal">

            <!-- id -->
            <CmpBasicInput
                disabled
                placeholder="###########"
                name="id"
                type="hidden"
            />

            <div class="row">

              <div class="col-xm-12 col-md-12">

                <!-- Warehouse name  -->
                <div class="row">

                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.name' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.warehouse-name')"
                        name="wName"
                        type="text"
                    />
                  </div>

                  <!-- Warehouse code / short name / denomination -->
                  <label class="text-sm-left text-md-right col-md-1 col-form-label">
                    {{ $t( 'form.fields.warehouse.code' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.warehouse-code')"
                        name="code"
                        type="text"
                    />
                  </div>

                </div>

                <!-- Warehouse Address -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.address' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getSupplier4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="suppID"
                                         class="mb-2"
                    >

                      <!--option coming from slot child component ('slots props') [option] -->
                      <template #customOption="{option}">
                        {{ option.label }}
                      </template>

                      <!-- option coming from slot child component ('slots props') [value] -->
                      <template #customSingleLabel="{value}">
                        <div class="multiselect-placeholder">
                          {{ value.label }}
                        </div>
                      </template>

                    </CmpMultiselectField>
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
                v-on:cancelIntent="nav_back"
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
import { i18n } from '@/services/i18n'
import { useToast } from 'vue-toastification'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { ApiWarehouse } from '@/services/api/inventory/api-warehouse'
import {
    ACTION_KIND_STR,
    ENTITY_NAMES,
    FMODE,
    KEYS,
    OPS_KIND_STR,
    RoutePathNames,
    VSchemaWarehouse
} from '@/services/definitions'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton, CmpMultiselectField } from '@/components'

import type { ComputedRef } from 'vue'
import type { IDtoWarehouse, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormWarehouse',
    components: {
        CmpCard,
        CmpBasicInput,
        CmpBaseButton,
        CmpCollapseItem,
        CmpBasicCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const route = useRoute()
        const toast = useToast()                                                // The toast lib interface
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                          // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const { fmode, id } = route.params                                      // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        const { dfyConfirmation, dfyShowAlert } = useDialogfy()

        const { mkWarehouse } = useFactory()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)

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

            try {await st_nomenclatures.reqNmcSuppliers()}
            catch (err) {}

            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                try {
                    let formDataFromServer = (await ApiWarehouse.reqWarehouseById(+id)).data as IDtoWarehouse

                    // setValues(formDataFromServer)
                    resetForm({
                        errors: {},
                        values: { ...formDataFromServer }
                    })
                }
                catch (err) {}
            }

            window.addEventListener('keydown', h_keyboardKeyPress)                              // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newWarehouse payload with the data for the request
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newWarehouse: IDtoWarehouse, doWeNeedToStay: boolean ) => {

            ApiWarehouse.reqInsWarehouse(newWarehouse)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.ADDITION, newWarehouse.wName)

                // so now what ?
                if (!doWeNeedToStay) nav_back()                                             // so we are going back to the data table
                else resetForm({ values: mkWarehouse(), errors: undefined })           // so wee need to clean the entire form and stay in it

            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.ADDITION))
        }

        /**
         * Action for edit the Warehouse
         * @param editWarehouse object containing the edited information
         * @param doWeNeedToStay This value, in this context, tells if the clicked button was the 'Applied' or the 'Save'
         */
        const a_edit  = ( editWarehouse: IDtoWarehouse, doWeNeedToStay: boolean ): void => {

            ApiWarehouse.reqUpdateWarehouse(editWarehouse)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.UPDATE, editWarehouse.wName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()                                  // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.UPDATE))
        }

        /**
         * Request the deletion of a warehouse
         * @param warehouseId warehouse identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_delete = async (warehouseId: number, ref: undefined | string = undefined ): Promise<void> => {
            ApiWarehouse.reqDeleteWarehouse(warehouseId)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.DELETION, ref)
                nav_back()
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, setFieldValue, resetForm, values } = useForm<IDtoWarehouse>({
            validationSchema: VSchemaWarehouse,
            initialValues:    mkWarehouse(),
            initialErrors:    undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * This method tries to accommodate the data before it will be sent to the server
         * Handles the form submission event through the vee-validate 'SubmissionHandler' so we can take advantage of all
         * the its validation logic but using with own logic inserted as callback
         *
         * @param evt
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = (evt: Event, doWeNeedToStay: boolean) => {
            evt.preventDefault()

            // handling the submission with vee-validate method
            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()                                                  // was no changes (no dirty) with the data, so going back normally
            }).call(this)
        }

        const h_delete = async ( evt: any ) => {
            if (cpt_fMode.value !== FMODE.EDIT as TFormMode) return

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.WAREHOUSE, values.wName, t('dialogs.warehouse-remove-warning'))
            if(wasConfirmed) await a_delete (values.id, values.wName)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.warehouseList })
        }

        //endregion ===========================================================================

        return {
            values,

            cpt_fMode,
            st_nomenclatures,

            nav_back,

            h_delete,
            h_beforeSubmit,
            h_keyboardKeyPress
        }
    }

})
</script>

<style scoped>
</style>
