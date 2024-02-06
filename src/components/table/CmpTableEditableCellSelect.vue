<template>

    <!-- non edition mode situation -->
    <td v-show="!isEditionMode" rowspan="1" colspan="1" @click.prevent="h_click" v-bind="$attrs">
        {{ cpt_cellText }}
    </td>

    <!-- edition mode situation -->
    <!--https://stackoverflow.com/questions/68803137/vue-3-passing-array-warning-extraneous-non-props-attributes-were-passed-to-comp-->
    <td v-show="isEditionMode" rowspan="1" colspan="1" v-bind="$attrs">
        <!-- input -->
        <multiselect
                :options="options"
                :placeholder="placeholder"
                :searchable="searchable"
                :closeOnSelect="true"
                :mode="'single'"
                @change="h_OnChangeWrap"
                @open="h_onOpenWrap"
        />

    </td>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import Multiselect from '@vueform/multiselect'

import type { SetupContext } from 'vue'
import type { ICellUpdate, IMultiselectBasic } from '@/services/definitions'


export default defineComponent({
    name:  'CmpTableEditableCellSelect',
    components: { Multiselect },
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
        options:       {
            type:        [ Object, Array ],
            required:    true,
            description: 'Set of options to pick from'
        },
        placeholder:   {
            type:     String,
            description: 'A placeholder to guide the user in the UI',
            required: false
        },
        searchable:    {
            description: 'Tells if the component must handle user input to filter available options',
            type:        Boolean,
            default:     false,
            required:    false
        }
    },
    emits: [
        'fieldUpdateIntent',            // to notice the entity field value (cell data) has updated / changed
        'openhapend'                    // to notice when the select open its window
    ],

    setup( props: any, ctx: SetupContext ) {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const isEditionMode = ref<boolean>(false)       // tell is the component (cell) should be rendered in edition mode, so the input value for editing should be enabled
        const isEditionLock = ref<boolean>(false)       // a flag value to lock the edition mode until input blur event or until enter (keydown) event, so the input remains on edition mode if an accidental click was made by the user

        const value = ref<string | number>(props.cellData)   // just save the selection made by the user in the select

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================
        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================
        //endregion ===========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        /**
         * This is a computed value that comes in handy to render the label (it has more meaning than a value)
         * that match to the current value of the cell
         *
         * If nothing match,
         */
        const cpt_cellText = computed((): string => {

            let cellText = props.placeholder

            props.options.find(( option: IMultiselectBasic ) => {

                if (option.value == props.cellData) {
                    cellText = option.label
                    return
                }
            })

            return cellText
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================
        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        watch(() => [ props.cellData ], () => {
            value.value = props.cellData
        })

        /**
         * This may come in handy when a parent component needs to trigger something after this
         * select changes
         *
         * @param newSelectedValue ... wel this is self explanatory
         */
        const h_OnChangeWrap = ( newSelectedValue: any ) => {
            isEditionLock.value = false
            isEditionMode.value = false

            value.value = newSelectedValue ?? 0

            ctx.emit('fieldUpdateIntent', {
                entityId:     props.refId,
                entityField:  props.refField,
                updatedValue: value.value
            } as ICellUpdate)
        }

        /**
         * This may come in handy when a parent component needs to trigger something after
         * the select opens its window
         *
         * @param selectInstance MultiSelect instance reference
         */
        const h_onOpenWrap = ( selectInstance: Multiselect ) => {
            ctx.emit('openhapend', selectInstance)
        }

        /**
         * If not locked already, then we lock and enable the edition mode
         */
        const h_click = () => {
            if (isEditionLock.value) return

            isEditionLock.value = true
            isEditionMode.value = true
        }

        //endregion ===========================================================================


        return {
            isEditionMode,

            cpt_cellText,

            h_click,
            h_onOpenWrap,
            h_OnChangeWrap,
        }
    }
})
</script>
