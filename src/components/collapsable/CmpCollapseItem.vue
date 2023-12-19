<template>

    <div class="row" @click.prevent="h_toggleCollapsable">
        <h5 class="text-sm-left text-md-right col-md-3 col-form-label">
            {{ title }}
        </h5>
        <div class="col-md-9 caret-container-narrow">
            <i class="tim-icons icon-minimal-down caret-form-section .caret-narrow"
               :class="rotationCaretClass"
            />
        </div>
        <hr class="collapsable-form-section-divisor hr-50">
    </div>

    <Transition name="collapsable">
        <div class="collapsable-div" v-if="doWeShowCollapsable">

            <!-- slot for custom content | default -->
            <slot></slot>

        </div>
    </Transition>

</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import type { SetupContext } from 'vue'

export default defineComponent({
    name:  'CmpCollapseItem',
    props: {
        title: {
            type:        String,
            description: 'title for the header of the collapsable item'
        }

    },
    setup( props: any, __: SetupContext ) {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const rotationCaretClass = ref('')                                       // rotate the caret | this is the CSS alternative, no Vue transition needed
        const doWeShowCollapsable = ref(false)                                   // start the animation of the actual collapsible

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================
        //endregion ===========================================================================

        //region ======= FETCHING DATA & ACTIONS ==============================================
        //endregion ===========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================
        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================
        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        const h_toggleCollapsable = () => {
            doWeShowCollapsable.value = !doWeShowCollapsable.value
            rotationCaretClass.value === 'rotate-up' ? rotationCaretClass.value = 'rotate-down' : rotationCaretClass.value = 'rotate-up'
        }

        //endregion ===========================================================================

        return {
            rotationCaretClass,
            doWeShowCollapsable,

            h_toggleCollapsable
        }
    }
})
</script>

<style lang="scss">
</style>
