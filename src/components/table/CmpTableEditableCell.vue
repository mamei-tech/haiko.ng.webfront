<template>

    <!-- non edition mode situation -->
    <td v-show="!isEditionMode" rowspan="1" colspan="1" @click.prevent="h_click" v-bind="$attrs">
        {{ value }}
    </td>

    <!-- edition mode situation -->
    <!--https://stackoverflow.com/questions/68803137/vue-3-passing-array-warning-extraneous-non-props-attributes-were-passed-to-comp-->
    <td v-show="isEditionMode" rowspan="1" colspan="1" @click.prevent="h_click" v-bind="$attrs">
        <!-- input -->
        <input class="form-control"
               ref="ref_input"

               :name="refField"
               :value="value"
               :type="inputType"

               :class="[ { 'text-right': alignTexRight }, { 'text-left': alignTexRight }]"

               @blur.prevent="h_blur"
               @keydown.enter.prevent="h_keydown"
        />

        <!-- error msg -->
        <label v-show="errorMessage" class="has-error mt-2">{{ errorMessage }}</label>
    </td>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'
import { KEYS } from '@/services/definitions'

import type { SetupContext } from 'vue'
import type { ICellUpdate } from '@/services/definitions'


export default defineComponent({
    name:  'CmpTableEditableCell',
    props: {
        cellData: {
            type:        [ String, Number ],
            description: 'The data to be rendered in the cell',
            required:    true
        },
        refId:    {
            type:        Number,
            description: 'Identifier entity that could be used as reference later',
            required:    true
        },
        refField: {
            type:        String,
            description: 'This is the field name of the entity. It the editable cell is intended, then it will comes in handy for telling parent components the actual entity\'s field name that was updated',
            required:    false
        },
        validation: {
            type: Function,
            description: 'A function of /services/definition/validation/ schema, to be used as a callback for validating the editable cell data when it changes',
            required:    false
        },
        inputType: {
            type: String,
            description: '',
            required:    false,
            default: 'text',
        },
        alignTexRight: {
            type: Boolean,
            description: 'Tell if we want to align text to RIGHT when the edit input is active (edition mode) on the cell',
            default: false,
        },
        alignTexLeft: {
            type: Boolean,
            description: 'Tell if we want to align text to LEFT when the edit input is active (edition mode) on the cell',
            default: false,
        },
    },
    emits: [
        'fieldUpdateIntent',            // to notice the entity field value (cell data) has updated / changed
    ],

    setup( props: any, ctx: SetupContext ) {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const isEditionMode = ref<boolean>(false)       // tell is the component (cell) should be rendered in edition mode, so the input value for editing should be enabled
        const isEditionLock = ref<boolean>(false)       // a flag value to lock the edition mode until input blur event or until enter (keydown) event, so the input remains on edition mode if an accidental click was made by the user
        const wasByKeyDown = ref<boolean>(false)        // a flags that intents to tell BLUR event not to trigger when KEYDOWN trigger, so we don't propagate the 'fieldUpdateIntent' emission twice
        const errorMessage = ref<string>('')            // reactive property holder for validation error message

        const ref_input = ref()                               // input fiel reference
        const value = ref<string | number>(props.cellData)

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================
        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Validating the value, updating the local table value, and then emitting the update to the parents component
         * @param newValue
         */
        const a_fireCellUpdate = ( newValue: any ) => {
            value.value = newValue                                  // first update the table cell with the value entered in the input, whether it is right or wrong
            if (!a_isFieldValid(newValue)) return                   // then validating the value

            // entered value was good, so we proceed to update
            isEditionLock.value = false
            isEditionMode.value = false

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
        const a_isFieldValid = (newValue: any) => {
            const r = props.validation(newValue)

            if(r === true) {
                errorMessage.value = ''
                return r
            }
            else {
                errorMessage.value = r
                return false
            }
        }

        //endregion ===========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================
        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================
        //endregion ===========================================================================

        //region ======== EVENTS HANDLERS & WATCHERS ==========================================

        watch(() => [ props.cellData ], () => {
            value.value = props.cellData
        })

        /**
         * If not locked already, then we lock and enable the edition mode
         */
        const h_click = () => {
            if (isEditionLock.value) return

            isEditionLock.value = true
            isEditionMode.value = !isEditionMode.value

            nextTick(() => { ref_input.value.focus() })       // https://stackoverflow.com/a/72093087/4196056
        }

        /**
         * If the input loses the focus, we disable the edition mode and unlock
         * @param evt HTML event
         */
        const h_blur = ( evt: any ) => {

            // bypassing if keypressed 'enter' was happen
            if(wasByKeyDown.value) {
                wasByKeyDown.value = false
                return
            }

            a_fireCellUpdate(evt.target.value)
        }

        /**
         * If the key pressed was enter, we disable the edition mode and unlock
         * @param evt
         */
        const h_keydown = ( evt: any ) => {
            if (evt.key !== KEYS.ENTER) return

            wasByKeyDown.value = true

            a_fireCellUpdate(evt.target.value)
        }

        //endregion ===========================================================================


        return {
            ref_input,

            value,
            errorMessage,
            isEditionMode,

            h_blur,
            h_click,
            h_keydown
        }
    }
})
</script>
