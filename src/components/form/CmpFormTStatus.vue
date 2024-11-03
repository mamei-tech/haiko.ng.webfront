<template>

  <!-- 4 normal size view -->
  <div class="inv-ops-status inv-ops-container-sm-none" :title="$t('data.process-state.state-dsc')">

    <div class="inv-ops-status-step" :class="[{'active': state === INV_STATUS.DRAFT}]">
      {{ $t( 'data.process-state.draft' ) }}
    </div>

    <div class="inv-ops-status-step" :class="[{'active': state === INV_STATUS.WAITING}]">
      {{ $t( 'data.process-state.waiting' ) }}
    </div>

    <div class="inv-ops-status-step" :class="[{'active': state === INV_STATUS.READY}]">
      {{ $t( 'data.process-state.ready' ) }}
    </div>

    <div class="inv-ops-status-step" :class="[{'active': state === INV_STATUS.DONE}]">
      {{ $t( 'data.process-state.done' ) }}
    </div>

  </div>

  <!-- 4 small size view -->
  <div class="inv-ops-status inv-ops-container-md-none">

    <div v-if="state === INV_STATUS.DRAFT" class="inv-ops-status-step-sm"
         :class="[{'active': state === INV_STATUS.DRAFT}]">
      {{ $t( 'data.process-state.draft' ) }}
    </div>

    <div v-else-if="state === INV_STATUS.WAITING" class="inv-ops-status-step-sm"
         :class="[{'active': state === INV_STATUS.WAITING}]">
      {{ $t( 'data.process-state.waiting' ) }}
    </div>

    <div v-else-if="state === INV_STATUS.READY" class="inv-ops-status-step-sm"
         :class="[{'active': state === INV_STATUS.READY}]">
      {{ $t( 'data.process-state.ready' ) }}
    </div>

    <div v-else-if="state === INV_STATUS.DONE" class="inv-ops-status-step-sm"
         :class="[{'active': state === INV_STATUS.DONE}]">
      {{ $t( 'data.process-state.done' ) }}
    </div>

  </div>

</template>


<script lang="ts">
import { defineComponent } from 'vue'
import { i18n } from '@/services/i18n'
import { INV_STATUS } from '@/services/definitions'

import type { SetupContext } from 'vue'


export default defineComponent({
    name:       'CmpFormTStatus',                                       // CmpFormTStatus = T = transfer | its meant to display the current status of a transfer
    components: {},
    props:      {
        state: {
            type:        String,
            description: 'Current state of the process'
        }
    },
    // emits:      [ 'deleteIntent', 'cancelIntent', 'saveIntent' ],
    setup( props, ctx: SetupContext ) {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================
        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================
        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================
        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================
        //endregion ===========================================================================

        return {
            INV_STATUS
        }
    }
})
</script>

<style scoped>
</style>
