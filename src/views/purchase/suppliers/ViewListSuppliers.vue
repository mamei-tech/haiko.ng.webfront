<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.supplier.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="columns"
                        :data="ls_suppliers.entityPage"
                        :has-actions="true"
                        :headerFilters="headerFilters"

                        @requestIntent="h_reqQuery"

                        @navCreateIntent="nav_2Form"
                        @editIntent="nav_2Form"
                        @deleteIntent="h_intentRowDelete"

                        @bulkActionIntent="h_intentBulkAction"

                        @enableIntent="h_intentToggleEnable"
                        @disableIntent="h_intentToggleDisable"
          >
          </CmpDataTable>
        </CmpCard>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { i18n } from '@/services/i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { IsEmptyObj, isNumber } from '@/services/helpers/help-defaults'
import { ApiSupplier } from '@/services/api/resources-infraestructure/api-supplier'
import { CmpCard, CmpDataTable } from '@/components'
import { useSt_Pagination } from '@/stores/pagination'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import {
    ACTION_KIND_STR, BULK_ACTIONS,
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE, ENTITY_NAMES,
    FMODE,
    HSupplierTable, KEYS, OPS_KIND_STR,
    RoutePathNames
} from '@/services/definitions'

import type { IBulkData, TOpsKind, IDataTableQuery, IColumnHeader, TFormMode, ISupplierRow, IIndexable } from '@/services/definitions'


//region ======== STATE INTERFACE =======================================================

// interface IStaffState extends IBasicPageState {
interface ISupplierState {
    entityPage: ISupplierRow[]
}

//endregion =============================================================================

export default defineComponent({
    name: 'ViewListSuppliers',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const router = useRouter()
        const toast = useToast()                                                            // The toast lib interface

        const st_pagination = useSt_Pagination()
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const ls_suppliers = ref<ISupplierState>({entityPage: [] as ISupplierRow[]})  // local store

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.TOGSTATUS                    // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HSupplierTable)                       // entity customized datatab
        const headerFilters = [ 'suppCategoryID', 'isActive' ]                                 // datatable filters  !!! you must use the real field names (nav keys in the HStaffTable object)

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()

        //#endregion ==========================================================================

        //region ======= HOOKS ================================================================

        /**
         * setup is called before component creation, so the onMounted hook is a good time / place to
         * invoke data population method through web API request.
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(() => {
            // getting supplier categories definitions from the system (side effect)
            // this is used to fetch supplier category basic data from the system so we can map the cat identifier to cat name in the datatable column
            st_nomenclatures.reqNmcSuppCat()
            .then(() => {
                columns.value[6].filterSelectOptions = st_nomenclatures.getSuppCat4Select
                // the 6th column is 'category' / 'suppCategoryID' column. In this datatable this is a (column header) filter
                // (see filters in the declaration section). So, rather define the 'select options' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
                // ...
                // Regarding the use of '.then()' for the callback, we jus could use async in the hook and later awaited
                // (await) the getSuppCat4Select() call ... but I like the old fashion way
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.REQUEST))

            a_reqQuery()
            window.addEventListener('keydown', h_keyboardKeyPress)                            // keyboard keys event handler, we need to clean this kind of event when the component are destroyed// keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS ==============================================

        /**
         * Request the deletion of a supplier to the backend
         * @param suppId Supplier identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async (suppId: number, ref: undefined | string = undefined ): Promise<void> => {
            ApiSupplier.reqDeleteSupp(suppId)
            .then(( response: any ) => {
                // so everything was good, we need to update the local store
                ls_suppliers.value.entityPage = ls_suppliers.value.entityPage.filter(supp => supp.id !== suppId)
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.DELETION, ref)
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.DELETION, ref))
        }

        function a_reqQuery( queryData: IDataTableQuery | undefined = undefined ) {
            // getting the suppliers list data for populating the datatable (side effect)
            ApiSupplier.getPageSupp(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_suppliers.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                mapCat2Names()                                      // mapping id to names

            }).catch(error => {
                if (error.response.status === 404) {
                    ls_suppliers.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }

                tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.REQUEST)
            })
        }

        function a_reqSwitchState( ids: Array<number>, ops: TOpsKind ) {
            let entityReference: undefined | string = undefined

            // the 'single' case,  used when this is called for switch status toggle intent
            if (ids.length === 1)
                entityReference = ls_suppliers.value.entityPage.find(suppCat => suppCat.id === ids[0])?.pName ?? ''

            ApiSupplier.bulkToggle(ids)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, ops, entityReference)
                ls_suppliers.value.entityPage.forEach(s => ids.includes(s.id) ? s.isActive = !s.isActive : null)            // updating local store
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, ops))
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Maps the supplier categories id present in one of the fields of the lis of datatable records (suppliers)
         * to the actual suppliers categories name (user friendliness)
         */
        const mapCat2Names = () => {
            if (IsEmptyObj(st_nomenclatures.getSuppCatByIdMap)) return        // If there are no supplier categories yet, retrieve the entities as it is

            ls_suppliers.value.entityPage = ls_suppliers.value.entityPage.map((row: ISupplierRow) => {

                // there is a chance that this line run, and the suppCategoryID field was already mapped to the role name making it a string value so we can used as index anymore, so we have to check first
                if(isNumber(row.suppCategoryID))
                    row.suppCategoryID = st_nomenclatures.getSuppCatByIdMap[+row.suppCategoryID].scName

                return row
            })
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub })
        }

        /**
         * Navigation handler method to jump to the entity formulary view
         *
         * @param mode To setting up the formulary view of the entity. Could be CREATION mode or EDITION mode
         * @param rowData
         */
        const nav_2Form = async ( mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined ) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            if (mode == FMODE.EDIT)
            {
                // in edition mode the country & state Multiselect components present in ViewFormSuppliers need to have the data before the component can render the entity selected option according with the entity data
                // so we call the data before tell the router to show de edit. An alternative to this could be having reactive vars in the form template to tell when to render (render after the data of the Multiselect option is present) and get the data in the OnMount hook in the form.
                // ... so, getting needed data in edition form
                st_nomenclatures.reqNmcCountries().catch(err => tfyCRUDFail(err, ENTITY_NAMES.COUNTRY, OPS_KIND_STR.REQUEST))
                const countryCode = (rowData as ISupplierRow).countryCode
                if (countryCode != undefined)
                    await st_nomenclatures.reqNmcCountriesStates(countryCode)

                // TIP I think this could be moved from here to a hook in the form so this kind of methods remains consistent among all the list views
            }

            await router.push({
                name:   RoutePathNames.supplierForm,
                params: params
            })
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }

        const h_intentRowDelete = async ( entityId: number ): Promise<void> => {
            if (entityId == 1) {
                dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-default'))
                return
            }

            const entityReference = ls_suppliers.value.entityPage.find(supplier => supplier.id === entityId)?.pName ?? ''

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.SUPPLIER, entityReference)
            if (wasConfirmed) a_reqDelete(entityId, entityReference)
        }

        const h_intentToggleEnable = ( id: number ) => {
            a_reqSwitchState([id], OPS_KIND_STR.ENABLE)
        }

        const h_intentToggleDisable = ( id: number ) => {
            a_reqSwitchState([id], OPS_KIND_STR.DISABLE)
        }

        const h_intentBulkAction = async ( bulkData: IBulkData ) => {

            // This is a somewhat hacky way of cast string to int in typescript. It has to do with type coercion, and
            // it is a pain to deal with in JS. I use this way because is visually placement and beautiful, in some way;
            // for a more readable form, use v => parseInt (v)
            const dataIds = bulkData.ids.map(v => +v)

            if (bulkData.actionType === BULK_ACTIONS.ENALBE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.ACTIVATE, ENTITY_NAMES.SUPPLIER, '', '', true)
                if (wasConfirmed) {
                    // need to enable all selected disabled suppliers. Filter the staff to find whether Id from the suppliers in the local store
                    // actually is in the given Id list ... and also check the suppliers isn't active already in the local store
                    // I think this checks should be done to be resilient about imprecision may appears between the component id collection and the store or local store id collection (single source of truth)
                    let ids = ls_suppliers.value.entityPage.filter(s => dataIds.indexOf(s.id) !== -1 && !s.isActive).map(s => s.id)
                    if (ids.length > 0) a_reqSwitchState(ids, OPS_KIND_STR.ENABLE)
                }
            }
            else if (bulkData.actionType === BULK_ACTIONS.DISABLE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DEACTIVATE, ENTITY_NAMES.SUPPLIER, '', '', true)
                if (wasConfirmed) {
                    // disable case, same as enable but with the disable state ... and also check the Staff isn't disabled already in the local store
                    // I think this checks should be done to be resilient about imprecision may appears between the component id collection and the s
                    let ids = ls_suppliers.value.entityPage.filter(s => dataIds.indexOf(s.id) !== -1 && s.isActive).map(s => s.id)
                    if (ids.length > 0) a_reqSwitchState(ids, OPS_KIND_STR.DISABLE)
                }
            }
        }

        //#endregion ==========================================================================

        return {
            ls_suppliers,

            abar_mode,
            abutton_mode,
            columns,
            headerFilters,

            nav_2Form,

            h_reqQuery,
            h_intentRowDelete,
            h_intentBulkAction,

            h_intentToggleEnable,
            h_intentToggleDisable
        }
    }
})
</script>

<style scoped>
</style>

