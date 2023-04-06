<template>
    <div class="form-group">
        <!-- INPUT -->
        <div class="form-check">
            <label class="form-check-label">
                <input class="form-check-input"
                       type="checkbox"
                       :checked="status"
                       @change="hdlChange">
                <span class="form-check-sign"></span>{{ status ? labels[0] : labels[1] }}
            </label>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import type { SetupContext } from 'vue'


    export default defineComponent({
        name:  'CmpBasicCheckbox',
        props: {
            name:        {
                type:        String,
                description: 'The name of the input'
            },
            checked:     {
                type:        Boolean,
                description: 'Input value'
            },
            labels:      {
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

            //region ======== DECLARATIONS & LOCAL STATE ============================================

            const status = ref(props.checked)               // store the boolean status of the input

            //endregion =============================================================================

            //region ======= HOOKS ================================================================
            //endregion ===========================================================================

            //region ======= FETCHING DATA & ACTIONS ==============================================
            //endregion ===========================================================================

            //region ======= COMPUTATIONS & GETTERS ===============================================
            //endregion ===========================================================================

            //region ======= HELPERS ==============================================================
            //endregion ===========================================================================

            //region ======== EVENTS HANDLERS & WATCHERS ============================================

            const hdlChange = (_: Event) => {
                // @ts-ignore
                //  handleChange(evt.target!.checked)
                status.value = !status.value
                ctx.emit(
                        'statusChanged',
                        props.name as string, status.value, props.identifier_a, props.identifier_b)
            }

            //endregion =============================================================================

            return {
                status,

                hdlChange
            }
        },
        emits: ['statusChanged']
    })
</script>
