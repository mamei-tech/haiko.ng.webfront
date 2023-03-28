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
        name: 'CmpBasicCheckbox',
        props: {
            name: {
                type: String,
                description: "The name of the input"
            },
            checked: {
                type: Boolean,
                description: "Input value"
            },
            labels: {
                type: Array,
                description: "Labels for when the value is true (position 0) or when is false (position 1)"
            }
        },
        setup( props, __: SetupContext ) {

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
            }

            //endregion =============================================================================

            return {
                status,

                hdlChange
            }
        }
    })
</script>
