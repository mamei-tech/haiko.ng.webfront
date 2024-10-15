<template>
  <div
      class="table-cell-color"
      :style="{ backgroundColor: cellColor }"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type { SetupContext } from 'vue'


export default defineComponent({
    name:  'CmpTableColor',
    props: {
        cellColor: {
            type:        String,
            required:    true,
            default:     '#ffffff',
            description: 'Color to render, given in HEX format'
        }
    },
    setup( _, __: SetupContext ) {                                                                                      // setup( props, ctx: SetupContext ) {

        //region  ======== DECLARATIONS & LOCAL STATE =============================================
        //endregion ===============================================================================

        //region ======== COMPUTATIONS & GETTERS ==================================================
        //endregion ===============================================================================

        //#region ======= FETCHING DATA & ACTIONS =================================================
        //#endregion ==============================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===============================================
        //endregion ===============================================================================

        return {}
    }
})
</script>

<style lang="scss">
</style>


