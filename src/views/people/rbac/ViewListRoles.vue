<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.role.name')"

                                  :action-bar-mode="abar_mode"
                                  :action-btn-mode="abutton_mode"

                                  :columns="columns"
                                  :data="st_rbac.entityPage"
                                  :has-actions="true"

                                  @deleteIntent="h_intentRowDelete"
                                  @editIntent="h_navRowEdit"
                    >
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { CmpCard, CmpDataTable } from '@/components'
import {
    ACTION_KIND_STR,
    ENTITY_NAMES,
    DT_ACTIONBAR_MODE,
    FMODE,
    OPS_KIND_STR,
    RoutePathNames,
    HRolesTable,
    DT_ACTION_BUTTON_MODE
} from '@/services/definitions'
import { useRouter } from 'vue-router'
import { useSt_Rbac } from '@/stores/rbac'
import { useSt_Pagination } from '@/stores/pagination'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'

import type { IDtoRole, IDataTableQuery, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListRoles',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const st_rbac = useSt_Rbac()                                                        // Pinia store for rbac / roles
        const st_pagination = useSt_Pagination()                                            // Pinia instance of pagination store

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.NOEJC                        // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = HRolesTable                                                         // entity customized datatable header

        const router = useRouter()
        const toast = useToast()                                            // The toast lib interface

        const { tfyCRUDFail, tfyCRUDSuccess } = useToastify(toast)
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
            // getting the roles list data for populating staff datatable (side effect)
            st_rbac.reqRolePages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.REQUEST))
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================
        //#endregion ==========================================================================

        //#region ======= ACTIONS =============================================================

        /**
         * Request the deletion (from server) of a entities according to the list of identifiers given as parameters
         *
         * @param ids List of entities identifiers
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async ( ids: Array<number>, ref: undefined | string = undefined ): Promise<void> => {
            st_rbac.reqRoleDeletion({ ids }).then(() => {

                tfyCRUDSuccess(ENTITY_NAMES.ROLE, OPS_KIND_STR.DELETION, ref)

                // if a user delete all the records from a page of the table, then the table becomes empty, so in this case we need to make a request for the remains data (in the server, ... if any) and repopulate the table / page
                if (st_pagination.recordsOnPage == 0 && st_pagination.totalRecords > 0)
                    st_rbac.reqRolePages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.REQUEST))

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================

        const h_navCreateRole = (): void => {
            router.push({
                name:   RoutePathNames.rolesCreate,
                params: {
                    fmode: FMODE.CREATE as TFormMode
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        const h_intentRowDelete = async ( objectId: number ): Promise<void> => {
            const entityReference = st_rbac.getRoleByIdFromLocalStorage(objectId)!.rName

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.ROLE, entityReference)
            if (wasConfirmed) a_reqDelete([ objectId ], entityReference)
        }

        const h_navRowEdit = ( rowData: IDtoRole ): void => {
            router.push({
                name:   RoutePathNames.rolesEdit,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id
                }
            })
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            columns,
            st_rbac,

            h_navRowEdit,
            h_navCreateRole,
            h_intentRowDelete
        }
    }

})
</script>

<style scoped>
</style>
