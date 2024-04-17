<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.pickingtype.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="columns"
                        :data="ls_types.entityPage"
                        :has-actions="true"
                        :headerFilters="headerFilters"

                        @requestIntent="h_reqQuery"

                        @editIntent="nav_2Form"
                        @navCreateIntent="nav_2Form"
                        @deleteIntent="h_intentRowDelete"

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
import { CmpCard, CmpDataTable } from '@/components'
import { ApiPickingType } from '@/services/api/inventory/api-picking-type'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import { useSt_Pagination } from '@/stores/pagination'
import {
    ACTION_KIND_STR,
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE,
    ENTITY_NAMES, FMODE,
    HPickingTypeTable, KEYS,
    OPS_KIND_STR, RoutePathNames
} from '@/services/definitions'

import type { IPickingTypeRow, IDataTableQuery, IColumnHeader, IProductRow, IExtFilterGroup, IBulkData,  TOpsKind, TFormMode, IIndexable } from '@/services/definitions'



//region ======== STATE INTERFACE =======================================================

interface IPickingTypeState {
    entityPage: IPickingTypeRow[]
}

//endregion =============================================================================

export default defineComponent({
    name: 'ViewListPickingType',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const router = useRouter()
        const toast = useToast()

        const st_pagination = useSt_Pagination()

        const ls_types = ref<IPickingTypeState>({ entityPage: [] as IPickingTypeRow[] })

        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                           // datatable action bar mode
        const columns = ref<Partial<IColumnHeader>[]>(HPickingTypeTable)                    // entity customized data-table
        const headerFilters = [ 'isActive' ]                                                // datatable filters  !!! you must use the real field names (nav keys in the HPickingTypeTable object)

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)

        //#endregion ==========================================================================

        //region ======= HOOKS ================================================================

        /**
         * setup is called before component creation, so the onMounted hook is a good time / place to
         * invoke data population method through web API request.
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(() => {

            // ❗❗❗ HERE (in this case) we are not going to call query 'cause as we are using extended filters ACTIVE BY DEFAULT (when this view is mounted / created first time).
            // So that will cause that the watch in CmpDataTable, emit a request call with the active filters set. Hence, if we call a request here, we will be
            // making 2 request, instead just 1.
            // a_reqQuery()

            window.addEventListener('keydown', h_keyboardKeyPress)                                  // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        const a_reqQuery = ( queryData: IDataTableQuery | undefined = undefined ) => {
            // getting the product list data for populating the datatable (side effect)
            ApiPickingType.getPage(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_types.value.entityPage = response.data.entityList
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

                // --- some local data processing

            }).catch(error => {
                if (error.response?.status === 404) {
                    ls_types.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }
                tfyCRUDFail(error, ENTITY_NAMES.PICKINGTYPE, OPS_KIND_STR.REQUEST)
            })
        }

        const a_reqSwitchState = async ( ids: Array<number>, ops: TOpsKind ) => {
            let entityReference: undefined | string = undefined

            if (ids.length === 1)
                entityReference = ls_types.value.entityPage.find(p => p.id === ids[ 0 ])!.tName

            ApiPickingType.bulkToggle(ids).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.PICKINGTYPE, ops, entityReference)
                ls_types.value.entityPage.forEach(p => ids.includes(p.id) ? p.isActive = !p.isActive : null)            // updating local store
            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.PICKINGTYPE, ops))
        }

        /**
         * Request the deletion of a supplier to the backend
         * @param prodIds List of products identifiers
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        /*const a_reqDelete = async (prodIds: Array<number>, ref: undefined | string = undefined ): Promise<void> => {
            ApiProduct.reqDeleteProducts(prodIds)
            .then(() => {
                ls_types.value.entityPage = ls_types.value.entityPage.filter(prod => !prodIds.includes(+prod.id)) // filtering the local state
                tfyCRUDSuccess(ENTITY_NAMES.PRODUCT, OPS_KIND_STR.DELETION, ref)
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.DELETION, ref))
        }*/

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
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
        const nav_2Form = ( mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined ) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            router.push({
                name:   RoutePathNames.pickigtypeForm,
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

        const h_intentRowDelete = async (entityId: number) => {
            console.error('not implemented exception')

            /*const entityReference = ls_types.value.entityPage.find(prod => prod.id === entityId)?.pName ?? ''

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.PRODUCT, entityReference, t('dialogs.prod-remove-warning'))
            if (wasConfirmed) a_reqDelete([ entityId ], entityReference)*/
        }

        const h_intentToggleEnable = ( id: number ) => {
            a_reqSwitchState([id], OPS_KIND_STR.ENABLE)
        }

        const h_intentToggleDisable = ( id: number ) => {
            a_reqSwitchState([id], OPS_KIND_STR.DISABLE)
        }


        //#endregion ==========================================================================

        return {
            ls_types,

            columns,
            abar_mode,
            abutton_mode,
            headerFilters,

            nav_2Form,

            h_reqQuery,
            h_intentRowDelete,
            h_intentToggleEnable,
            h_intentToggleDisable
        }
    }
})
</script>

<style scoped>
</style>
