<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.staff.name')"
                                  :entityMode="eMode"
                                  :columns="columns"
                                  :data="st_uom.entityPage"
                                  :has-actions="true"

                                  @navCreateIntent=""
                                  @requestIntent=""

                                  @deleteIntent=""
                                  @editIntent=""

                                  @bulkActionIntent=""

                                  @enableIntent=""
                                  @disableIntent=""
                    >
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useSt_UoM } from '@/stores/uom'
import useToastify from '@/services/composables/useToastify'
import { HUoMTable } from '@/services/definitions/data-datatables'
import { ENTITY_NAMES, ENTITY_TYPE, OPS_KIND_STR } from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'

import type { IColumnHeader } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListClients',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const st_uom = useSt_UoM()                                          // Pinia store for uom
        const eMode: ENTITY_TYPE = ENTITY_TYPE.COMMON

        const toast = useToast()                                            // The toast lib interface
        const columns = ref<Partial<IColumnHeader>[]>(HUoMTable)          // entity customized datatable header | As here the data for the filter is dynamically (side-effect) obtained, we need to use ref so we can fill the datas

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

            // getting the uom categories list data for populating the datatable (side effect)
            st_uom.reqStaffPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================
        //#endregion ==========================================================================

        //#region ======= ACTIONS =============================================================
        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================
        //#endregion ==========================================================================

        return {
            eMode,
            columns,
            st_uom
        }
    }

})
</script>

<style scoped>
</style>
