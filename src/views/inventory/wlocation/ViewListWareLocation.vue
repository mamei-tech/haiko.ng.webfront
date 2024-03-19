<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.strgcategory.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="columns"
                        :data="ls_locations.entityPage"
                        :extendedFilters="extFilters"

                        :has-actions="true"

                        @requestIntent="h_reqQuery"

                        @navCreateIntent="nav_2Form"
                        @editIntent="nav_2Form"
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
import {
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE,
    ENTITY_NAMES,
    FMODE,
    HWareLocationsTable,
    KEYS,
    OPS_KIND_STR,
    RoutePathNames,
    WARE_LOC_TYPE,
} from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'
import { ApiWareLocation } from '@/services/api/inventory/api-warelocation'
import { useSt_Pagination } from '@/stores/pagination'
import { useSt_Nomenclatures } from '@/stores/nomenc'

import type { IIndexable, IColumnHeader, IDataTableQuery, IExtFilterGroup, IWareLocationRow, TFormMode } from '@/services/definitions'


//region ======== STATE INTERFACE =======================================================

interface IWareLocationState {
    entityPage: IWareLocationRow[]
}

//endregion =============================================================================


export default defineComponent({
    name: 'ViewListWareLocation',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const toast = useToast()                                                            // The toast lib interface
        const router = useRouter()

        const st_pagination = useSt_Pagination()
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const ls_locations = ref<IWareLocationState>({ entityPage: [] as IWareLocationRow[] })    // storage location categories

        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.COMMON                       // datatable action bar mode
        const columns = ref<Partial<IColumnHeader>[]>(HWareLocationsTable)                  // entity customized datatable header | As here the data for the filter is dynamically (side-effect) obtained, we need to use ref so we can fill the datas
        // const headerFilters = [ 'allowProdType' ]                                         // datatable filters  !!! you must use the real field names (nav keys in the HStaffTable object)
        const extFilters: IExtFilterGroup[] =
            [
                {
                    label: '',
                    filters: [
                        { label: t('entities.wlocation.internal-type'), entityField: 'LType', isActive: true, value: WARE_LOC_TYPE.INTERNAL },
                        { label: t('others.enable'), entityField: 'IsActive', isActive: true, value: true },
                    ]
                }
            ]

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
            // columns.value[3].filterSelectOptions = st_nomenclatures.getStrgProdPolicies4Select

            // ❗❗❗ HERE (in this case) we are not going to call query 'cause as we are using extended filters active by default (when this view is mounted / created first time).
            // So that will cause that the watch in CmpDataTable, emit a request call with the active filters set. Hence, if we call a request here, we will be
            // making 2 request, instead just 1.
            // a_reqQuery()

            window.addEventListener('keydown', h_keyboardKeyPress)                                // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {

            window.removeEventListener('keydown', h_keyboardKeyPress)                           // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        const a_reqQuery = ( queryData: IDataTableQuery | undefined = undefined ) => {
            // getting the product list data for populating the datatable (side effect)
            ApiWareLocation.getPage(st_pagination.getQueryData)
            .then(( response: any ) => {

                ls_locations.value.entityPage = response.data.entityList.map(( entity: IWareLocationRow ) => {
                    entity.lType = t(`entities.wlocation.types.${entity.lType}`)
                    return entity
                })
                st_pagination.mutUpdateOnRequest(response.data.totalRecords, response.data.entityList.length, st_pagination.Offset)

            }).catch(error => {
                if (error.response?.status === 404) {
                    ls_locations.value.entityPage = []
                    st_pagination.mutSetEmptyPage(st_pagination.Offset)
                }
                tfyCRUDFail(error, ENTITY_NAMES.STRGCATEGORY, OPS_KIND_STR.REQUEST)
            })
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======== HELPERS =============================================================
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
                name:   RoutePathNames.wlocationForm,
                params: params,
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

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            columns,
            // headerFilters,
            extFilters,
            ls_locations,

            h_reqQuery,
            h_intentRowDelete,

            nav_2Form
        }
    }
})
</script>

<style scoped>
</style>
