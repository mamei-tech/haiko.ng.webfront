<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="h_back">

          <!-- FORM -->
          <form class="form">
            <div class="row">

              <div class="col-xm-12 col-md-6">
                <!-- id -->
                <div class="row">
                  <div class="col-md-9">
                    <CmpBasicInput
                        disabled
                        placeholder="###########"
                        name="id"
                        type="hidden"
                    />
                  </div>
                </div>

                <!-- ucName -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.uomcatetgory.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.uom-cat-ucname')"
                        name="ucName"
                        type="text"
                    />
                  </div>
                </div>

              </div>
            </div>

            <!-- uom list -->
            <div class="row">
              <div class="col-12">
                <CmpDataTable table-type="hover"
                              :action-bar-mode="abar_mode"
                              :action-btn-mode="abutton_mode"

                              :columns="columns"
                              :data="values.units"

                              :has-actions="true"
                              :has-top-btn-bar="true"
                              :has-page-size-selector="false"
                              :has-search="false"

                              @deleteIntent="h_intentRowDelete"
                              @navCreateIntent="h_intentUoMCreate"
                              @cellUpdateIntent="h_updateCell"

                              @enableIntent="h_intentToggleEnable"
                              @disableIntent="h_intentToggleDisable"
                >
                </CmpDataTable>
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
import { computed, onBeforeUnmount, ref } from 'vue'
import { onMounted, defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpBaseButton, CmpDataTable } from '@/components'
import { useSt_UoM } from '@/stores/uom'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import {
    ENTITY_NAMES, DT_ACTIONBAR_MODE,
    FMODE,
    KEYS, OPS_KIND_STR,
    RoutePathNames, DT_ACTION_BUTTON_MODE,
    HUoMTable, ACTION_KIND_STR, VSchemaUoMCat
} from '@/services/definitions'
import { i18n } from '@/services/i18n'

import type { ComputedRef } from 'vue'
import type { IDtoUoMCategory, IDtoUoM, TFormMode, ICellUpdate } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormUoM',
    components: {
        CmpCard,
        CmpDataTable,
        CmpBasicInput,
        CmpBaseButton,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                           // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JDEL              // datatable button mode
        const columns = HUoMTable                                                           // entity customized datatable header

        const route = useRoute()
        const router = useRouter()

        const toast = useToast()                                                            // the toast lib interface
        const st_uom = useSt_UoM()                                                          // Pinia store for uom
        const { tfyCRUDSuccess, tfyError, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()

        const { fmode, id } = route.params                                                  // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions
        const { mkUoMCategory, mkUoM } = useFactory()

        /**
         * An ID counter auxiliary var for the UoM rows of the table when the creation mode is on. We need that the UoM rows has it own temporal identifier for proper data update when child component emit cell update intents
         * ❗ An important thing, we use negative values so we can diferenciate new associations from the existing ones in edition mode
         */
        const auxIdCounter = ref<number>(-1)

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
                const uomCat = st_uom.entityPage.find(uc => uc.id === +id)        // getting the uom cat from pinia store

                // it is needed here 'cause we keep two collection of the list of uom
                // ❗❗❗ we have to use the spread operator here to prevent the array of units it's being copied by reference, and reflect the changes in the store
                if (uomCat != undefined) resetForm({
                        values: { ...uomCat, units: uomCat.units, unitsToDelete: uomCat.unitsToDelete },                // this is so the form does not appear as dirty also, this will sync the 'units' && 'unitsToDelete' fields with 'iniFormData.value.units' and 'iniFormData.value.unitsToDelete' respectively. As javascript pass the values as reference hhttps://vee-validate.logaretm.com/v4/guide/components/handling-forms/ | resetting the form
                        errors: {}
                    })
            }

            window.addEventListener('keydown', h_keyboardKeyPress)                              // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newUoMCategory new uom category to be
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newUoMCategory: IDtoUoMCategory, isFormDirty: boolean, doWeNeedToStay: boolean): void => {
            // little bit sanitization for the negative number Id of the uom, so the backed doesn't protest about the negative Id
            newUoMCategory.units = newUoMCategory.units.map(( uom ) => {
                if (uom.id < 0) uom.id = 0
                return uom
            })

            // making the request
            st_uom.reqInsertUoMCat(newUoMCategory).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.ADDITION, newUoMCategory.ucName)

                // so now what ?
                if(!doWeNeedToStay) h_back()        // so we are going back to the data table
                else hpr_cleanForm()                    // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.ADDITION))
        }

        const a_edit = ( updatedUoMCategory: IDtoUoMCategory, isFormDirty: boolean, doWeNeedToStay: boolean): void => {
            // little bit sanitization for the negative number Id of the uom, so the backed doesn't protest about the negative Id
            updatedUoMCategory.units = updatedUoMCategory.units.map(( uom ) => {
                if (uom.id < 0) uom.id = 0
                return uom
            })

            st_uom.reqUpdUoMCat(updatedUoMCategory).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.UPDATE, updatedUoMCategory.ucName)

                // so now what ?
                if (!doWeNeedToStay) h_back()               // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.UPDATE))
        }

        /**
         * Request the deletion (from server) of an entity according with the given identifier
         *
         * @param id UoM category identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async ( id: number, ref: undefined | string = undefined ): Promise<void> => {

            st_uom.reqUoMCatDeletion(id)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.DELETION, ref)
                h_back()
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, resetForm, setFieldValue, values } = useForm<IDtoUoMCategory>({
            validationSchema: VSchemaUoMCat,
            initialValues:    mkUoMCategory(),
            initialErrors:    undefined
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Update the collection of the UoM object from the initial form value
         *
         * @param data UoM data to be updated in the collection
         */
        const hpr_updateUoMInList = ( data: ICellUpdate ) => {

            values.units = values.units.map(( row: IDtoUoM ) => {
                if (row.id === data.entityId)
                    row[ data.entityField as keyof IDtoUoM ] = data.updatedValue as never

                return row
            })
        }

        /**
         * Runs a set of validations related with the UoM of reference in the category / collection
         * If the set of validations isn't successful, the the submit event doesn't go any further.
         */
        const hpr_isUoMListValid = (): boolean => {

            let uoReference = undefined
            let uoReferenceCount = 0
            let uoReferenceRatio = -1
            let uoReferenceActiveStatus = false
            let errorMsg = undefined

            values.units.forEach((uom) => {
                if (uom.uType == 0) {
                    uoReference = uom.uName
                    uoReferenceCount += 1
                    uoReferenceRatio = uom.uRatio
                    uoReferenceActiveStatus = uom.isActive
                }
            })

            if (values.units.length == 0) errorMsg = t('validation.uom-list-min')
            else if (uoReference === undefined) errorMsg = t('validation.uom-list-ref-exist')
            else if (!uoReferenceActiveStatus) errorMsg = t('validation.uom-list-active')
            else if (uoReferenceCount >= 2) errorMsg = t('validation.uom-list-one-ref')
            else if (uoReferenceRatio != 1) errorMsg = t('validation.uom-list-ratio-ref')

            // so far so good
            if (errorMsg === undefined) return true

            tfyError(errorMsg)
            return false
        }

        /**
         * Resetting the form
         */
        const hpr_cleanForm = (): void => {
            resetForm({ values: mkUoMCategory() })
        }

        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * This method tries to accommodate the data before it will be sent to the server
         * Handles the form submission event through the vee-validate 'SubmissionHandler' so we can take advantage of all
         * the its validation logic but using with own logic inserted as callback
         *
         * @param evt HTML event
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = (evt: Event, doWeNeedToStay: boolean) => {
            evt.preventDefault()

            // validating the uom list first
            if(!hpr_isUoMListValid()) return

            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, meta.value.dirty, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode)) a_edit(formData, meta.value.dirty, doWeNeedToStay)
                // if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) h_back()
            }).call(this)
        }

        const h_keyboardKeyPress = (evt: any) => {
            if(evt.key === KEYS.ESCAPE) h_back()                       // going back if SCAPE is pressed
        }

        /**
         * Locally, add a empty UoM in the collection so the UI can react / reflect the changes.
         * This method allows to add new UoM to the UoM Category
         */
        const h_intentUoMCreate = async () => {
            values.units.push(mkUoM(auxIdCounter.value, cpt_fMode.value === FMODE.CREATE ? 0 : +id))
            auxIdCounter.value -= 1
        }

        /**
         * Its jobs its to maintain sync the user changes in the table of UoM an the local store data of UoM
         * @param data
         */
        const h_updateCell = (data: ICellUpdate) => {
            hpr_updateUoMInList(data)
        }

        const h_intentToggleEnable = (id: number) => {
            hpr_updateUoMInList({ entityId: id, entityField: 'isActive', updatedValue: true })
        }

        const h_intentToggleDisable = (id: number) => {
            hpr_updateUoMInList({ entityId: id, entityField: 'isActive', updatedValue: false })
        }

        const h_intentRowDelete = ( rowId: number ) => {
            values.units = values.units.filter((row) => {
                if(row.id !== rowId) return row
                if(row.id === rowId && rowId > 0 && cpt_fMode.value === FMODE.EDIT) values.unitsToDelete.push(rowId)

                // this las condition tries to handle the situation of the edit form mode, that we need to record a UoM
                // that already exist in the database and the user want to deleted. So we write down the UoM's identifier
            })
        }

        const h_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.munits });
        }

        const h_delete = async ( evt: any ) => {
            // we don't allow to delete the default categories, so we proceed only for above the 6th uom category
            if (+id > 6) {

                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.UOMCATEGORY, '', t('dialogs.uomcat-del-confirmation'))
                if (wasConfirmed) a_reqDelete(+id, '')
            }
            else dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-default'))          // telling the user
        }

        //endregion ===========================================================================

        return {
            values,

            abar_mode,
            abutton_mode,

            columns,
            cpt_fMode,

            h_back,
            h_delete,
            h_updateCell,
            h_beforeSubmit,
            h_intentUoMCreate,
            h_intentRowDelete,
            h_intentToggleEnable,
            h_intentToggleDisable,
        }
    }
})
</script>
