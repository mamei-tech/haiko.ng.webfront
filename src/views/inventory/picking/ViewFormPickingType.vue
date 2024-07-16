<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- FORM -->
          <form class="form">
            <div class="row">

              <!-- id -->
              <div class="row">
                <div class="col-md-9">
                  <CmpBaseInput disabled
                                 name="id"
                                 type="hidden"
                  />
                </div>
              </div>

              <div class="col-xm-12 col-md-6">

                <!-- tName -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.picking-type-name')"
                        name="tName"
                        type="text"
                    />
                  </div>
                </div>

                <!-- seqCode -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.seqcode' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.picking-seqcode')"
                        name="seqCode"
                        type="text"
                        style="text-transform:uppercase"
                    />
                  </div>
                </div>

                <!-- pCoreType -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-core')"
                                         :options="st_nomenclatures.getCorePickingType"
                                         searchable
                                         name="pCoreType"
                                         class="mb-2"
                                         closeOnSelect
                                         v-on:changehapend="h_coreTypeChange"
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

                <!-- locations => warehouseID / defSrcWLocationID / defDestWLocationID -->
                <div class="row mt-4">
                  <h5 class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t('table-headers.count-wlocations') }}
                  </h5>
                  <hr class="collapsable-form-section-divisor" style="padding-left: 50px">
                </div>
                  <div>

                    <!-- defSrcWLocationID -->
                    <div class="row">
                      <label class="text-sm-left text-md-right col-md-3 col-form-label">
                        {{ $t( 'entities.pickingtype.def-src-wlocation-id' ) }}
                        <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.pickingtype.tool-tips.default-src-loc')" />
                      </label>
                      <div class="col-md-9">
                        <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-wlocation-src')"
                                             :options="st_nomenclatures.getWareLocations4Select"
                                             searchable
                                             name="defSrcWLocationID"
                                             class="mb-2"
                                             closeOnSelect
                                             ref="ref_selectSrcWLocation"
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

                    <!-- defDestWLocationID -->
                    <div class="row">
                      <label class="text-sm-left text-md-right col-md-3 col-form-label">
                        {{ $t( 'entities.pickingtype.def-dest-wlocation-id' ) }}
                        <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.pickingtype.tool-tips.default-src-loc')" />
                      </label>
                      <div class="col-md-9">
                        <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-wlocation-des')"
                                             :options="st_nomenclatures.getWareLocations4Select"
                                             searchable
                                             name="defDestWLocationID"
                                             class="mb-2"
                                             closeOnSelect
                                             ref="ref_selectDestWLocation"
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

              <div class="col-xm-12 col-md-6">

                <!-- iName -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.iname' ) }}
                    <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.pickingtype.tool-tips.iname')" />
                  </label>
                  <div class="col-md-9">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.picking-type-iname')"
                        name="iName"
                        type="text"
                        style="text-transform:lowercase"
                    />
                  </div>
                </div>

                <!-- status / isActive -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'data.status' ) }}
                    <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.pickingtype.tool-tips.res-method')" />
                  </label>
                  <div class="col-md-9">
                    <CmpVeeCheckbox name="isActive"
                                    :checked="values.isActive"
                                    :labels="[$t('others.available'), $t('others.unavailable')]"
                    />
                  </div>
                </div>

                <!-- resMethod -->
                <div class="row" v-show="doWeNeed2ShowResMethod">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.res-method' ) }}
                    <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.pickingtype.tool-tips.res-method')" />
                  </label>
                  <div class="col-md-9">
                    <CmpBaseRadio inline
                                  id="resMethod"
                                  v-model="values.resMethod"
                                  :value="values.resMethod"
                                  :options="reservationOptions"
                                  @updated="h_reservationSelection"
                    />
                  </div>
                </div>

                <!-- resDaysBefore -->
                <div class="row mt-1" v-show="values.resMethod === RESERVATION_METHODS.BEFORE_SCHEDULE_DATE">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.res-days-before' ) }}
                    <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.pickingtype.tool-tips.res-days-before')" />
                  </label>
                  <div class="col-md-4">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.picking-type-days-before')"
                        name="resDaysBefore"
                        type="number"
                    />
                  </div>
                  <div class="col-md-5 mt-2">
                    <h5>{{ $t('form.placeholders.picking-type-days-before-info') }}</h5>
                  </div>
                </div>

                <!-- tColor -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'data.color' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBaseInput
                        :placeholder="$t('data.description')"
                        name="tColor"
                        type="color"
                    />
                  </div>
                </div>

              </div>

            </div>
          </form>

          <!-- FORM ACTION BUTTONS -->
          <template v-slot:footer>
            <CmpFormActionsButton
                :show-delete="cpt_fMode === FMODE.EDIT"
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
import { computed, defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useForm } from 'vee-validate'
import { i18n } from '@/services/i18n'
import { useRoute, useRouter } from 'vue-router'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useToast } from 'vue-toastification'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import { ApiPickingType } from '@/services/api/inventory/api-picking-type'
import { CORE_PICKING_TYPE, ENTITY_NAMES, FMODE, KEYS, OPS_KIND_STR, RESERVATION_METHODS, RoutePathNames, VSchemaPicking } from '@/services/definitions'
import { CmpBaseButton, CmpBaseCheckbox, CmpBaseInput, CmpBaseRadio, CmpCard, CmpCollapseItem, CmpFormActionsButton, CmpMultiselectField, CmpTooltip, CmpVeeCheckbox } from '@/components'

import type { ComputedRef } from 'vue'
import type { IDtoPickingType, IMultiselectBasic, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormPickingType',
    components: {
        CmpCard,
        CmpTooltip,
        CmpBaseRadio,
        CmpBaseInput,
        CmpBaseButton,
        CmpVeeCheckbox,
        CmpBaseCheckbox,
        CmpCollapseItem,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const route = useRoute()
        const toast = useToast()                                                             // The toast lib interface
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                                       // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const { fmode, id } = route.params                                                   // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        // html references
        const ref_selectWarehouse = ref<InstanceType<typeof CmpMultiselectField>>()          // reference to warehouse
        const ref_selectSrcWLocation = ref<InstanceType<typeof CmpMultiselectField>>()       // reference to warehouse storage source locations
        const ref_selectDestWLocation = ref<InstanceType<typeof CmpMultiselectField>>()      // reference to warehouse storage destination locations

        // helpers & flags
        const { mkPickType } = useFactory()
        const { tfyCRUDSuccess, tfyCRUDFail, tfyBasicWarning } = useToastify(toast)

        let noCheckTheSame: boolean = false
        let defaultStockLocSelectValue: IMultiselectBasic = { value: 0, label: '' }
        let defaultCustomerLocSelectValue: IMultiselectBasic = { value: 0, label: '' }
        let defaultSuppliersLocSelectValue: IMultiselectBasic = { value: 0, label: '' }

        // form data
        const doWeNeed2ShowResMethod = ref<boolean>(false);                            // do we need to show products reservations methods form fields ?
        const reservationOptions = [
            {
                value: RESERVATION_METHODS.AT_CONFIRMATION,
                text:  t(`entities.pickingtype.reservation-options.${ RESERVATION_METHODS.AT_CONFIRMATION }`)
            },
            {
                value: RESERVATION_METHODS.MANUALLY,
                text:  t(`entities.pickingtype.reservation-options.${ RESERVATION_METHODS.MANUALLY }`)
            },
            {
                value: RESERVATION_METHODS.BEFORE_SCHEDULE_DATE,
                text:  t(`entities.pickingtype.reservation-options.${ RESERVATION_METHODS.BEFORE_SCHEDULE_DATE }`)
            }
        ]

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

            st_nomenclatures.reqNmcWareLocations()
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.REQUEST))

            hpr_fillLoc4Select()

            if (cpt_fMode.value === FMODE.CREATE as TFormMode) return

            // ---- the following code is the edition conditional section

            let formDataFromServer: IDtoPickingType | undefined = undefined
            try {
                formDataFromServer = (await ApiPickingType.reqPickingTypeById(+id)).data as IDtoPickingType
                if(formDataFromServer.id == undefined) return

                resetForm({
                    values: { ...formDataFromServer },
                    errors: {}
                })
                // ref_selectWarehouse.value.setSelectedValue({value: formDataFromServer.warehouseID ?? 0, label: 'asda'})
            }
            catch (err) {tfyCRUDFail(err, ENTITY_NAMES.PICKINGTYPE, OPS_KIND_STR.REQUEST)}

            window.addEventListener('keydown', h_keyboardKeyPress)                                    // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                           // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newPickType new inventory picking type to be created.
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newPickType: IDtoPickingType, isFormDirty: boolean, doWeNeedToStay: boolean ): void => {
            hpr_sanitation(newPickType)

            // making the request
            ApiPickingType.reqInsPickingType(newPickType).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.PICKINGTYPE, OPS_KIND_STR.ADDITION, newPickType.tName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()              // so we are going back to the data table
                else hpr_cleanForm()                        // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.PICKINGTYPE, OPS_KIND_STR.ADDITION))
        }

        const a_edit = ( updatedPickType: IDtoPickingType, isFormDirty: boolean, doWeNeedToStay: boolean ): void => {
            hpr_sanitation(updatedPickType)

            // making the request
            ApiPickingType.reqUpdatePickingType(updatedPickType).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.PICKINGTYPE, OPS_KIND_STR.UPDATE, updatedPickType.tName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()              // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.PICKINGTYPE, OPS_KIND_STR.UPDATE))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, resetForm, setFieldValue, values } = useForm<IDtoPickingType>({
            validationSchema: VSchemaPicking,
            initialValues:    mkPickType(),
            initialErrors:    undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        const hpr_sanitation = ( pick: IDtoPickingType ): void => {
            pick.seqCode = pick.seqCode.toUpperCase()
            pick.iName = pick.seqCode.toLowerCase()

            if (pick.defSrcWLocationID == undefined) delete pick.defSrcWLocationID
            if (pick.defDestWLocationID == undefined) delete pick.defDestWLocationID
        }

        /**
         * Restoring the warehouse storage locations
         */
        const hpr_clearStateSelect = ( warehouseIncluded: boolean = false ) => {
            if (!ref_selectSrcWLocation.value) return
            if (!ref_selectDestWLocation.value) return

            ref_selectSrcWLocation.value.clearSelection()
            ref_selectDestWLocation.value.clearSelection()

            if(warehouseIncluded && ref_selectWarehouse.value !== undefined)
                ref_selectWarehouse.value.clearSelection()
        }

        const hpr_isLocationsValid = () => {
            return (values.defSrcWLocationID !== undefined && +values.defSrcWLocationID > 0)
                || (values.defDestWLocationID !== undefined && +values.defDestWLocationID > 0)
        }

        const hpr_cleanForm = () => {
            hpr_clearStateSelect(true)
            resetForm({
                values: mkPickType(),
                errors: undefined
            })
        }

        /**
         * Intents to fill default locations holders compliant with the select ui component value structure
         *
         * TIP this method is heavily dependable of the **default** location identifiers of the backend. So, if the seeder for the default location change the current orders of them, we have to update this method.
         *     Otherwise, this may malfunction the desired logic.
         */
        const hpr_fillLoc4Select = () => {

            st_nomenclatures.getWareLocations4Select.map(( selectValue: IMultiselectBasic ) => {
                if (selectValue.value == 4) defaultSuppliersLocSelectValue = selectValue
                if (selectValue.value == 5) defaultCustomerLocSelectValue = selectValue
                if (selectValue.value == 8) defaultStockLocSelectValue = selectValue
            })
        }

        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        // st_nomenclatures.reqNmcWareLocations()
        // .catch(err => tfyCRUDFail(err, ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.REQUEST))

        const h_coreTypeChange = ( type: CORE_PICKING_TYPE ) => {
            // type == CORE_PICKING_TYPE.INCOMING
            //     ? doWeNeed2ShowResMethod.value = false
            //     : doWeNeed2ShowResMethod.value = true

            if (ref_selectSrcWLocation.value === undefined || ref_selectDestWLocation.value === undefined) return

            if (type == CORE_PICKING_TYPE.INCOMING)
            {
                ref_selectSrcWLocation.value.setSelectedValue(defaultSuppliersLocSelectValue)
                ref_selectDestWLocation.value.setSelectedValue(defaultStockLocSelectValue)

                doWeNeed2ShowResMethod.value = false
                return
            }
            else if (type == CORE_PICKING_TYPE.OUTGOING)
            {
                ref_selectSrcWLocation.value.setSelectedValue(defaultStockLocSelectValue)
                ref_selectDestWLocation.value.setSelectedValue(defaultCustomerLocSelectValue)
            }
            else {
                ref_selectSrcWLocation.value.clearSelection()
                ref_selectDestWLocation.value.clearSelection()
            }

            doWeNeed2ShowResMethod.value = true
        }

        /**
         * We cant allow that the inventory warehouse locations be the same, so we check that when the selection
         * event happened in each inventory locations component
         */
        const h_checkNoSame = () => {

            if(ref_selectWarehouse.value && ref_selectWarehouse.value.getValue() == null) return                                // warehouse selection got cleared
            if (ref_selectSrcWLocation.value == undefined || ref_selectDestWLocation.value == undefined) return                 // are selectors not undefined

            if (+ref_selectSrcWLocation.value.getValue() >= 0 && +ref_selectDestWLocation.value.getValue() >= 0)                // have the values
                if (+ref_selectSrcWLocation.value.getValue() == +ref_selectDestWLocation.value.getValue()) {                    // are they the same value
                    if (ref_selectSrcWLocation.value.getValue() == null && ref_selectDestWLocation.value.getValue()) return     // yes they are the same, but are the same cuz both were cleared (null / no selection)

                    tfyBasicWarning(t('toasts.wlocs-cant-be-same'))
                    return false
                }

            return true
        }

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

            if(!h_checkNoSame()) return

            // validating we have at least one location selected, either source or destination location
            if(!hpr_isLocationsValid()) {
                tfyBasicWarning(t('toasts.wlocs-must-be-selected'))
                return
            }

            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, meta.value.dirty, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode)) a_edit(formData, meta.value.dirty, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()
            }).call(this)
        }

        const h_delete = async ( evt: any ) => {
            console.error('delete')
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        const h_reservationSelection = ( selection: RESERVATION_METHODS ) => {
            setFieldValue('resMethod', selection)
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.pickigtypeList });
        }

        //endregion ===========================================================================

        return {
            values,
            reservationOptions,
            doWeNeed2ShowResMethod,

            FMODE,

            cpt_fMode,
            st_nomenclatures,
            ref_selectWarehouse,
            ref_selectSrcWLocation,
            ref_selectDestWLocation,

            RESERVATION_METHODS,

            nav_back,

            h_delete,
            h_checkNoSame,
            h_beforeSubmit,
            h_coreTypeChange,
            h_keyboardKeyPress,
            h_reservationSelection,
        }
    }

})
</script>

<style scoped>
</style>
