<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.product.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="columns"
                        :data="ls_products.entityPage"
                        :has-actions="true"
                        :headerFilters="headerFilters"
                        :extendedFilters="extFilters"

                        @requestIntent="h_reqQuery"

                        @navCreateIntent="nav_createProductIntent"
                        @editIntent="nav_editProductIntent"
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
import { CmpCard, CmpDataTable } from '@/components'
import { ApiProduct } from '@/services/api/inventory/api-product'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import useNumeric from '@/services/composables/useNumeric'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useSt_Pagination } from '@/stores/pagination'
import { IsEmptyObj, isNumber } from '@/services/helpers/help-defaults'
import {
    ACTION_KIND_STR,
    BULK_ACTIONS,
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE,
    ENTITY_NAMES, FMODE,
    HProductTable, KEYS,
    OPS_KIND_STR, RoutePathNames
} from '@/services/definitions'

import type { IDataTableQuery, IColumnHeader, IProductRow, IExtFilterGroup, IBulkData,  TOpsKind, TFormMode } from '@/services/definitions'


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

        const { t } = i18n.global

        const router = useRouter()
        const toast = useToast()

        const st_pagination = useSt_Pagination()
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const ls_products = ref<IProductState>({ entityPage: [] as IProductRow[] })

        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.COMMON                       // datatable action bar mode
        const columns = ref<Partial<IColumnHeader>[]>(HProductTable)                        // entity customized data-table
        const headerFilters = [ 'pCategoryID', 'isActive', 'doWeTrackInventory' ]           // datatable filters  !!! you must use the real field names (nav keys in the HStaffTable object)
        const extFilters: IExtFilterGroup[] =
                [
                    {
                        label:   '',
                        filters: [
                            { label: t('form.fields.product.cbe-sold'), entityField: 'CanBeSold', isActive: false, value: true },
                            { label: t('form.fields.product.cbe-purchased'), entityField: 'CanBePurchased', isActive: false, value: true },
                        ]
                    },
                ]

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()
        const { toUIMoney } = useNumeric()

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
                columns.value[6].filterSelectOptions = st_nomenclatures.getProdCat4Select
                // the 5th column is 'category' / 'sCategoryID' column. In this datatable this is a (column header) filter
                // (see filters in the declaration section). So, rather define the 'select options' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
                // ...
                // Regarding the use of '.then()' for the callback, we jus could use async in the hook and later awaited
                // (await) the getSuppCat4Select() call ... but I like the old fashion way
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.REQUEST))

            st_nomenclatures.reqNmcUoM()

            a_reqQuery()

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
            ApiProduct.getPage(st_pagination.getQueryData)
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
            })
        }

        const a_reqSwitchState = async ( ids: Array<number>, ops: TOpsKind ) => {
            let entityReference: undefined | string = undefined

            // the 'single' case,  used when this is called for switch status toggle intent
            if (ids.length === 1)
                entityReference = ls_products.value.entityPage.find(p => p.id === ids[0])!.pName

            ApiProduct.bulkToggle(ids)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.PRODUCT, ops, entityReference)
                ls_products.value.entityPage.forEach(p => ids.includes(p.id) ? p.isActive = !p.isActive : null)            // updating local store
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.PRODUCT, ops))
        }

        /**
         * Request the deletion of a supplier to the backend
         * @param prodIds List of products identifiers
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async (prodIds: Array<number>, ref: undefined | string = undefined ): Promise<void> => {
            ApiProduct.reqDeleteProducts(prodIds)
            .then(() => {
                ls_products.value.entityPage = ls_products.value.entityPage.filter(prod => !prodIds.includes(+prod.id)) // filtering the local state
                tfyCRUDSuccess(ENTITY_NAMES.PRODUCT, OPS_KIND_STR.DELETION, ref)
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Maps the product categories id present in one of the fields of the list of datatable records (products),
         * to the actual product categories name (user friendliness)
         *
         * ❗ Also this mathe makes other local data transformation / formatting jobs
         */
        const mappingProperties = () => {
            if (IsEmptyObj(st_nomenclatures.getProdCatByIdMap)) return        // If there are no supplier categories yet, retrieve the entities as it is

            ls_products.value.entityPage = ls_products.value.entityPage.map((prodRow: IProductRow) => {

                // there is a chance that this line run, and the pCategoryID field was already mapped to the role name making it a string value so we can used as index anymore, so we have to check first
                if(isNumber(prodRow.pCategoryID)) prodRow.pCategoryID = st_nomenclatures.getProdCatByIdMap[+prodRow.pCategoryID].pCatName

                // there is a chance that this line run, and the pUoMID field was already mapped to the role name making it a string value so we can used as index anymore, so we have to check first
                if(isNumber(prodRow.pUoMID)) prodRow.pUoMID = st_nomenclatures.getUoMByIdMap[+prodRow.pUoMID].uName

                // so the 0 value doesnt mess with the user in the UI making them confuse, we remove the 0 values
                if (prodRow.pTotalStock == 0) prodRow.pTotalStock = 0

                // money ui conversion
                prodRow.sellPrice = '$ ' + toUIMoney(prodRow?.sellPrice ?? '0') as string

                return prodRow
            })
        }

        //#endregion ==========================================================================

        //region ======== NAVIGATION ==========================================================

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        const nav_createProductIntent = () => {
            router.push({
                name:   RoutePathNames.prodCreate,
                params: {
                    fmode: FMODE.CREATE as TFormMode
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        /**
         * Handler for the intent of edit a record from the table
         * @param rowData data of the row, intent to be coming form the data table
         */
        const nav_editProductIntent = ( rowData: IProductRow ) => {
            router.push({
                name:   RoutePathNames.prodEdit,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id,
                }
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
            const entityReference = ls_products.value.entityPage.find(prod => prod.id === entityId)?.pName ?? ''

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.PRODUCT, entityReference, t('dialogs.prod-remove-warning'))
            if (wasConfirmed) a_reqDelete([ entityId ], entityReference)
        }

        const h_intentBulkAction = async ( bulkData: IBulkData ) => {

            if (bulkData.actionType === BULK_ACTIONS.ENALBE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.ACTIVATE, ENTITY_NAMES.PRODUCT, '', '', true)
                if (wasConfirmed) {
                    // need to enable all selected disabled stores. Filter the Product to find whether Id from the Product in the local store
                    // actually is in the given Id list ... and also check the Product isn't active already in the local store
                    // I think this checks should be done to be resilient about imprecision may appears between the component id collection
                    let ids = ls_products.value.entityPage.filter(p => bulkData.ids.indexOf(p.id.toString()) !== -1 && !p.isActive).map(p => p.id)
                    if(ids.length > 0) await a_reqSwitchState(ids, OPS_KIND_STR.ENABLE)
                }
            }
            else if (bulkData.actionType === BULK_ACTIONS.DISABLE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DEACTIVATE, ENTITY_NAMES.PRODUCT, '', '', true)
                if (wasConfirmed) {
                    // disable case, same as enable but with the disable state ... and also check the Product isn't disabled already in the local store
                    // I think this checks should be done to be resilient about imprecision may appears between the component id collection and the store or local store id collection (single source of truth)
                    let ids = ls_products.value.entityPage.filter(p => bulkData.ids.indexOf(p.id.toString()) !== -1 && p.isActive).map(p => p.id)
                    if (ids.length > 0) await a_reqSwitchState(ids, OPS_KIND_STR.DISABLE)
                }
            }
            else if (bulkData.actionType === BULK_ACTIONS.REMOVE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.PRODUCT, '', t('dialogs.prod-remove-warning'), true)
                if (wasConfirmed) await a_reqDelete(bulkData.ids.map(Number))
            }
        }

        const h_intentToggleEnable = ( id: number ) => {
            a_reqSwitchState([id], OPS_KIND_STR.ENABLE)
        }

        const h_intentToggleDisable = ( id: number ) => {
            a_reqSwitchState([id], OPS_KIND_STR.DISABLE)
        }

        //#endregion ==========================================================================

        return {
            ls_products,

            columns,
            abar_mode,
            abutton_mode,
            headerFilters,
            extFilters,

            h_reqQuery,
            nav_createProductIntent,
            nav_editProductIntent,
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
