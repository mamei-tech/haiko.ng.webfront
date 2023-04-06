<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.role.name')"
                                  :entityMode="eMode"
                                  :columns="columns"
                                  :data="st_rbac.entityPage"
                                  :has-actions="true"

                                  @navCreateIntent="h_navCreateRole"
                                  @requestIntent="h_reqQuery"

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
import { ENTITY_NAMES, ENTITY_TYPE, FMODE, OPS_KIND_STR, RoutePathNames } from '@/services/definitions'
import { useRouter } from 'vue-router'
import { useSt_Rbac } from '@/stores/rbac'
import { useToast } from 'vue-toastification'
import useToastify from '@/services/composables/useToastify'
import { HRolesTable } from '@/services/definitions/data-datatables'

import type { IDtoRole, IDataTableQuery, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListRoles',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const st_rbac = useSt_Rbac()                                        // Pinia store for rbac / roles
        const eMode: ENTITY_TYPE = ENTITY_TYPE.COMMON_NOEJC

        const router = useRouter()
        const toast = useToast()                                            // The toast lib interface
        const columns = HRolesTable                                         // entity customized datatable header

        const { tfyCRUDFail } = useToastify(toast)

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
        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================

        const h_navCreateRole = ():void => {
            router.push({
                name  : RoutePathNames.rolesCreate,
                params: {
                    fmode: FMODE.CREATE as TFormMode,
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        const h_intentRowDelete = ( objectId: number ): void => {
            console.log('row deletion intention')
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

        const h_reqQuery = ( _: IDataTableQuery ): void => {
            console.log('request query intention')
        }

        //#endregion ==========================================================================

        return {
            eMode,
            columns,
            st_rbac,

            h_reqQuery,
            h_navRowEdit,
            h_navCreateRole,
            h_intentRowDelete
        }
    }

})
</script>

<style scoped>
</style>
