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

                        @navCreateIntent=""
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
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'
import { CmpCard, CmpDataTable } from '@/components'
import {
    ACTION_KIND_STR,
    ENTITY_NAMES,
    DT_ACTIONBAR_MODE,
    FMODE,
    OPS_KIND_STR,
    RoutePathNames,
    HRolesTable,
    DT_ACTION_BUTTON_MODE, KEYS,
} from '@/services/definitions'
import { useRouter } from 'vue-router'
import { useSt_Rbac } from '@/stores/rbac'
import { useSt_Pagination } from '@/stores/pagination'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'

import type { TFormMode, IIndexable } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListRoles',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const st_rbac = useSt_Rbac()                                                        // Pinia store for rbac / roles
        const st_pagination = useSt_Pagination()                                            // Pinia instance of pagination store

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                        // datatable action bar mode
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

            window.addEventListener('keydown', h_keyboardKeyPress)                                        // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
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
        const nav_2Form = (mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined ) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            router.push({
                name:   RoutePathNames.rolesForm,
                params: params
            })
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        const h_intentRowDelete = async ( entityId: number ): Promise<void> => {
            const entityReference = st_rbac.getRoleByIdFromLocalStorage(entityId)!.rName

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.ROLE, entityReference)
            if (wasConfirmed) a_reqDelete([ entityId ], entityReference)
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            columns,
            st_rbac,

            nav_2Form,

            h_intentRowDelete
        }
    }

})
</script>

<style scoped>
</style>
