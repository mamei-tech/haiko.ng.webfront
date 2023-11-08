<template>
    <div class="form-group">

        <!-- INPUT -->
        <div class="form-check">
            <label class="form-check-label">
                <input class="form-check-input"
                       type="checkbox"
                       v-bind="$attrs"
                       :checked="value"
                       @change="hdlChange">
                <span class="form-check-sign"></span>{{ value ? labels[0] : labels[1] }}
            </label>
        </div>
    </div>
</template>

<script lang="ts">
    import { useField } from "vee-validate"
    import { defineComponent } from 'vue'

    /*
    * U may wonder why we have two CheckBox components. This one comes in handy when we need to used alongside
    * a form integrated with
    * */
    export default defineComponent({
        name:  'CmpVeeCheckbox',
        props: {
            name:    {
                type:        String,
                description: 'The name of the input'
            },
            checked: {
                type:        Boolean,
                description: 'Input value'
            },
            labels:  {
                type:        Array,
                description: 'Labels for when the value is true (position 0) or when is false (position 1)'
            }
        },
        emits: [ 'chkboxchange' ],
        setup( props: any, context: any ) {

            //region ======== DECLARATIONS & LOCAL STATE ============================================
            const { value, handleChange } = useField(props.name as string, '', { initialValue: props.checked })
            //endregion =============================================================================

            //region ======== EVENTS HANDLERS & WATCHERS ============================================
            const hdlChange = ( evt: any ) => {
                handleChange(evt.target!.checked)
                context.emit('chkboxchange', evt.target!.checked)
            }
            //endregion =============================================================================

            return {

                value,
                hdlChange
            }
        }
    })
</script>
