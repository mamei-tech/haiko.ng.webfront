<template>

  <!-- non edition mode situation -->
  <td v-show="!isEditionMode" rowspan="1" colspan="1" @click.prevent="h_click" v-bind="$attrs">
    {{ text }}
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
        :name="cmp_name"

        @close="h_closing"
        @clear="h_clearing"
        @open="h_onOpenWrap"
        @change="h_OnChangeWrap"
        @search-change="h_onWriteSearch"
    />

  </td>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch, nextTick } from 'vue'
import Multiselect from '@vueform/multiselect'
import useCommon from '@/services/composables/useCommon'

import type { SetupContext } from 'vue'
import type { ICellUpdate, IMultiselectBasic } from '@/services/definitions'


export default defineComponent({
    name:       'CmpTableEditableCellSelect',
    components: { Multiselect },
    props:      {
        cellData:    {
            type:        [ String, Number ],
            description: 'The data to be rendered in the cell. If you want to set to default you have to use -1 or empty-string',
            required:    true
        },
        refId:       {
            type:        Number,
            description: 'Identifier entity that could be used as reference later',
            required:    true
        },
        refField:    {
            type:        String,
            description: 'This is the field name of the entity. It the editable cell is intended, then it will comes in handy for telling parent components the actual entity\'s field name that was updated',
            required:    false
        },
        options:     {
            type:        [ Object, Array ],
            required:    true,
            description: 'Set of options to pick from'
        },
        placeholder: {
            type:        String,
            description: 'A placeholder to guide the user in the UI',
            default:     '',
            required:    false
        },
        searchable:  {
            description: 'Tells if the component must handle user input to filter available options',
            type:        Boolean,
            default:     false,
            required:    false
        }
    },
    emits:      [
        'openhapend',                   // to notice when the select open its window
        'writehapend',                  // to notice when something was written in the select search input
        'editionModeSts',               // to notice parents components, if this one is on edition mode | editionModeSts = edition mode status
        'fieldUpdateIntent'             // to notice the entity field value (cell data) has updated / changed
    ],

    setup( props: any, ctx: SetupContext ) {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { isUndEmpZero } = useCommon()

        const isEditionMode = ref<boolean>(false)          // tell is the component (cell) should be rendered in edition mode, so the input value for editing should be enabled
        const isEditionLock = ref<boolean>(false)          // a flag value to lock the edition mode until input blur event or until enter (keydown) event, so the input remains on edition mode if an accidental click was made by the user

        const value = ref<string | number>(props.cellData)       // just save the selection made by the user in the select
        const text  = ref<string | number>(props.placeholder)     // default set up for the cell text of the row to be displayed when edit mode isn't on

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================

        onMounted(async () => {

            // we try to set the proper string in to the cell data according to the given props from the parent
            if (props.cellData == null) text.value = props.placeholder
            else {
                text.value = hpr_guessCellText(props.cellData)
                if (text.value == '' || text.value == undefined) text.value = props.placeholder
            }
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================
        //endregion ===========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        /**
         * compute a 'name' to be use as name in the multiselect HTML component. This could come in handy in event
         * propagation in parent Vue components to identify the specific UI control that trigger the events
         */
        const cmp_name = computed(() => {
            return `${ props.refId }.${ props.refField }`
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Search for the correspondent label (cell text) of the given value, in to the (also) given select option
         * @param search4
         */
        const hpr_guessCellText = ( search4: string | number ): string => {
            let label = ''

            props.options.find(( option: IMultiselectBasic ) => {
                if (option.value == search4) label = option.label
                return
            })

            return label
        }

        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        watch(() => [ props.cellData ], () => {
            value.value = props.cellData

            !isUndEmpZero(value.value)
                ? text.value  = hpr_guessCellText(value.value)
                : text.value = ''
        })

        watch(isEditionMode, () => {
            ctx.emit('editionModeSts', isEditionMode.value)
        })

        /**
         * So if the selected value was cleared, we need to lock the edition mode
         * @param evt Multiselect instance
         */
        const h_clearing = ( evt: any ) => {
            nextTick(() => {
                isEditionLock.value = true
            })
        }

        /**
         * If its a closing situation and we have no value selected, we should lock the edition mode, so no new row
         * can be created in the datatable
         *
         * @param evt Multiselect instance
         */
        const h_closing = ( evt: any ) => {
            nextTick(() => {
                if (isUndEmpZero(evt.internalValue.value)) isEditionLock.value = true
            })
        }

        /**
         * This may come in handy when a parent component needs to trigger something after this
         * select changes
         *
         * @param newSelectedValue ... wel this is self explanatory
         */
        const h_OnChangeWrap = ( newSelectedValue: any ) => {

            if (newSelectedValue != null)
            {
                isEditionLock.value = false
                isEditionMode.value = false
            }

            value.value = newSelectedValue ?? 0
            text.value  = hpr_guessCellText(newSelectedValue)

            ctx.emit('fieldUpdateIntent', {
                entityId:     props.refId,
                entityField:  props.refField,
                updatedValue: value.value
            } as ICellUpdate)

            // TIP as we are setting the HTML name property to a compound with the id and the name of the field (see 'cmp_name') we could remove the explicit emission of 'entityId' and 'entityField'
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
         * Hooks the moment after a character is typed in the select search input
         *
         * @param characterWritten Text written in the search input
         */
        const h_onWriteSearch = ( characterWritten: string ) => {
            if (characterWritten.length >= 3)
                ctx.emit('writehapend', characterWritten, cmp_name.value)
        }

        /**
         * If not locked already, then we lock and enable the edition mode
         */
        const h_click = () => {
            if (isEditionLock.value && isEditionMode.value) return

            isEditionLock.value = true
            isEditionMode.value = true
        }

        //endregion ===========================================================================


        return {
            isEditionMode,

            text,
            cmp_name,

            h_click,
            h_closing,
            h_clearing,
            h_onOpenWrap,
            h_OnChangeWrap,
            h_onWriteSearch
        }
    }
})
</script>
