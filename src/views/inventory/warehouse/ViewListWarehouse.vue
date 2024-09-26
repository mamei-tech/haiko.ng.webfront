<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.warehouse.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="columns"
                        :data="ls_warehouses.entityPage"
                        :has-actions="true"
                        :has-search="false"
                        :has-page-size-selector="false"

                        @editIntent="nav_2Form"
                        @navCreateIntent="nav_2Form"
                        @deleteIntent="h_intentRowDelete"
          >
          </CmpDataTable>
        </CmpCard>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { i18n } from '@/services/i18n'
import { useRouter } from 'vue-router'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { IsEmptyObj, IsNumber } from '@/services/helpers/help-defaults'
import { ApiWarehouse } from '@/services/api/inventory/api-warehouse'
import { useSt_Pagination } from '@/stores/pagination'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { CmpCard, CmpDataTable } from '@/components'
import {
    ACTION_KIND_STR,
    ENTITY_NAMES,
    DT_ACTIONBAR_MODE,
    FMODE,
    OPS_KIND_STR,
    RoutePathNames,
    HWarehouseTable,
    DT_ACTION_BUTTON_MODE, KEYS
} from '@/services/definitions'


import type { TFormMode, IColumnHeader, IDataTableQuery, IWarehouseRow, IIndexable } from '@/services/definitions'


//region ======== STATE INTERFACE =======================================================

interface IWarehouseState {
    entityPage: IWarehouseRow[]
}

//endregion =============================================================================


export default defineComponent({
    name: 'ViewListWarehouse',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const toast = useToast()                                                            // The toast lib interface
        const router = useRouter()

        const st_pagination = useSt_Pagination()
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores
        const ls_warehouses = ref<IWarehouseState>({ entityPage: [] as IWarehouseRow[] })

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                           // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HWarehouseTable)                      // entity customized datatable header | As here the data for the filter is dynamically (side-effect) obtained, we need to use ref so we can fill the datas

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

            window.addEventListener('keydown', h_keyboardKeyPress)                    // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        const a_reqQuery = ( queryData: IDataTableQuery | undefined = undefined ) => {
            // getting the product list data for populating the datatable (side effect)
            ApiWarehouse.getPage(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_warehouses.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                // --- some local data processing
                hpr_mappingProperties()                                                                                 // mapping supplier's / partner's address identifier to names
                
            }).catch(error => {
                if (error.response?.status === 404) {
                    ls_warehouses.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }
                tfyCRUDFail(error, ENTITY_NAMES.WAREHOUSE, OPS_KIND_STR.REQUEST)
            })
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======== HELPERS =============================================================

        /**
         *  'Address' column is actually using the 'Partner' / 'Supplier' record identifier. This method maps that identifier
         *  to the name of the 'Partner' to display in the 'Address' column
         *
         *  ❗ in this entire view file (list view), we are going to be using the 'suppID' as 'SuppAddressID'
         */
        const hpr_mappingProperties = async () => {

            if (IsEmptyObj(st_nomenclatures.getSuppByIdMap))                                                             // if we don't have the data, we request it
                await st_nomenclatures.reqNmcSuppliers(false)

            ls_warehouses.value.entityPage = ls_warehouses.value.entityPage.map((wareRow:IWarehouseRow) => {
                if(IsNumber(wareRow.suppID)) wareRow.suppID = st_nomenclatures.getSuppByIdMap[+wareRow.suppID].cmpDisplayName     // there is a chance that this line run, and the 'SuppAddressID' field was already mapped to the role name making it a string value so we can't used as index anymore, so we have to check first
                return wareRow
            })
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        /**
         * Navigation handler method to jump to the entity formulary view
         *
         * @param mode To setting up the formulary view of the entity. Could be CREATION mode or EDITION mode
         * @param rowData
         */
        const nav_2Form = (mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined ) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            router.push({
                name:   RoutePathNames.warehouseForm,
                params: params
            })
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        const h_intentRowDelete = async ( entityId: number ): Promise<void> => {
            console.error('not implemented')
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            columns,
            ls_warehouses,

            h_intentRowDelete,

            nav_2Form
        }
    }

})
</script>

<style scoped>
</style>
