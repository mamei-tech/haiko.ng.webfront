<template>
    <span v-for="(unit, i) in units" :key="unit.id" class="mr-1">

        <a v-if="unit.uType === 0" class="badge badge-pill bg-primary">{{ unit.uName }}</a>
        <a v-else-if="!unit.isActive" class="badge badge-pill bg-dark">{{ unit.uName }}</a>
        <a v-else class="badge badge-pill bg-default">{{ unit.uName }}</a>

    </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import type { SetupContext } from 'vue'


/**
 * This is a component just for listing pills based on text.
 * This is the version for HUoMCatTable | listOPillsUoM
 *
 * According the type of the unit in the category it belongs to (less than, greater than or the referece unit in the category)
 * this component render the correspondan pill
 */
export default defineComponent({
    name:  'CmpCellListUoM',
    props: {
        units: {
            type:        Array,
            description: 'List of units that belongs to the same categories'
        }
    },
    setup( props: any, ctx: SetupContext ) {

        //region ======== DECLARATIONS & LOCAL STATE ============================================
        //endregion =============================================================================

        //region ======== HOOKS =================================================================
        //endregion =============================================================================

        //region ======== COMPUTATIONS & GETTERS ================================================
        //endregion =============================================================================

        //region ======== EVENTS HANDLERS & WATCHERS ============================================
        //endregion =============================================================================

        //region ======== WATCHERS ==============================================================
        //endregion =============================================================================

        //region ======== HELPERS ===============================================================
        //endregion =============================================================================

        return {}
    }
})
</script>

<style lang="scss" scoped>
</style>
