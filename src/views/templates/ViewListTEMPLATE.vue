<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.product.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="[]"
                        :data="[]"
                        :has-actions="true"

                        @requestIntent="h_reqQuery"

                        @editIntent="nav_2Form"
                        @navCreateIntent="nav_2Form"
                        @deleteIntent="h_intentRowDelete"

                        @bulkActionIntent="h_intentBulkAction"
          >
          </CmpDataTable>
        </CmpCard>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CmpDataTable, CmpCard } from '@/components'
import { DT_ACTION_BUTTON_MODE, DT_ACTIONBAR_MODE, FMODE, KEYS, RoutePathNames } from '@/services/definitions'

import type {IBulkData, IDataTableQuery, IIndexable, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListTEMPLATE',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.COMMON                       // datatable action bar mode
        const router = useRouter()

        //#endregion ==========================================================================

        //region ======= HOOKS ================================================================

        /**
         * Vue hook before component is mounted in the DOM
         */
        onMounted(async () => {
            window.addEventListener('keydown', h_keyboardKeyPress)                                  // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        const a_reqQuery = ( queryData: IDataTableQuery | undefined = undefined ) => {

            console.info('not implemented yet')

            // getting the product list data for populating the datatable (side effect)
            /*ApiProduct.getPage(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_products.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                // --- some local data processing
                mappingProperties()                                      // mapping categories id to names

            }).catch(error => {
                if (error.response?.status === 404) {
                    ls_products.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }
                tfyCRUDFail(error, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.REQUEST)
            })*/
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        /**
         * Navigation handler method to jump to the entity formulary view
         *
         * @param mode To setting up the formulary view of the entity. Could be CREATION mode or EDITION mode
         * @param rowData
         */
        const nav_2Form = ( mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined ) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            router.push({
                name:   RoutePathNames.invTransferForm,
                params: params
            })
        }

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_intentBulkAction = async ( bulkData: IBulkData ) => {
            console.info('not implemented yet')
        }

        const h_intentRowDelete = async (entityId: number) => {
            console.info('not implemented yet')
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }

        //#endregion ==========================================================================

        return {

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

<style scoped>
</style>
