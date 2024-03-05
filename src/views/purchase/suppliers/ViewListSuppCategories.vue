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
                        :data="ls_suppliersCategories.entityPage"
                        :has-actions="true"

                        @requestIntent="h_reqQuery"

                        @navCreateIntent="nav_createSuppCatIntent"
                        @editIntent="nav_editSuppCatIntent"
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
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { i18n } from '@/services/i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { ApiSupplier } from '@/services/api/purchase/api-supplier'
import { CmpCard, CmpDataTable } from '@/components'
import { useSt_Pagination } from '@/stores/pagination'
import {
    ACTION_KIND_STR,
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE, ENTITY_NAMES,
    FMODE,
    HSupplierCatTable, KEYS, OPS_KIND_STR,
    RoutePathNames
} from '@/services/definitions'

import type { IDataTableQuery, IColumnHeader, ISupplierCatRow, TFormMode } from '@/services/definitions'


//region ======== STATE INTERFACE =======================================================

// interface IStaffState extends IBasicPageState {
interface ISupplierCatState {
    entityPage: ISupplierCatRow[]
}

//endregion =============================================================================

export default defineComponent({
    name: 'ViewListSuppCategories',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const router = useRouter()
        const toast = useToast()                                                            // The toast lib interface

        const st_pagination = useSt_Pagination()                                                                  // pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores
        const ls_suppliersCategories = ref<ISupplierCatState>({entityPage: [] as ISupplierCatRow[]})        // local store

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                           // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HSupplierCatTable)                    // entity customized datatab

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
            window.addEventListener('keydown', h_keyboardKeyPress)                              // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================

        /**
         * Request the deletion of a supplier category to the backend
         * @param catId Supplier category identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async (catId: number, ref: undefined | string = undefined ): Promise<void> => {

            ApiSupplier.reqDeleteSuppCat(catId)
            .then(( response: any ) => {
                // so everything was good, we need to update the local store
                ls_suppliersCategories.value.entityPage = ls_suppliersCategories.value.entityPage.filter(supCat => supCat.id !== catId)
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.DELETION, ref)
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.DELETION, ref))
        }

        function a_reqQuery( queryData: IDataTableQuery | undefined = undefined ) {
            // getting the suppliers categories list data for populating the datatable (side effect)
            ApiSupplier.getPageSuppCat(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_suppliersCategories.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

            }).catch(error => {
                if (error.response.status === 404) {
                    ls_suppliersCategories.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }

                tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.REQUEST)
            })
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
        //#endregion ==========================================================================

        //region ======== NAVIGATION ==========================================================

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        const nav_createSuppCatIntent = (): void => {
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
        const nav_editSuppCatIntent = ( rowData: ISupplierCatRow ): void => {
            router.push({
                name:   RoutePathNames.supplierCatEdit,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id
                }
            })
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }

        const h_intentRowDelete = async ( entityId: number ): Promise<void> => {
            if (entityId == 1) dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-default'))
            else {
                const entityReference = ls_suppliersCategories.value.entityPage.find(suppCat => suppCat.id === entityId)?.scName ?? ''

                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.SUPPLIER_CAT, entityReference, t('dialogs.supp-cat-del-confirmation'))
                if (wasConfirmed) a_reqDelete(entityId, entityReference)
            }
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        //#endregion ==========================================================================

        return {
            ls_suppliersCategories,

            abar_mode,
            abutton_mode,
            columns,

            h_reqQuery,
            h_intentRowDelete,

            nav_editSuppCatIntent,
            nav_createSuppCatIntent,
        }
    }

})
</script>

<style scoped>
</style>
