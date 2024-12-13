<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <template v-slot:card-actionbar>

            <!-- inventory process status -->
            <CmpFormTStatus :state="values.state"></CmpFormTStatus>

          </template>

          <!-- FORM -->
          <form class="form-horizontal">

            <!-- id -->
            <CmpBaseInput
                disabled
                placeholder="###########"
                name="id"
                type="hidden"
            />

            <!-- main fields -->
            <div class="row">
              <div class="col-xm-12 col-md-6">

                <!-- contact -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ ls_contactLabel }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getSupplier4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="contactId"
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

                <!-- pickingType / operation type / transfer type / movement -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getPickingTypes4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="pickingType"
                                         class="mb-2"
                                         v-on:changehapend="h_UIPickingTypeAdjustment"
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

                <!-- src location -->
                <div class="row" v-show="showSrcLoc">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.def-src-wlocation-id' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-wlocation-src')"
                                         :options="st_nomenclatures.getWareLocations4Select"
                                         searchable
                                         name="pSrcWareLocationId"
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

                <!-- dest location -->
                <div class="row" v-show="showDesLoc">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.pickingtype.def-dest-wlocation-id' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.picking-type-wlocation-des')"
                                         :options="st_nomenclatures.getWareLocations4Select"
                                         searchable
                                         name="pDestWareLocationId"
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

                <!-- source document reference -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.transfer.src-doc' ) }}
                    <CmpTooltip is-form-label-mode :tip="$t( 'entities.transfer.tool-tips.src-doc' )" />
                  </label>
                  <div class="col-md-9">
                    <CmpBaseInput
                        placeholder="e.g. PO321"
                        name="pSrcDocument"
                        type="text"
                    />
                  </div>
                </div>

                <!-- schedule date -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.scheduled-date' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBaseDateTime
                        name="pScheduleDate"
                        :placeholder="$t('form.placeholders.picking-src-doc')"
                        :type="INPUT_DATE_TYPE.DATETIME_LOCAL"
                    />
                  </div>
                </div>

              </div>
            </div>

            <!-- tabs form section -->
            <hr class="collapsable-form-section-divisor mt-4">
            <div class="row mt-5">

              <!-- tabs | nav pills -->
              <div class="col-md-2">
                <ul role="tablist" class="nav nav-pills nav-pills-default flex-column">
                  <CmpTab v-for="tab in tabs"
                          :key="tab.title"
                          :title="tab.title"
                          :activeTabId="activeTabId"
                          :tabId="tab.id"
                          @tab-change="h_tabChange"
                  />
                </ul>
              </div>

              <!-- tabs content -->
              <div class="tab-content col-md-10">
                <template v-for="tab in tabs" :key="'tc'+tab.title">

                  <CmpTabContent :tabId="tab.id" :id="tab.title" :activeTabId="activeTabId">

                    <!-- TAB operations / products picks -->
                    <template v-if="tab.id === 1">

                      <!-- picking - move relationship -->
                        <div class="row mr-1 ml-1" style="justify-content: center">
                          <CmpDataTable table-type="hover"
                                        :action-bar-mode="abar_mode"
                                        :action-btn-mode="abutton_mode"

                                        :columns="columns"
                                        :data="values.moveLines"

                                        :has-search="false"
                                        :has-actions="true"
                                        :has-top-btn-bar="true"
                                        :has-pagination="false"
                                        :has-page-size-selector="false"

                                        @deleteIntent="h_intentRowDelete"
                                        @cellUpdateIntent="h_intentUpdCell"
                                        @navCreateIntent="h_intentMoveCreate"

                                        @selectFieldOpened="h_dtSelectOpened"
                                        @selectFieldSearch="h_prodSelectSearch"
                          >
                          </CmpDataTable>
                      </div>
                    </template>

                    <!-- TAB options -->
                    <template v-if="tab.id === 2">
                      <div class="row">

                        <!-- left col -->
                        <div class="col-mx-12 col-md-6">

                          <!-- shipping policy -->
                          <div class="row">
                            <label class="text-sm-left text-md-right col-md-3 col-form-label">
                              {{ $t('entities.transfer.shipping-policy') }}
                              <CmpTooltip is-form-label-mode
                                          :tip="$t('entities.transfer.tool-tips.shipping')" />
                            </label>
                            <div class="col-md-9">
                              <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                                   :options="st_nomenclatures.getShipPol4Select"
                                                   :searchable="true"
                                                   closeOnSelect
                                                   name="pShippingPolicy"
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

                          <!-- responsible -->
                          <div class="row">
                            <label class="text-sm-left text-md-right col-md-3 col-form-label">
                              {{ $t( 'entities.product.logistic-responsible' ) }}
                              <CmpTooltip is-form-label-mode
                                          :tip="$t('entities.product.tool-tips.logistic-responsible')" />
                            </label>
                            <div class="col-md-9">
                              <CmpMultiselectField :placeholder="$t('form.placeholders.staffs').toLowerCase()"
                                                   :options="st_nomenclatures.getStaffs4Select"
                                                   searchable
                                                   name="pResponsibleId"
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

                        <!-- right col -->
                        <div class="col-mx-12 col-md-6">
                        </div>

                      </div>
                    </template>

                    <!-- TAB notes -->
                    <template v-if="tab.id === 3">
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields-common.notes-alt' ) }}
                        </label>
                        <div class="col-md-9">
                          <CmpTextInput height="150" name="pNotes" type="text" />
                        </div>
                      </div>
                    </template>

                  </CmpTabContent>

                </template>
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
import { i18n } from '@/services/i18n'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import {
    KEYS,
    FMODE,
    ENTITY_NAMES,
    OPS_KIND_STR,
    INPUT_DATE_TYPE,
    HPickingMove,
    RoutePathNames,
    VSchemaPicking, DT_ACTIONBAR_MODE, DT_ACTION_BUTTON_MODE
} from '@/services/definitions'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useForm } from 'vee-validate'
import useFactory from '@/services/composables/useFactory'
import useDates from '@/services/composables/useDates'
import useToastify from '@/services/composables/useToastify'
import useCommon from '@/services/composables/useCommon'
import { ApiPicking } from '@/services/api/inventory/api-picking'
import { CmpCard, CmpFormActionsButton, CmpBaseInput, CmpCollapseItem, CmpBaseCheckbox, CmpBaseButton, CmpMultiselectField, CmpTooltip, CmpTab, CmpTabContent, CmpTextInput, CmpFormTStatus, CmpBaseDateTime, CmpDataTable } from '@/components'

import type  Multiselect  from '@vueform/multiselect'
import type { ComputedRef } from 'vue'
import type { IDtoPicking, IMultiselectBasic, ById, TFormMode, IColumnHeader, ICellUpdate, IDtoMoveLine } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormTransfer',
    components: {
        CmpTab,
        CmpCard,
        CmpTooltip,
        CmpDataTable,
        CmpTextInput,
        CmpBaseInput,
        CmpTabContent,
        CmpBaseButton,
        CmpFormTStatus,
        CmpBaseDateTime,
        CmpCollapseItem,
        CmpBaseCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                      // MOVE datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JDEL         // MOVE datatable rows buttons mode

        const route  = useRoute()
        const toast  = useToast()                                                       // The toast lib interface
        const router = useRouter()

        const columns = ref<Partial<IColumnHeader>[]>(HPickingMove)                     // picking specification properties

        const st_nomenclatures = useSt_Nomenclatures()                                  // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const { fmode, id } = route.params                                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        const { mkPickingMoveLine } = useFactory()

        // html references
        const isCloning        = ref(false)                                       // tells is we are in a cloning process so we call the creat endpoint instead the edition endpoint
        const showSrcLoc       = ref<boolean>(true)
        const showDesLoc       = ref<boolean>(true)
        const ref_selectSrcLoc = ref<InstanceType<typeof CmpMultiselectField>>()        // reference to warehouse default source location
        const ref_selectDstLoc = ref<InstanceType<typeof CmpMultiselectField>>()        // reference to warehouse default destination location

        // helpers & flags
        const { mkPicking }                             = useFactory()
        const { toLocal }                               = useDates()
        const { debounce, isUndEmpZero, isUndOrZero }   = useCommon()
        const { tfyCRUDSuccess, tfyCRUDFail, tfyError } = useToastify(toast)
        const flg_lastRowIndex                          = ref<number | undefined>(undefined)

        // form data
        const ls_uomCache = ref<IMultiselectBasic[]>([])
        const ls_productCache = ref<IMultiselectBasic[]>([])
        const ls_contactLabel = ref<string>(t('form.fields-common.contact'))

        /**
         * An ID counter auxiliary var for the PickingMove Line rows of the table when the creation mode is on. We need that 'cause ProductSupplier rows most have it own temporal identifier for proper data update when child component emit cell update intents
         * ❗ An important thing, we use negative values so we can diferenciate this from the existing PickingMove Line in edition mode
         */
        const auxIdCounter  = ref<number>(-1)
        const activeTabId   = ref<number>(1)
        const tabs          = ref<Array<{ id: number, title: string }>>(
            [
                { id: 1, title: t('form.fields-common.ops') },
                { id: 2, title: t('form.fields-common.options') },
                { id: 3, title: t('form.fields-common.notes') }
            ]
        )

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
                await st_nomenclatures.reqNmcStaff()
                await st_nomenclatures.reqNmcWareLocations()
                await st_nomenclatures.reqNmcSuppliers()
                await st_nomenclatures.reqNmcPickingTypes()
            }
            catch (err) {tfyCRUDFail(err, 'entidades', OPS_KIND_STR.REQUEST)}
            // FIXME i18n need it in 'entities'

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

        const a_create = (newTransfer: IDtoPicking, doWeNeedToStay: boolean) => {

            hpr_sanitation(newTransfer)

            ApiPicking.reqDraftTransfer(newTransfer).then (() => {
                tfyCRUDSuccess(ENTITY_NAMES.PICKING, OPS_KIND_STR.ADDITION)

                // so now what ?
                if (!doWeNeedToStay) nav_back()
                else hpr_clearState()

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.PICKING, OPS_KIND_STR.ADDITION))
        }

        const a_edit = (newTransfer: IDtoPicking, doWeNeedToStay: boolean) => {
            console.warn('editing is pending')
        }

        const a_delete = (transferId: number, ref: undefined | string = undefined) => {
            console.warn('editing is pending')
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        const { handleSubmit, values, meta, setFieldValue } = useForm<IDtoPicking>({
            validationSchema: VSchemaPicking,
            initialValues: mkPicking(),
            initialErrors: undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Helps to validate the transfer 'move lines' data given by the user. If something is wrong this method should
         * return false
         *
         * @param moves Dirty 'IDtoMoveLine' object to be validated
         */
        const hpr_isMoveLinesValid = ( moves: Array<IDtoMoveLine> ): boolean => {
            for (let i = 0; i < moves.length; i++)
                if (!isUndEmpZero(moves[ i ].mProdId) && +moves[ i ].prodUoMQty <= 0) {
                    tfyError(t('validation.move-line-prod-qty'))
                    return false
                }

            return true
        }

        /**
         * Form data sanitation method so we can clean the fields values before submitting
         * @param dirtyObj formulary data 'Picking' object
         */
        const hpr_sanitation = (dirtyObj: IDtoPicking) => {

            if (cpt_fMode.value === FMODE.CREATE)
                dirtyObj.moveLines = dirtyObj.moveLines.map(( move: IDtoMoveLine ) => {                                 // sanitizing the id in creation mode, se the backend don't panic
                    if (move.id < 0) move.id = 0
                    move.prodUoMQty = +move.prodUoMQty
                    delete move.mDeadLineDate

                    return move
                })

            if (cpt_fMode.value === FMODE.EDIT) return

            dirtyObj.pScheduleDate = dirtyObj.pScheduleDate == undefined
                ? toLocal(new Date())
                : toLocal(new Date(dirtyObj.pScheduleDate))

            delete dirtyObj.state
            delete dirtyObj.pickName

            // ---- move lines sanitation
            dirtyObj.moveLines = dirtyObj.moveLines.filter(move => move.mProdId ?? 0 > 0)                               // all the line that doesn't have product will be removed
            //@ts-ignore
            if(dirtyObj.moveLines.length == 0) delete dirtyObj.moveLines
        }

        /**
         * Restoring, cleaning some formulary data, so it will be refreshed and be used again for a new entity
         */
        const hpr_clearState = () => {
            // TODO this is pending to implement
        }

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
         * for the inventory transfer.
         *
         * Also this method intents to adjust the 'Contact' label according to the
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

            // ---- logic by each situation                                                                             // we have to worry only about case 1,2, 6 and 10 'cause are the ones that could have one of the two involved inventory locations, set to null by default
            switch (ptId) {
                case 1:                             // receipts
                    ls_contactLabel.value = t('entities.transfer.conditionals-labels.receipts-type')
                    sets[ 'src' ] = { value: 4, label: locsByIdMap[ 4 ].lFullName ?? '' }                               // assuming that defaults SUPPLIER location have '4' as database identifier
                    sets[ 'dst' ] = {
                        value: pickingType.defDestWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defDestWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    if (isUndEmpZero(pickingType.defSrcWLocationID)) sets['2hide'] = 'src'
                    break
                case 2:                             // delivery order & POS order
                case 10:
                    ls_contactLabel.value = t('entities.transfer.conditionals-labels.pos-order')
                    sets[ 'src' ] = {
                        value: pickingType.defSrcWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defSrcWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    sets[ 'dst' ] = { value: 5, label: locsByIdMap[ 5 ].lFullName ?? '' }                               // assuming that defaults CUSTOMER location have '5' as database identifier
                    // if (isUndEmpZero(pickingType.defDestWLocationID)) sets['2hide'] = 'dst'
                    sets['2hide'] = 'dst'                                                                               // whe I added the 10 (PoSOrder) case, I understand that showing the control not make any sense 'causes in both case we must enforce the use of the default value for the both picking types, even with the 2 (Delivery). so the user can't change the destination value
                    break
                case 6:                             // returns
                    ls_contactLabel.value = t('entities.transfer.conditionals-labels.receipts-type')
                    sets[ 'src' ] = { value: 5, label: locsByIdMap[ 5 ].lFullName ?? '' }                               // assuming that defaults CUSTOMER location have '5' as database identifier
                    sets[ 'dst' ] = {
                        value: pickingType.defDestWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defDestWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    if (isUndEmpZero(pickingType.defSrcWLocationID)) sets['2hide'] = 'src'
                    break
                default:
                    // case 5                       // internal transfer
                    // case 9                       // manufacturing
                    // case n                       // custom picking type. it has been made by system users
                    ls_contactLabel.value = t('form.fields-common.contact')
                    sets[ 'src' ] = {
                        value: pickingType.defSrcWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defSrcWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    sets[ 'dst' ] = {
                        value: pickingType.defDestWLocationID ?? defStLocId,
                        label: locsByIdMap[ pickingType.defDestWLocationID ?? defStLocId ].lFullName ?? defStLocLabel
                    }
                    break
            }

            return sets
        }

        /**
         * Select Event Manager. Handles the changes and the opened event, made in the datatable select ui controls
         *
         * @param objField Then name (navigation key in Partial<IColumnHeader> definitions) of the objet field
         * (column header)
         * @param queryStr If a user write something in the component (> 3 character), the character will be sent to
         * the handlers as user query string
         * @param rowIndex index of the row in the table, so we can identify which one is the record the user click on
         */
        const hrp_SelectEvMgr = async ( objField: string, queryStr: string | null = null, rowIndex: number | undefined = undefined ) => {

            if(isUndEmpZero(objField)) return
            if(objField == 'mProdId' as keyof IDtoMoveLine) {                                                           // we'll try to cache the product list so we can used every time without any more request, unless a query are written in the select by the user (in that case we make a request no matter what)

                if(queryStr !== null) {

                    await st_nomenclatures.reqNmcProdUoM(queryStr)                                                      // requesting products data
                    columns.value[ 1 ].cellEditableSelectOptions = st_nomenclatures.getProdUoM4Select
                }
                else if (ls_productCache.value.length == 0) {                                                           // we don't have cache yet, so we request the product list and create the cache

                    await st_nomenclatures.reqNmcProdUoM()                                                              // requesting products data and make a cache for it, that will be used as default (no query) dataset
                    ls_productCache.value = st_nomenclatures.getProdUoM4Select
                    columns.value[ 1 ].cellEditableSelectOptions = ls_productCache.value
                }
                else columns.value[ 1 ].cellEditableSelectOptions = ls_productCache.value                               // using the cache
            }
            if(objField == 'mUoMId' as keyof IDtoMoveLine)                                                              // besides the auto select we have for the UoM when product are selected (see lines around 812), here we are filtering the entire UoM list with only the UoM that belongs to the same category to the UoM product is defined to use
            {
                // TODO check how this behave in edition mode
                const movement = values.moveLines.find(m => m.id == rowIndex)
                if (
                    movement !== undefined                &&
                    movement.mUoMId > 0                   &&
                    flg_lastRowIndex.value !== rowIndex
                )  {
                    flg_lastRowIndex.value = rowIndex
                    st_nomenclatures.reqNmcUoMSameCat(movement.mUoMId).then(() => {
                        columns.value[ 5 ].cellEditableSelectOptions = st_nomenclatures.getUoM4Select                   // then we populate the UoMs options in the select, bringing the data from the server according to the uom category of the product. Only the uom within the same category will be retrieved
                    })
                }
            }
        }

        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        const h_tabChange = ( tabId: number ) => {
            activeTabId.value = tabId
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

            if (!hpr_isMoveLinesValid(values.moveLines)) return

            // handling the submission with vee-validate method
            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && isCloning.value && meta.value.dirty) console.log('pending cloning mode')      // TODO pending cloning mode
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !isCloning.value && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()
            }).call(this)
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
        const h_UIPickingTypeAdjustment = ( type: string ) => {

            if (isUndEmpZero(ref_selectSrcLoc.value) || isUndEmpZero(ref_selectDstLoc.value)) return
            if (type == null)
            {
                ref_selectSrcLoc.value?.clearSelection()
                ref_selectDstLoc.value?.clearSelection()
                hpr_updLocVis(true, true)
                return
            }

            const chosenLocations = hpr_autoSetLoc(+type)                                                               // getting the suggested inventory location for the picking type

            ref_selectSrcLoc.value?.setSelectedValue(chosenLocations['src'] as IMultiselectBasic)                       // setting the source location
            ref_selectDstLoc.value?.setSelectedValue(chosenLocations['dst'] as IMultiselectBasic)                       // setting the destination location

            if      (chosenLocations['2hide'] === 'src') hpr_updLocVis(false, true)
            else if (chosenLocations['2hide'] === 'dst') hpr_updLocVis(true, false)
            else                                         hpr_updLocVis(true, true)                     // 'none' case, so show both
        }

        const h_intentMoveCreate = async () => {
            if (!values.moveLines) return

            if (ls_uomCache.value.length == 0) {                                                                        // getting the uom in advance so we can auto set the UoM for the movement-line when product is selected
                await st_nomenclatures.reqNmcUoM()
                ls_uomCache.value = st_nomenclatures.getUoM4Select
            }
            columns.value[ 5 ].cellEditableSelectOptions = ls_uomCache.value                                            // ensuring the UoM options are ready, so values can react / reflects properly

            values.moveLines.push(mkPickingMoveLine(auxIdCounter.value, values.pScheduleDate))
            auxIdCounter.value -= 1
        }

        const h_intentUpdCell = ( data: ICellUpdate ) => {

            setFieldValue('moveLines', values.moveLines.map(( row: IDtoMoveLine ) => {
                if (row.id !== data.entityId) return row
                row[ data.entityField as keyof IDtoMoveLine ] = data.updatedValue as never                              // updating the value

                if (data.entityField == 'mProdId' as keyof IDtoMoveLine) {

                    flg_lastRowIndex.value = undefined

                    if (+data.updatedValue == 0)                                                                        // so we can handles the case when the select value was cleared
                    {
                        row['mUoMId' as keyof IDtoMoveLine] = +data.updatedValue as never                               // clearing the auto selected uom
                        return row                                                                                      // breaking right here
                    }

                    const p = st_nomenclatures.getProdUoMByIdMap[+data.updatedValue]                                    // getting the selected product data, from the store (that should has the previously fetched product data)
                    if (!isUndOrZero(+p.pUoMID))
                    {
                        columns.value[ 5 ].cellEditableSelectOptions = ls_uomCache.value                                // ensuring the UoM options are ready, so values can react / reflects properly
                        row['mUoMId' as keyof IDtoMoveLine] = +p.pUoMID as never                                        // if product were selected, we can also set the UoM for that product
                        row['moveName' as keyof IDtoMoveLine] = p.pName as never                                        // setting also the name of the product as name of the movement
                    }

                    return row
                }
                else return row
            }))
        }

        const h_intentRowDelete = ( rowId: number ) => {
            console.error('not implemented yet')
        }

        /**
         * dt = means datatable, so handler for datatable select when opened
         */
        const h_dtSelectOpened = ( selectInstance: Multiselect | any ) => {
            const s = selectInstance.name.split('.')
            s[ 1 ] == 'mUoMId' as keyof IDtoMoveLine
                ? hrp_SelectEvMgr(s[ 1 ], null, +s[ 0 ])
                : hrp_SelectEvMgr(s[ 1 ])
        }

        /**
         * Handles the dynamic request and the search query written in form input select (those located in the table )
         *
         * dt = means datatable, so handler for datatable select when opened
         *
         * @param characterWritten Text written in the search input
         * @param idCompound its a compound with the id of the row and the field navigation key. eg [ -5.categoryId ]
         */
        const h_prodSelectSearch = debounce(async ( queryStr: string, idCompound: string ) => {
            await hrp_SelectEvMgr(idCompound.split('.')[1], queryStr)
        }, 1500)

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
            INPUT_DATE_TYPE,

            columns,
            abar_mode,
            abutton_mode,

            cpt_fMode,
            st_nomenclatures,

            tabs,
            activeTabId,
            ls_contactLabel,

            showSrcLoc,
            showDesLoc,
            ref_selectSrcLoc,
            ref_selectDstLoc,

            nav_back,

            h_delete,
            h_tabChange,
            h_beforeSubmit,
            h_intentUpdCell,
            h_dtSelectOpened,
            h_intentRowDelete,
            h_prodSelectSearch,
            h_intentMoveCreate,
            h_keyboardKeyPress,
            h_UIPickingTypeAdjustment,
        }
    }

})
</script>

<style scoped>
</style>
