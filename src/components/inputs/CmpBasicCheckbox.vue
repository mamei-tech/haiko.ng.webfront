<template>
    <div class="form-group">
        <!-- INPUT -->
        <div class="form-check">
            <label class="form-check-label">
                <input class="form-check-input"
                       type="checkbox"
                       :checked="checked"
                       @change="h_change">
                <span class="form-check-sign"></span>{{ labelStatus ? labels[0] : labels[1] }}
            </label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import type { SetupContext } from 'vue'


export default defineComponent({
    name:  'CmpBasicCheckbox',
    props: {
        name:         {
            type:        String,
            description: 'The name of the input'
        },
        checked:      {
            type:        Boolean,
            description: 'Input value'
        },
        labels:       {
            type:        Array,
            description: 'Labels for when the value is true (position 0) or when is false (position 1)'
        },
        identifier_a: {
            type:        String,
            description: 'This props may come in handy when we need to feedback the parent component with identifier info, firing the "statusChanged" event'
        },
        identifier_b: {
            type:        String,
            description: 'This props may come in handy when we need to feedback the parent component with identifier info, firing the "statusChanged" event'
        }
    },
    setup( props, ctx: SetupContext ) {

        //region ======== DECLARATIONS & LOCAL STATE ==========================================

        const labelStatus = ref(props.checked)

        //endregion ===========================================================================
        //region ======= HOOKS ================================================================

        //endregion ===========================================================================

        //region ======= FETCHING DATA & ACTIONS ==============================================
        //endregion ===========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================
        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================
        //endregion ===========================================================================

        //region ======== EVENTS HANDLERS & WATCHERS ============================================

        const h_change = ( e: Event ) => {
            e.preventDefault()

            const target = (<HTMLInputElement> e.target)
            labelStatus.value = target.checked
            ctx.emit(
                    'statusChanged',
                    props.name as string, target.checked, props.identifier_a, props.identifier_b)
        }

        watch(() => [ props.checked ], () => {
            labelStatus.value = props.checked

            // if we don't watch this, then  the label just update / react on component mounted (first time) or
            // when we click on the check component, but not if the status of the component is change programmatically
            // from the outside ... for some reason
        })

        //endregion =============================================================================

        return {
            labelStatus,
            h_change
        }
    },
    emits: [ 'statusChanged' ]
})
</script>
