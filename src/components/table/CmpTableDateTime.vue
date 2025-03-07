<template>
  <!--:v-model.value="value"-->
  <input class="form-control"
         :name="refField"
         :value="value"
         :type="type"

         @input="h_change"
         @blur="h_onInputBlur"
         @focus="h_onInputFocused"

         v-bind="$attrs"
         ref="ref_inputDate"
  />

  <!-- Error Msg -->
  <label v-show="errorMessage" class="error">{{ errorMessage }}</label>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'

import type { SetupContext } from 'vue'
import type { ICellUpdate } from '@/services/definitions'


export default defineComponent({
    name:  'CmpTableDateTime',
    props: {
        refId:         {
            type:        Number,
            description: 'Identifier entity that could be used as reference later',
            required:    true
        },
        refField:      {
            type:        String,
            description: 'This is the field name of the entity. It the editable cell is intended, then it will comes in handy for telling parent components the actual entity\'s field name that was updated',
            required:    false
        },
        cellData:      {
            type:        [ String, Number ],
            description: 'The data to be rendered in the cell',
            required:    true
        },
        validation:    {
            type:        Function,
            description: 'A function of /services/definition/validation/ schema, to be used as a callback for validating the editable cell data when it changes',
            required:    false
        },
        alignTexRight: {
            type:        Boolean,
            description: 'Tell if we want to align text to RIGHT when the edit input is active (edition mode) on the cell',
            default:     false
        },
        alignTexLeft:  {
            type:        Boolean,
            description: 'Tell if we want to align text to LEFT when the edit input is active (edition mode) on the cell',
            default:     false
        },
        value:         {
            type:        [ Date ],
            description: 'Input value'
        },
        type:          {
            type:        String,
            description: 'The kind of date UI control',
            default:     'time',
            validation( value: string ) {
                return [ 'date', 'datetime-local', 'time', 'week', 'month' ].includes(value)
            }

            // references
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/time
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/week
            // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/month
        }
    },
    emits: [
        'fieldUpdateIntent'            // to notice the entity field value (cell data) has updated / changed
    ],
    setup( props: any, ctx: SetupContext ) {

        // we check some other alternatives of using HTML native control for datetime selection the creative-team
        // https://demos.creative-tim.com/vue-black-dashboard-pro/#/forms/extended | archivo en vue-black-dashboard-pro-v1.4.0 -> ExtendedForms.vue
        // https://demos.creative-tim.com/vue-soft-ui-dashboard-pro/#/pages/projects/new-project
        // libraries
        // https://flatpickr.js.org/examples/ | https://amsul.ca/pickadate.js/


        // #region  ======== DECLARATIONS & LOCAL STATE ============================================

        let isFocused      = ref<boolean>(false)
        const errorMessage = ref<string>('')                                // reactive property holder for validation error message

        const value = ref<string | number>(props.cellData)

        const ref_inputDate = ref<InstanceType<typeof HTMLInputElement>>()        // reference to warehouse default destination location

        // #endregion =============================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Validating the value, updating the local table value, and then emitting the update to the parents component
         * @param newValue
         */
        const a_fireCellUpdate = ( newValue: any ) => {
            value.value = newValue                                  // first update the table cell with the value entered in the input, whether it is right or wrong
            if (!a_isFieldValid(newValue)) return                   // then validating the value

            ctx.emit('fieldUpdateIntent', {
                entityId:     props.refId,
                entityField:  props.refField,
                updatedValue: value.value
            } as ICellUpdate)
        }

        /**
         * Validating the value according (callback) to a given validation function as a property
         * @param newValue Input value to be validated
         */
        const a_isFieldValid = ( newValue: any ) => {
            const r = props.validation(newValue)

            if (r === true) {
                errorMessage.value = ''
                return r
            }
            else {
                errorMessage.value = r
                return false
            }
        }

        //#endregion ===========================================================================

        //#region ======== COMPUTATIONS & GETTERS ================================================
        //#endregion =============================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS =============================================

        watch(() => [ props.cellData ], () => {
            if (value.value != props.cellData) value.value = props.cellData
        })

        const h_change = ( evt: any ) => {
            a_fireCellUpdate(evt.target.value)
        }

        const h_onInputFocused = () => {
            isFocused.value = true
        }

        const h_onInputBlur = () => {
            isFocused.value = false
        }

        //#endregion =============================================================================

        return {
            errorMessage,

            isFocused,

            value,

            h_change,
            h_onInputBlur,
            h_onInputFocused,

            ref_inputDate
        }
    }
})
</script>

<style scoped>
</style>
