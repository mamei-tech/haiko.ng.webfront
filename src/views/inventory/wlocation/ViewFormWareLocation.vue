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
                  <CmpBasicInput
                      disabled
                      placeholder="###########"
                      name="id"
                      type="hidden"
                  />
                </div>
              </div>

              <div class="col-xm-12 col-md-6">

                <!-- lName -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.wlocation-name')"
                        name="lName"
                        type="text"
                    />
                  </div>
                </div>

                <!-- Warehouse Id -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.warehouse.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.wlocation-warehouse')"
                                         :options="st_nomenclatures.getWarehouses4Select"
                                         searchable
                                         name="warehouseID"
                                         class="mb-2"
                                         closeOnSelect
                                         v-on:changehapend="h_warehouseChange"
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

                <!-- Parent Location -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.wlocation.parent-id' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.wlocation-parent')"
                                         :options="st_nomenclatures.getWareLocations4Select"
                                         searchable
                                         name="parentID"
                                         class="mb-2"
                                         closeOnSelect
                                         ref="ref_selectWLocations"
                                         v-on:changehapend="h_parentLocChange"
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

                <!-- Storage Category -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'table-headers.category' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.wlocation-category')"
                                         :options="st_nomenclatures.getStrgCategories4Select"
                                         searchable
                                         name="strgCatID"
                                         class="mb-2"
                                         ref="ref_selectLocCategory"
                                         closeOnSelect
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

                <!-- Warehouse Location Type -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ cap($t( 'data.type' )) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.wlocation-type')"
                                         :options="wLocationTypes"
                                         searchable
                                         name="lType"
                                         class="mb-2"
                                         closeOnSelect
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

                <!-- status / is scrap location -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'data.status' ) }}
                  </label>
                  <div class="col-md-2">
                    <CmpVeeCheckbox name="isActive"
                                    :checked="values.isActive"
                                    :labels="[$t('others.available'), $t('others.unavailable')]"
                    />
                  </div>

                  <label class="text-sm-left text-md-right col-md-4 col-form-label">
                    {{ $t( 'entities.wlocation.is-scrap-location' ) }}
                  </label>
                  <div class="col-md-3">
                    <CmpVeeCheckbox name="isScrapLocation"
                                    :checked="values.isScrapLocation"
                                    :labels="[$t('btn.val-yes'), $t('btn.val-no')]"
                    />
                  </div>
                </div>

                <!-- lFullName -->
                <div v-if="cpt_fMode === 'edit'" class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.wlocation.full-name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        placeholder="..."
                        name="lFullName"
                        type="text"
                        disabled
                    />
                  </div>
                </div>

                <!-- notes -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.notes' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpTextInput
                        height="150"
                        name="lNotes"
                        type="text"
                    />
                  </div>
                </div>

              </div>

              <hr class="collapsable-form-section-divisor mt-4">

              <div class="col-lg-3 col-md-12 mt-2" v-for="(card, i) in statsDataCards" :key="card.id">
                <CmpCardStats :title="card.title"
                              :subTitle="card.subTitle"
                              :type="card.type"
                              :icon="card.icon"
                >

                  <template v-slot:footer>

                    <!-- jump cases -->
                    <div v-if="card.id === 1">
                      <a href="#" @click.prevent="h_statGoCheck(card.id)">
                        <i class="tim-icons icon-zoom-split"></i> {{ $t( 'form.fields-common.view-check' ) }}
                      </a>
                    </div>

                    <!-- change params cases -->
                    <div v-else-if="card.id === 2 || card.id === 3">
                      <a href="#" @click.prevent="h_changeStatsParams(card.id, 'pm')">
                        <i class="tim-icons icon-calendar-60"></i>
                        {{ $t( 'form.fields-common.month-pass-min' ) }}
                      </a>

                      <a href="#" @click.prevent="h_changeStatsParams(card.id, 'py')" class="ml-3">
                        <i class="tim-icons icon-chart-bar-32"></i>
                        {{ $t( 'form.fields-common.year-pass-min' ) }}
                      </a>

                      <a href="#" @click.prevent="h_changeStatsParams(card.id, 'cy')" class="ml-3">
                        <i class="tim-icons icon-chart-bar-32"></i>
                        {{ $t( 'form.fields-common.year-current-min' ) }}
                      </a>
                    </div>

                  </template>
                </CmpCardStats>
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
import { i18n } from '@/services/i18n'
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useForm } from 'vee-validate'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useCommon from '@/services/composables/useCommon'
import { ApiWareLocation } from '@/services/api/inventory/api-warelocation'
import {
    ENTITY_NAMES, FMODE,
    KEYS,
    OPS_KIND_STR,
    RoutePathNames,
    VSchemaWareLocation
} from '@/services/definitions'
import { CmpCardStats, CmpTextInput, CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton, CmpMultiselectField, CmpVeeCheckbox } from '@/components'

import type { ComputedRef } from 'vue'
import type { IDtoWareLocation, IWareLocationType, IMultiselectBasic, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormWareLocation',
    components: {
        CmpCard,
        CmpCardStats,
        CmpTextInput,
        CmpBasicInput,
        CmpBaseButton,
        CmpVeeCheckbox,
        CmpCollapseItem,
        CmpBasicCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const route = useRoute()
        const toast = useToast()                                        // The toast lib interface
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                  // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const { fmode, id } = route.params                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions
        const { mkWareLocation } = useFactory()
        const { cap } = useCommon()

        // getting the vee validate method to manipulate the form related actions from the view
        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, resetForm, setFieldValue, values } = useForm<IDtoWareLocation>({
            validationSchema: VSchemaWareLocation,
            initialValues:    mkWareLocation(),
            initialErrors:    undefined
        })

        // html references
        const ref_selectWLocations = ref<InstanceType<typeof CmpMultiselectField>>()        // reference to warehouse storage locations
        const ref_selectLocCategory = ref<InstanceType<typeof CmpMultiselectField>>()       // reference to warehouse storage category
        const statsDataCards = reactive([
            {
                id:       1,
                title:    `$ ${ values.stockValCurrent }`,
                subTitle: t('form.fields-common.cards.stock-value'),
                type:     values.stockValCurrent == undefined || values.stockValCurrent <= 0 ? 'danger' : 'success',
                icon:     'tim-icons icon-coins'
            },
            {
                id:       2,
                title:    `$ ${ values.stockValInCount }`,
                subTitle: t('form.fields-common.cards.stock-value-in'),
                type:     'info',
                icon:     'tim-icons icon-double-left'
            },
            {
                id:       3,
                title:    `$ ${ values.stockValOutCount }`,
                subTitle: t('form.fields-common.cards.stock-value-out'),
                type:     'info',
                icon:     'tim-icons icon-double-right'
            },
        ])
        const wLocationTypes: IMultiselectBasic[] = st_nomenclatures.wlocationsTypes.map(( wLocation: IWareLocationType ) => {
            return { value: wLocation.id, label: t(`entities.wlocation.types.${ wLocation.id }`) }
        })

        // helpers & flags
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

            st_nomenclatures.reqNmcWarehouses()
            .catch(err => tfyCRUDFail(err, t(`entities.${ENTITY_NAMES.WAREHOUSE}`), OPS_KIND_STR.REQUEST))

            st_nomenclatures.reqNmcStrgCategoriesM()
            .catch(err => tfyCRUDFail(err, t(`entities.${ENTITY_NAMES.STRGCATEGORY}`), OPS_KIND_STR.REQUEST))

            if (cpt_fMode.value === FMODE.CREATE as TFormMode) return

            let formDataFromServer: IDtoWareLocation | undefined = undefined
            try {
                await st_nomenclatures.reqNmcWareLocations()

                formDataFromServer = (await ApiWareLocation.reqLocationById(+id)).data as IDtoWareLocation
                if(formDataFromServer.id == undefined) return

                resetForm({
                    values: {
                        ...formDataFromServer,
                    },
                    errors: {}
                })
            }
            catch (err) {tfyCRUDFail(err, ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.REQUEST)}

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

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newLocation new Warehouse Storage Location to be created.
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newLocation: IDtoWareLocation, isFormDirty: boolean, doWeNeedToStay: boolean ): void => {
            hpr_sanitation(newLocation)

            // making the request
            ApiWareLocation.reqInsWareLocation(newLocation).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.ADDITION, newLocation.lName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()              // so we are going back to the data table
                else hpr_cleanForm()                        // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.ADDITION))
        }

        const a_edit = (updatedLocation: IDtoWareLocation, isFormDirty: boolean, doWeNeedToStay: boolean ): void => {
            hpr_sanitation(updatedLocation)

            // making the request
            ApiWareLocation.reqUpdateWareLocation(updatedLocation).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.UPDATE, updatedLocation.lName)

                // so now what ?
                if (!doWeNeedToStay) nav_back()            // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.WARELOCATION, OPS_KIND_STR.UPDATE))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        const hpr_sanitation = ( location: IDtoWareLocation ): void => {
            if (location.lNotes == undefined || location.lNotes.length == 0) delete location.lNotes

            delete location.created
            delete location.updated
            delete location.deleted

            delete location.lFullName

            delete location.pCount
            delete location.stockValCurrent
            delete location.stockValInCount
            delete location.stockValOutCount
        }

        /**
         * Restoring the warehouse storage locations
         */
        const hpr_clearStateSelect = () => {
            st_nomenclatures.wlocations = []

            if (!ref_selectWLocations.value) return

            ref_selectWLocations.value.clearSelection()
        }

        /**
         * Resetting the form
         */
        const hpr_cleanForm = (): void => {
            if (ref_selectWLocations.value) ref_selectWLocations.value.clearSelection()
            if (ref_selectLocCategory.value) ref_selectLocCategory.value.clearSelection()

            resetForm({
                values: mkWareLocation(),
                errors: undefined
            })
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
            evt.preventDefault()

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

        const h_warehouseChange = async (warehouseId: string): Promise<void> => {
            if (!warehouseId) {
                hpr_clearStateSelect()
                return
            }

            st_nomenclatures.reqNmcWareLocations()
            .catch(err => tfyCRUDFail(err, t(`entities.${ENTITY_NAMES.WARELOCATION}`), OPS_KIND_STR.REQUEST))
        }

        const h_parentLocChange = async (parentLocId: string): Promise<void> => {
            if (+parentLocId == 16 ) setFieldValue('isScrapLocation', true)         // 16 -> scrap location
            else setFieldValue('isScrapLocation', false)
        }

        /**
         * Go to an entity list (depends on the statistics card of the event) filtered by the current supplier
         * @param cardId card identifier
         */
        const h_statGoCheck = ( cardId: number ) => {
            // TODO implement this
            console.error('Not implemented', 'go check card' + cardId + ' filtered by suppliers')
        }

        /**
         * This will try to request the same statistics to the server but with different
         * params
         *
         * @param cardId card identifier
         * @param param
         */
        const h_changeStatsParams = ( cardId: number, param: string ): void => {
            // TODO implement this

            // meaning:
            // pm = past month | py = past year | cy = current year

            switch (param) {
                case 'pm':
                    console.error('implement _h_changeStatsParams_', cardId, param)
                    break
                case 'py':
                    console.error('implement _h_changeStatsParams_', cardId, param)
                    break
                case 'cy':
                    console.error('implement _h_changeStatsParams_', cardId, param)
                    break
            }
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.wlocationList });
        }

        //endregion ===========================================================================

        return {
            values,
            statsDataCards,
            wLocationTypes,

            cpt_fMode,
            st_nomenclatures,
            ref_selectWLocations,
            ref_selectLocCategory,

            cap,

            nav_back,

            h_delete,
            h_statGoCheck,
            h_beforeSubmit,
            h_warehouseChange,
            h_parentLocChange,
            h_keyboardKeyPress,
            h_changeStatsParams
        }
    }

})
</script>

<style scoped>
</style>
