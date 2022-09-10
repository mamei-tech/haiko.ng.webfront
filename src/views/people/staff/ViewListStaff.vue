<template>
    <transition appear name="page-fade">
        <p>welcome to the CLIENT LIST section</p>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import { useStaffStore } from '@/stores/staff'
import { useToast } from 'vue-toastification'
import { queryBase } from '@/services/definitions'
import useToastify from '@/services/composables/useToastify'

export default defineComponent({
    name: 'ViewListStaff',
    components: {},
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const staffStore = useStaffStore()

        const toast = useToast() // The toast lib interface
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

        return {}
    }

})
</script>

<style scoped>
</style>
