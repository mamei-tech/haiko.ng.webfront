<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.staff.name')"
                                  :entityMode="eMode"
                                  :columns="columns"
                                  :data="staffStore.getStaffList"
                                  :count="staffStore.getEntitiesCount"
                                  :has-actions="true"
                                  :filters="filters"

                                  @navCreateIntent="h_navCreateStaff"
                                  @requestIntent="h_reqQuery"

                                  @deleteIntent="h_intentRowDelete"
                                  @editIntent="h_intentRowEdit"

                                  @bulkActionIntent="h_BulkActionIntent"
                    >
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { defineComponent, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useStaffStore } from '@/stores/staff'
import { useNomencStore } from '@/stores/nomenc'
import { HStaffTable } from '@/services/definitions/data-datatables'
import { ACTION_KIND_STR, BULK_ACTIONS, ENTITY_NAMES, FMODE, OPS_KIND_STR, RoutePathNames } from '@/services/definitions'
import { EntityTypes, queryBase } from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'
import useDialogfy from '@/services/composables/useDialogfy'
import useToastify from '@/services/composables/useToastify'

import type { TFormMode, IDataTableQuery, IBulkData, IStaffRow } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListStaff',
    components: {
        CmpCard,
        CmpDataTable
    },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const {t} = useI18n({useScope: 'global'})

        const staffStore = useStaffStore()                                  // Pinia store for staff
        const nomencStore = useNomencStore()                                // Pinia store for nomenclatures
        const eMode: EntityTypes = EntityTypes.Staff

        const router = useRouter()
        const toast = useToast()                                            // The toast lib interface
        const columns = HStaffTable                                         // entity customized datatable header
        const filters = [ 'roleId', 'isActive' ]                            // datatable filters

        const { tfyBasicSuccess, tfyBasicFail } = useToastify(toast)
        const { dialogfyConfirmation } = useDialogfy()

        //#endregion ==========================================================================

        //region ======== HOOKS ===============================================================

        /**
         * setup is called before component creation, so the onMounted hook is a good time / place to
         * invoke data population method through web API request.
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(() => {

            // getting roles definitions from the system (side effect)
            // this is used to fetch staff roles data from the system so we can map the roleId to rolename in the datatable column
            nomencStore.reqNomencRoles().catch(err => tfyBasicFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.REQUEST))

            // getting the staff list data for populating staff datatable (side effect)
            staffStore.reqStaffPages(queryBase).catch(err => tfyBasicFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================
        // ❗ this functions here for fetching data could be async await functions easily, if is needed

        function a_reqQuery( queryData: IDataTableQuery ) {
            staffStore.reqStaffPages(queryData).catch(err => tfyBasicFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
        }

        /**
         * Request the deletion (from server) of a entities according to the list of identifiers given as parameters
         *
         * @param ids List of entities identifiers
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        function a_reqDelete( ids: Array<number> , ref: undefined | string = undefined ) {
            staffStore.reqStaffDeletion({ ids }).then(() => {

                tfyBasicSuccess(ENTITY_NAMES.STAFF, OPS_KIND_STR.DELETION, ref)

                // If a user delete all the records from a page of the table, then the table becomes empty, so in this case we need to make a request for the remains data (in the server, ... if any) and repopulate the table / page
                if (staffStore.pageSize == 0 && staffStore.totalRecords > 0)
                    staffStore.reqStaffPages(queryBase).catch(err => tfyBasicFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))

            }).catch(err => tfyBasicFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.DELETION, ref))
        }

        function a_bulkSwitchState( ids: Array<number> ) {
            staffStore.reqToggleStatus({ids})
            .then(() => tfyBasicSuccess(ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
            .catch(err => tfyBasicFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.UPDATE))
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================

        /**
         * Handler for the intent of deleting a row from the table
         * @param objectId object identifier to be deleted
         */
        async function h_intentRowDelete( objectId: number ) {
            // some aux vars
            const entityReference =staffStore.getStaffByIdFromLocalStorage(objectId)!.firstName

            const wasConfirmed = await dialogfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.STAFF, entityReference)
            if (wasConfirmed) a_reqDelete([ objectId ], entityReference)
        }

        /**
         * Handler for the intent of edit a record from the table
         * @param rowData data of the row
         */
        function h_intentRowEdit( rowData: IStaffRow ) {
            router.push({
                name:   RoutePathNames.staffEdit,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id,
                }
            })
        }

        function h_navCreateStaff() {
            router.push({
                name  : RoutePathNames.staffCreate,
                params: {
                    fmode: FMODE.CREATE as TFormMode,
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        function h_reqQuery( queryData: IDataTableQuery ) {
            a_reqQuery(queryData)
        }

        async function h_BulkActionIntent( bulkData: IBulkData ) {

            // This is a somewhat hacky way of cast string to int in typescript. It has to do with type coercion, and
            // it is a pain to deal with in JS. I use this way because is visually placement and beautiful, in some way;
            // for a more readable form, use v => parseInt (v)
            const dataIds = bulkData.ids.map(v => +v)
            if (bulkData.actionType === BULK_ACTIONS.REMOVE) {
                const wasConfirmed = await dialogfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.STAFF)
                if (wasConfirmed) a_reqDelete(dataIds)
            }
            else if (bulkData.actionType === BULK_ACTIONS.ENALBE) {
                const wasConfirmed = await dialogfyConfirmation(ACTION_KIND_STR.ACTIVATE, ENTITY_NAMES.STAFF, '', true)
                if (wasConfirmed) {
                    // need to enable all selected disabled stores. Filter the staff to find whether Id from the staff in the local store
                    // actually is in the given Id list ... and also check the Staff isn't active already in the local store
                    let ids = staffStore.entityPage.filter(s => dataIds.indexOf(s.id) !== -1 && !s.isActive).map(s => s.id)
                    if (ids.length > 0) a_bulkSwitchState(ids)
                }
            }
            else {
                const wasConfirmed = await dialogfyConfirmation(ACTION_KIND_STR.DEACTIVATE, ENTITY_NAMES.STAFF, '', true)
                if (wasConfirmed) {
                    // disable case, same as enable but with the disable state ... and also check the Staff isn't disabled already in the local store
                    let ids = staffStore.entityPage.filter(s => dataIds.indexOf(s.id) !== -1 &&  s.isActive).map(s => s.id)
                    if (ids.length > 0) a_bulkSwitchState(ids)
                }
            }
        }

        //#endregion ==========================================================================

        return {
            eMode,
            columns,
            filters,
            staffStore,

            h_reqQuery,
            h_navCreateStaff,
            h_BulkActionIntent,

            h_intentRowEdit,
            h_intentRowDelete
        }
    }

})
</script>

<style scoped>
</style>
