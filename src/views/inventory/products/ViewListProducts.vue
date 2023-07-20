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
                                  :data="ls_products.entityPage"
                                  :has-actions="true"
                                  :headerFilters="headerFilters"

                                  @requestIntent="h_reqQuery"

                                  @navCreateIntent="h_navCreateSuppCatIntent"
                                  @editIntent="h_navEditSuppIntent"
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
import { defineComponent, onMounted, ref } from 'vue'
import { CmpCard, CmpDataTable } from '@/components'
import { ApiProduct } from '@/services/api/api-product'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useCommon from '@/services/composables/useCommon'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useSt_Pagination } from '@/stores/pagination'
import { IsEmptyObj, isNumber } from '@/services/helpers/help-defaults'
import {
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE,
    ENTITY_NAMES,
    HProductTable,
    OPS_KIND_STR
} from '@/services/definitions'

import type { IDataTableQuery, IColumnHeader, IProductRow, ISupplierRow } from '@/services/definitions'


//region ======== STATE INTERFACE =======================================================

interface IProductState {
    entityPage: IProductRow[]
}

//endregion =============================================================================

export default defineComponent({
    name: 'ViewListProducts',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const toast = useToast()

        const st_pagination = useSt_Pagination()
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const ls_products = ref<IProductState>({ entityPage: [] as IProductRow[] })

        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.TOGSTATUS                    // datatable action bar mode
        const columns = ref<Partial<IColumnHeader>[]>(HProductTable)                        // entity customized data-table
        const headerFilters = [ 'pCategoryID', 'isActive', 'doWeTrackInventory' ]           // datatable filters  !!! you must use the real field names (nav keys in the HStaffTable object)

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { toUIMoney } = useCommon()

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
            st_nomenclatures.reqNmcProdCat()
            .then(() => {
                columns.value[6].fieldMulti = st_nomenclatures.getProdCat4Multiselect
                // the 6th column is 'category' / 'sCategoryID' column. In this datatable this is a (column) 'multi' filter
                // (see filters in the declaration section). So, rather define the 'multi' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
                // ...
                // Regarding the use of '.then()' for the callback, we jus could use async in the hook and later awaited
                // (await) the getSuppCat4Multiselect() call ... but I like the old fashion way
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.REQUEST))

            st_nomenclatures.reqNmcUoM()

            a_reqQuery()
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================

        const a_reqQuery = ( queryData: IDataTableQuery | undefined = undefined ) => {
            // getting the product list data for populating the datatable (side effect)
            ApiProduct.getPage(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_products.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                // --- some local data processing
                mappingProperties()                                      // mapping categories id to names

            }).catch(error => {
                if (error.response.status === 404) {
                    ls_products.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }

                tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.REQUEST)
            })
        }

        //#endregion ==========================================================================

        //#region ======= ACTIONS =============================================================
        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }
        const h_navCreateSuppCatIntent = () => {
            console.warn("implement this")
        }
        const h_navEditSuppIntent = () => {
            console.warn("implement this")
        }
        const h_intentRowDelete = () => {
            console.warn("implement this")
        }
        const h_intentBulkAction = () => {
            console.warn("implement this")
        }
        const h_intentToggleEnable = () => {
            console.warn("implement this")
        }
        const h_intentToggleDisable = () => {
            console.warn("implement this")
        }

        //#endregion ==========================================================================

        //#region ======= AUX =================================================================

        /**
         * Maps the product categories id present in one of the fields of the lis of datatable records (products),
         * to the actual product categories name (user friendliness)
         *
         * ❗ Also this mathe makes other local data transformation / formatting jobs
         */
        const mappingProperties = () => {
            if (IsEmptyObj(st_nomenclatures.getProdCatByIdMap)) return        // If there are no supplier categories yet, retrieve the entities as it is

            ls_products.value.entityPage = ls_products.value.entityPage.map((prodRow: IProductRow) => {

                // there is a chance that this line run, and the pCategoryID field was already mapped to the role name making it a string value so we can used as index anymore, so we have to check first
                if(isNumber(prodRow.pCategoryID)) prodRow.pCategoryID = st_nomenclatures.getProdCatByIdMap[+prodRow.pCategoryID].pCatName

                // there is a chance that this line run, and the pUoM field was already mapped to the role name making it a string value so we can used as index anymore, so we have to check first
                if(isNumber(prodRow.pUoM)) prodRow.pUoM = st_nomenclatures.getUoMByIdMap[+prodRow.pUoM].uName

                // so the 0 value doesnt mess with the user in the UI making them confuse, we remove the 0 values
                if (prodRow.pTotalStock == 0) prodRow.pTotalStock = undefined

                // money ui conversion
                prodRow.sellPrice = '$ ' + toUIMoney(prodRow.sellPrice) as string

                return prodRow
            })
        }

        //#endregion ==========================================================================

        return {
            ls_products,

            columns,
            headerFilters,
            abar_mode,
            abutton_mode,

            h_reqQuery,
            h_navCreateSuppCatIntent,
            h_navEditSuppIntent,
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
