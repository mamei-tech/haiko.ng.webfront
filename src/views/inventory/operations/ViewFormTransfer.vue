<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- FORM -->
          <form class="form-horizontal">
            <div class="row">

              <!-- id -->
              <div class="row">
                <div class="col-md-9">
                  <CmpBaseInput
                      disabled
                      placeholder="###########"
                      name="id"
                      type="hidden"
                  />
                </div>
              </div>

              <div class="col-xm-12 col-md-6">

                <!-- TODO check inventory_picking ContactId field 'fixme' (on backend) (migr_240412.1426_create_picking.sql file) -->
                <!-- Contact / Supplier -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.contact' ) }}
                    <CmpTooltip use-v-html is-form-label-mode :tip="$t('entities.transfer.tool-tips.contact')" />
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getSupplier4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="pFromSupplierId"
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

                <!-- PickingType -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getPickingTypes4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="pickingTypeId"
                                         class="mb-2"
                                         v-on:changehapend="h_adjustUIAcc2PT"
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

                <!-- Src location -->
                <div class="row" v-show="showSrcLoc">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.def-src-wlocation-id' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-wlocation-src')"
                                         :options="st_nomenclatures.getWareLocations4Select"
                                         searchable
                                         name="defSrcWLocationID"
                                         class="mb-2"
                                         closeOnSelect
                                         ref="ref_selectSrcLoc"
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

                <!-- Dest location -->
                <div class="row" v-show="showDesLoc">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.def-dest-wlocation-id' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-wlocation-des')"
                                         :options="st_nomenclatures.getWareLocations4Select"
                                         searchable
                                         name="defDestWLocationID"
                                         class="mb-2"
                                         closeOnSelect
                                         ref="ref_selectDstLoc"
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

              <div class="col-xm-12 col-md-6">
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
import { useRoute, useRouter } from 'vue-router'
import {
    KEYS,
    FMODE,
    OPS_KIND_STR,
    RoutePathNames,
} from '@/services/definitions'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useToast } from 'vue-toastification'
import { useForm } from 'vee-validate'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import { CmpCard, CmpFormActionsButton, CmpBaseInput, CmpCollapseItem, CmpBaseCheckbox, CmpBaseButton, CmpMultiselectField, CmpTooltip } from '@/components'

import type { ComputedRef } from 'vue'
import type { IDtoPickingNew, IMultiselectBasic, ById, } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormTransfer',
    components: {
        CmpCard,
        CmpTooltip,
        CmpBaseInput,
        CmpBaseButton,
        CmpCollapseItem,
        CmpBaseCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const route = useRoute()
        const toast = useToast()                                                        // The toast lib interface
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                                  // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const { fmode, id } = route.params                                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        // html references
        const showSrcLoc = ref<boolean>(true)
        const showDesLoc = ref<boolean>(true)
        const ref_selectSrcLoc = ref<InstanceType<typeof CmpMultiselectField>>()        // reference to warehouse default source location
        const ref_selectDstLoc = ref<InstanceType<typeof CmpMultiselectField>>()        // reference to warehouse default destination location

        // helpers & flags
        const { mkPicking } = useFactory()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)

        // form data
        // ...

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

            try {
                await st_nomenclatures.reqNmcWareLocations()
                await st_nomenclatures.reqNmcSuppliers()
                await st_nomenclatures.reqNmcPickingTypes()
            }
            catch (err) {tfyCRUDFail(err, 'entidades', OPS_KIND_STR.REQUEST)}

            window.addEventListener('keydown', h_keyboardKeyPress)                               // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                           // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })
        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================
        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        const { handleSubmit, values } = useForm<IDtoPickingNew>({
            // validationSchema: VSchemaWarehouse,
            initialValues: mkPicking(),
            initialErrors: undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Update the reactive values that defines if  UI select component related with inventory, needs to be shown
         *
         * @param showSrc Do we need to show inventory source location select UI control ?
         * @param showDst Do we need to show inventory destination location select UI control ?
         */
        const hpr_updLocVis = (showSrc:boolean = true, showDst:boolean = true) => {
            showSrcLoc.value = showSrc
            showDesLoc.value = showDst
        }

        /**
         * Helper. Auto Select Inventory Warehouse Locations.
         * According with the giving 'PickingType', this method auto select which inventory locations should be used
         * for the inventory transfer
         *
         * TIP this method is heavily dependable of the **default** location identifiers of the backend. So, if the seeder for the default location change the current orders of them, we have to update this method.
         *     Otherwise, this may malfunction the desired logic.
         *
         * @param ptId => picking type identifier | pickTypeId
         */
        const hpr_autoSetLoc = (ptId: number) => {

            // ---- settings things up
            const locsByIdMap = st_nomenclatures.getWareLocByIdMap                                                      // getting inventory warehouse locations mapped by its identifier
            const pickTypesByIdMap = st_nomenclatures.getPickingTypeByIdMap                                             // getting inventory picking types mapped by its identifier

            let sets: ById<IMultiselectBasic | string> = {}                                                             // sets of the selected locations

            const defStLocId = 8                                                                                        // default stock inventory location identifier
            const defStLocLabel = locsByIdMap[ defStLocId ].lFullName ?? ''                                             // default stock inventory location label

            const pickingType = pickTypesByIdMap[ptId]                                                                  // obtaining the picking type object according with the given identifier

            sets[ '2hide' ] = 'none'

            // ---- logic by each situation
            switch (ptId) {
                case 1:                             // receipts
                    sets[ 'src' ] = { value: 4, label: locsByIdMap[ 4 ].lFullName ?? '' }                           // assuming that defaults SUPPLIER location have '4' as database identifier
                    sets[ 'dst' ] = {
                        value: pickingType.defDestWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defDestWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    if (pickingType.defSrcWLocationID === undefined) sets['2hide'] = 'src'
                    break
                case 2:                             // delivery order
                    sets[ 'src' ] = {
                        value: pickingType.defSrcWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defSrcWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    sets[ 'dst' ] = { value: 5, label: locsByIdMap[ 5 ].lFullName ?? '' }                           // assuming that defaults CUSTOMER location have '5' as database identifier
                    if (pickingType.defDestWLocationID === undefined) sets['2hide'] = 'dst'
                    break
                case 6:                             // returns
                    sets[ 'src' ] = { value: 5, label: locsByIdMap[ 5 ].lFullName ?? '' }                           // assuming that defaults CUSTOMER location have '5' as database identifier
                    sets[ 'dst' ] = {
                        value: pickingType.defDestWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defDestWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    if (pickingType.defSrcWLocationID === undefined) sets['2hide'] = 'src'
                    break
                default:
                    // case 5                       // internal transfer
                    // case 9                       // manufacturing
                    // case 10                      // POS order
                    // case n
                    sets[ 'src' ] = {
                        value: pickingType.defSrcWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defSrcWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    sets[ 'dst' ] = {
                        value: pickingType.defDestWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defDestWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }

                    break
                // he we have to worry about case 1,2 and 6 'cause are the ones that could have one of the two involved inventory locations, set to null by default
            }

            return sets
        }

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
            console.error('submit')
        }

        const h_delete = async ( evt: any ) => {
            console.error('delete')
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        /**
         * Adjust some UI controls according to the selection of the picking type
         */
        const h_adjustUIAcc2PT = ( type: string ) => {

            if (ref_selectSrcLoc.value === undefined || ref_selectDstLoc.value === undefined) return
            if (type == null)
            {
                ref_selectSrcLoc.value.clearSelection()
                ref_selectDstLoc.value.clearSelection()
                hpr_updLocVis(true, true)
                return
            }

            const chosenLocations = hpr_autoSetLoc(+type)                                                               // getting the suggested inventory location for the picking type

            ref_selectSrcLoc.value.setSelectedValue(chosenLocations['src'] as IMultiselectBasic)                        // setting the source location
            ref_selectDstLoc.value.setSelectedValue(chosenLocations['dst'] as IMultiselectBasic)                        // setting the destination location

            if      (chosenLocations['2hide'] === 'src') hpr_updLocVis(false, true)
            else if (chosenLocations['2hide'] === 'dst') hpr_updLocVis(true, false)
            else                                         hpr_updLocVis(true, true)                     // 'none' case, so show both
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.invTransferList });
        }

        //endregion ===========================================================================

        return {
            values,

            FMODE,

            cpt_fMode,
            st_nomenclatures,

            showSrcLoc,
            showDesLoc,
            ref_selectSrcLoc,
            ref_selectDstLoc,

            nav_back,
            h_delete,
            h_beforeSubmit,
            h_adjustUIAcc2PT,
            h_keyboardKeyPress
        }
    }

})
</script>

<style scoped>
</style>
