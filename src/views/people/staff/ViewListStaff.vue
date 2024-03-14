<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard>
          <CmpDataTable table-type="hover"
                        :subject="$t('entities.staff.name')"

                        :action-bar-mode="abar_mode"
                        :action-btn-mode="abutton_mode"

                        :columns="columns"
                        :data="st_staff.getStaffList"
                        :has-actions="true"
                        :headerFilters="headerFilters"

                        @navCreateIntent="nav_CreateStaff"
                        @requestIntent="h_reqQuery"

                        @deleteIntent="h_intentRowDelete"
                        @editIntent="nav_RowEdit"

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
import { useRouter } from 'vue-router'
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import { useSt_Staff } from '@/stores/staff'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useSt_Pagination } from '@/stores/pagination'
import {
    ACTION_KIND_STR,
    BULK_ACTIONS,
    DT_ACTION_BUTTON_MODE,
    ENTITY_NAMES,
    FMODE,
    OPS_KIND_STR,
    HStaffTable,
    DT_ACTIONBAR_MODE,
    RoutePathNames, KEYS
} from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'
import useDialogfy from '@/services/composables/useDialogfy'
import useToastify from '@/services/composables/useToastify'

import type { TOpsKind, TFormMode, IDataTableQuery, IBulkData, IStaffRow, IColumnHeader } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListStaff',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const st_staff = useSt_Staff()                                                      // Pinia store for staff
        const st_pagination = useSt_Pagination()                                            // Pinia instance of pagination store
        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.COMMON                       // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HStaffTable)                          // entity customized datatable header | As here the data for the filter is dynamically (side-effect) obtained, we need to use ref so we can fill the data
        const headerFilters = [ 'roleId', 'isActive' ]                                      // datatable filters  !!! you must use the real field names (nav keys in the HStaffTable object)

        const router = useRouter()
        const toast = useToast()                                            // The toast lib interface
        // const columns = HStaffTable                                      // entity customized datatable header

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation } = useDialogfy()

        //#endregion ==========================================================================

        //region ======= HOOKS ================================================================

        /**
         * setup is called before component creation, so the onMounted hook is a good time / place to
         * invoke data population method through web API request.
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(() => {

            // getting roles definitions from the system (side effect)
            // this is used to fetch staff roles data from the system so we can map the roleId to rolename in the datatable column
            st_nomenclatures.reqNmcRoles()
            .then(() => {
                columns.value[6].filterSelectOptions = st_nomenclatures.getRoles4Select
                // the 6th column is 'role' / 'roleId' column. In this datatable this is a (column header) filter
                // (see filters in the declaration section). So, rather define the 'select options' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
                // ...
                // Regarding the use of '.then()' for the callback, we jus could use async in the hook and later awaited
                // (await) the getRoles4Select() call ... but I like the old fashion way
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.REQUEST))

            // getting the staff list data for populating staff datatable (side effect)
            st_staff.reqStaffPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))

            window.addEventListener('keydown', h_keyboardKeyPress)                                        // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        // ❗ this functions here for fetching data could be async await functions easily, if is needed
        function a_reqQuery( queryData: IDataTableQuery | undefined = undefined ) {
            st_staff.reqStaffPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
        }

        /**
         * Request the deletion (from server) of a entities according to the list of identifiers given as parameters
         *
         * @param ids List of entities identifiers
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        function a_reqDelete( ids: Array<number> , ref: undefined | string = undefined ) {
            st_staff.reqStaffDeletion({ ids })
            .then(() => {

                tfyCRUDSuccess(ENTITY_NAMES.STAFF, OPS_KIND_STR.DELETION, ref)

                // if a user delete all the records from a page of the table, then the table becomes empty, so in this case we need to make a request for the remains data (in the server, ... if any) and repopulate the table / page
                if (st_pagination.recordsOnPage == 0 && st_pagination.totalRecords > 0)
                    st_staff.reqStaffPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.DELETION, ref))
        }

        function a_reqSwitchState( ids: Array<number>, ops: TOpsKind ) {
            let entityReference: undefined | string = undefined

            // the 'single' case,  used when this is called for switch status toggle intent
            if (ids.length === 1)
                entityReference = st_staff.getStaffByIdFromLocalStorage(ids[ 0 ])!.firstName

            st_staff.reqToggleStatus({ids})
            .then(() => tfyCRUDSuccess(ENTITY_NAMES.STAFF, ops, entityReference))
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, ops))
        }

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
         * Handler for the intent of edit a record from the table
         * @param rowData data of the row
         */
        function nav_RowEdit( rowData: IStaffRow ) {
            router.push({
                name:   RoutePathNames.staffForm,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id,
                }
            })
        }

        function nav_CreateStaff() {
            router.push({
                name  : RoutePathNames.staffForm,
                params: {
                    fmode: FMODE.CREATE as TFormMode,
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        /**
         * Handler for the intent of deleting a row from the table
         * @param entityId object identifier to be deleted
         */
        const h_intentRowDelete = async ( entityId: number ): Promise<void> => {
            const entityReference = st_staff.getStaffByIdFromLocalStorage(entityId)!.firstName

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.STAFF, entityReference)
            if (wasConfirmed) a_reqDelete([ entityId ], entityReference)
        }

        function h_reqQuery( _: IDataTableQuery ) {
            a_reqQuery()
        }

        async function h_intentBulkAction( bulkData: IBulkData ) {

            // This is a somewhat hacky way of cast string to int in typescript. It has to do with type coercion, and
            // it is a pain to deal with in JS. I use this way because is visually placement and beautiful, in some way;
            // for a more readable form, use v => parseInt (v) | v => +v
            const dataIds = bulkData.ids.map(Number)

            if (bulkData.actionType === BULK_ACTIONS.REMOVE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.STAFF)
                if (wasConfirmed) a_reqDelete(dataIds)
            }
            else if (bulkData.actionType === BULK_ACTIONS.ENALBE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.ACTIVATE, ENTITY_NAMES.STAFF, '', '', true)
                if (wasConfirmed) {
                    // need to enable all selected disabled stores. Filter the staff to find whether Id from the staff in the local store
                    // actually is in the given Id list ... and also check the Staff isn't active already in the local store
                    // I think this checks should be done to be resilient about imprecision may appears between the component id collection and the store or local store id collection (single source of truth)
                    let ids = st_staff.entityPage.filter(s => dataIds.indexOf(s.id) !== -1 && !s.isActive).map(s => s.id)
                    if (ids.length > 0) a_reqSwitchState(ids, OPS_KIND_STR.ENABLE)
                }
            }
            else if (bulkData.actionType === BULK_ACTIONS.DISABLE) {
                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DEACTIVATE, ENTITY_NAMES.STAFF, '', '', true)
                if (wasConfirmed) {
                    // disable case, same as enable but with the disable state ... and also check the Staff isn't disabled already in the local store
                    // I think this checks should be done to be resilient about imprecision may appears between the component id collection and the store or local store id collection (single source of truth)
                    let ids = st_staff.entityPage.filter(s => dataIds.indexOf(s.id) !== -1 &&  s.isActive).map(s => s.id)
                    if (ids.length > 0) a_reqSwitchState(ids, OPS_KIND_STR.DISABLE)
                }
            }
        }

        function h_intentToggleEnable( id: number ) {
            a_reqSwitchState([id], OPS_KIND_STR.ENABLE)
        }

        function h_intentToggleDisable( id: number ) {
            a_reqSwitchState([id], OPS_KIND_STR.DISABLE)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            columns,
            headerFilters,
            st_staff,
            st_pagination,

            h_reqQuery,
            nav_CreateStaff,
            h_intentBulkAction,

            nav_RowEdit,
            h_intentRowDelete,
            h_intentToggleEnable,
            h_intentToggleDisable
        }
    }
})
</script>

<style scoped>
</style>
