<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover" :subject="$t('entities.product.name')" :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode" :columns="columns" :data="ls_pickings.entityPage"
                        :has-actions="true" @requestIntent="h_reqQuery" @editIntent="nav_2Form"
                        @navCreateIntent="nav_2Form" @deleteIntent="h_intentRowDelete"
                        @bulkActionIntent="h_intentBulkAction">
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { CmpDataTable, CmpCard } from '@/components'
import { useToast } from 'vue-toastification'
import {
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE,
    ENTITY_NAMES,
    FMODE, HPickingTable, KEYS, OPS_KIND_STR,
    RoutePathNames
} from '@/services/definitions'
import useToastify from '@/services/composables/useToastify'
import useDate from '@/services/composables/useDates'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useSt_Pagination } from '@/stores/pagination'
import { ApiPicking } from '@/services/api/inventory/api-picking'

import type { IPickingRow } from '@/services/definitions/entities/types-picking'
import type { IBulkData, IDataTableQuery, IIndexable, TFormMode, IColumnHeader, IWareLocationBasic, IPickingTypeBasic, ISupplierBasic, ById } from '@/services/definitions'


//#region ======== STATE INTERFACE =======================================================

interface IPickingState {
    entityPage: IPickingRow[]
}

//#endregion =============================================================================

export default defineComponent({
    name: 'ViewListTransfer',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const router = useRouter()
        const toast = useToast()

        const st_pagination = useSt_Pagination()
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclature | Pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const ls_pickings = ref<IPickingState>({ entityPage: [] as IPickingRow[] })
        let ls_wareLocations: ById<IWareLocationBasic> = ({})
        let ls_pickingTypes: ById<IPickingTypeBasic> = ({})
        let ls_suppliers: ById<ISupplierBasic> = ({})

        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // data-table button mode
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.COMMON                       // data-table action bar mode
        const columns = ref<Partial<IColumnHeader>[]>(HPickingTable)                        // entity customized data-table

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { strDate2Diff } = useDate()

        //#endregion ==========================================================================

        //#region ======= HOOKS ================================================================

        /**
         * Vue hook before component is mounted in the DOM
         */
        onMounted(async () => {
            // getting needed data
            try {
                await st_nomenclatures.reqNmcWareLocations()
                await st_nomenclatures.reqNmcPickingTypes()
                await st_nomenclatures.reqNmcSuppliers()
            }
            catch (err) { tfyCRUDFail(err, 'entidades', OPS_KIND_STR.REQUEST) }

            a_reqQuery()

            window.addEventListener('keydown', h_keyboardKeyPress)                                  // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                                   // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        const a_reqQuery = (queryData: IDataTableQuery | undefined = undefined) => {

            // getting the picking / transfer list data for populating the data-table (side effect)
            ApiPicking.getPage(st_pagination.getQueryData)
                .then((response: any) => {

                    ls_pickings.value.entityPage = response.data.entityList
                    st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                    // --- some local data processing
                    mappingProperties()                                                                       // mapping numbered data (e.g identifier)

                })
                .catch(error => {
                    if (error.response?.status === 404) {
                        ls_pickings.value.entityPage = []
                        st_pagination.mutSetEmptyPage(st_pagination.Offset)
                    }
                    tfyCRUDFail(error, ENTITY_NAMES.PICKING, OPS_KIND_STR.REQUEST)
                })
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= HELPERS ==============================================================

        const mappingProperties = () => {

            ls_wareLocations = st_nomenclatures.getWareLocByIdMap                                               // getting the inventory warehouse locations mapped by its identifier            
            ls_pickingTypes = st_nomenclatures.getPickingTypeByIdMap                                            // getting the inventory picking types mapped by its identifier
            ls_suppliers = st_nomenclatures.getSuppByIdMap                                                      // getting the inventory suppliers mapped by its identifier

            ls_pickings.value.entityPage = ls_pickings.value.entityPage.map((pickRow: IPickingRow) => {

                pickRow.pScheduleDate = strDate2Diff(pickRow.pScheduleDate as string)
                pickRow.pSrcWareLocationID = ls_wareLocations[ pickRow.pSrcWareLocationID ]?.lFullName ?? ''
                pickRow.pDestWareLocationID = ls_wareLocations[ pickRow.pDestWareLocationID ]?.lFullName ?? ''
                pickRow.pickingType = ls_pickingTypes[ pickRow.pickingType ]?.tName ?? ''
                pickRow.contactID = ls_suppliers[ pickRow.contactID ]?.cmpDisplayName ?? ''

                return pickRow
            })

        }

        //#endregion ==========================================================================

        //#region ======= NAVIGATION ===========================================================

        /**
         * Navigation handler method to jump to the entity formulary view
         *
         * @param mode To setting up the formulary view of the entity. Could be CREATION mode or EDITION mode
         * @param rowData
         */
        const nav_2Form = (mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            router.push({
                name: RoutePathNames.invTransferForm,
                params: params
            })
        }

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        //#endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_intentBulkAction = async (bulkData: IBulkData) => {
            console.info('not implemented yet')
        }

        const h_intentRowDelete = async (entityId: number) => {
            console.info('not implemented yet')
        }

        const h_keyboardKeyPress = (evt: any) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        function h_reqQuery(_: IDataTableQuery) {
            a_reqQuery()
        }

        //#endregion ==========================================================================

        return {
            ls_pickings,

            columns,

            abar_mode,
            abutton_mode,

            nav_2Form,

            h_reqQuery,
            h_intentRowDelete,
            h_intentBulkAction,
        }
    }

})
</script>

<style scoped></style>
