<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :entityMode="eMode"
                                  :columns="columns"
                                  :data="staffStore.getStaffList"
                                  :count="staffStore.getEntitiesCount"
                                  :has-actions="true"
                                  :filters="filters"
                    >
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff'
import { useToast } from 'vue-toastification'
import { EntityTypes, queryBase } from '@/services/definitions'
import { HStaffTable } from '@/services/definitions/data-datatables'
import { CmpCard, CmpDataTable } from '@/components'
import useToastify from '@/services/composables/useToastify'


export default defineComponent({
    name: 'ViewListStaff',
    components: {
        CmpCard,
        CmpDataTable
    },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const staffStore = useStaffStore()
        const eMode: EntityTypes = EntityTypes.Staff

        const toast = useToast()                                            // The toast lib interface
        const columns = HStaffTable
        const filters = [ 'storeType', 'isActive' ]

        const { tfyBasicFail } = useToastify(toast)

        //#endregion ==========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================

        /**
         * setup is called before component creation, so the onMounted hook is a good time / place to
         * invoke data population method through web API request.
         */
        onMounted(() => {

            // populate staff datatable
            staffStore.reqStaffPages(queryBase)
            .catch(err => tfyBasicFail(err, 'Staff', 'request'))
        })

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
            filters,

            staffStore
        }
    }

})
</script>

<style scoped>
</style>
