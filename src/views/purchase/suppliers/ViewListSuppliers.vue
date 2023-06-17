<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.supplier-cat.name')"

                                  :action-bar-mode="abar_mode"
                                  :action-btn-mode="abutton_mode"

                                  :columns="columns"
                                  :data="ls_suppliers.entityPage"
                                  :has-actions="true"
                                  :filters="filters"

                                  @requestIntent="h_reqQuery"

                                  @navCreateIntent="h_navCreateSuppCatIntent"
                                  @editIntent="h_navEditSuppIntent"
                                  @deleteIntent="h_intentRowDelete"

                                  @enableIntent=""
                                  @disableIntent=""
                    >
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { i18n } from '@/services/i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { ApiSupplier } from '@/services/api/api-supplier'
import { CmpCard, CmpDataTable } from '@/components'
import { useSt_Pagination } from '@/stores/pagination'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import {
    ACTION_KIND_STR,
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE, ENTITY_NAMES,
    FMODE,
    HSupplierTable, OPS_KIND_STR,
    RoutePathNames
} from '@/services/definitions'

import type { IDataTableQuery, IColumnHeader, ISupplierCatRow, TFormMode, ISupplierRow } from '@/services/definitions'


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

        const ls_suppliers = ref<ISupplierState>({entityPage: [] as ISupplierRow[]})        // local store

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.NOEJC                        // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HSupplierTable)                       // entity customized datatab
        const filters = [ 'sCategoryID', 'isActive' ]                                       // datatable filters  !!! you must use the real field names (nav keys in the HStaffTable object)

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
            a_reqQuery()

            // getting supplier categories definitions from the system (side effect)
            // this is used to fetch supplier category basic data from the system so we can map the cat identifier to cat name in the datatable column
            st_nomenclatures.reqNomencSuppCat()
            .then(() => {
                columns.value[5].fieldMulti = st_nomenclatures.getSuppCatForMultiselect
                // the 5th column is 'category' / 'sCategoryID' column. In this datatable this is a (column) 'multi' filter
                // (see filters in the declaration section). So, rather define the 'multi' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
                // ...
                // Regarding the use of '.then()' for the callback, we jus could use async in the hook and later awaited
                // (await) the reqNomencRoles() call ... but I like the old fashion way
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.REQUEST))
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================

        /**
         * Request the deletion of a supplier category to the backend
         * @param suppId Supplier category identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async (suppId: number, ref: undefined | string = undefined ): Promise<void> => {
            ApiSupplier.reqDeleteSupp(suppId)
            .then(( response: any ) => {
                // so everything was good, we need to update the local store
                ls_suppliers.value.entityPage = ls_suppliers.value.entityPage.filter(supp => supp.id !== suppId)
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.DELETION, ref)
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //#region ======= ACTIONS =============================================================

        function a_reqQuery( queryData: IDataTableQuery | undefined = undefined ) {
            // getting the suppliers categories list data for populating the datatable (side effect)
            ApiSupplier.getPageSupp(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_suppliers.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

            }).catch(error => {
                if (error.response.status === 404) {
                    ls_suppliers.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }

                tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.REQUEST)
            })
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================

        const h_navCreateSuppCatIntent = (): void => {
            router.push({
                name:   RoutePathNames.supplierCatCreate,
                params: {
                    fmode: FMODE.CREATE as TFormMode
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        /**
         * Handler for the intent of edit a record from the table
         * @param rowData data of the row
         */
        const h_navEditSuppIntent = ( rowData: ISupplierCatRow ): void => {
            router.push({
                name:   RoutePathNames.supplierEdit,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id
                }
            })
        }

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }

        const h_intentRowDelete = async ( objectId: number ): Promise<void> => {
            const entityReference = ls_suppliers.value.entityPage.find(suppCat => suppCat.id === objectId)?.sName ?? ''

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.SUPPLIER, entityReference)
            if (wasConfirmed) a_reqDelete(objectId, entityReference)
        }

        //#endregion ==========================================================================

        return {
            ls_suppliers,

            abar_mode,
            abutton_mode,
            columns,
            filters,

            h_reqQuery,
            h_intentRowDelete,
            h_navEditSuppIntent,
            h_navCreateSuppCatIntent,
        }
    }

})
</script>

<style scoped>
</style>
