<template>

    <!-- LABEL -->
    <div class="form-group"
         :class="{
            'has-danger': !!errorMessage && type !== 'hidden',
            'has-success': meta.valid && type !== 'hidden',
        }">

        <slot name="label">
            <label v-if="label" class="control-label">{{ label }}</label>
        </slot>

        <!-- INPUT -->
        <!-- Wrap the multiselect component's slots inside our own slots -->
        <!-- so this component can provide a way to customize the multiselect -->
        <!-- at the time it provides support for Field forms -->
        <multiselect :options="options"
                     :placeholder="placeholder"
                     :searchable="searchable"
                     :closeOnSelect="closeOnSelect"
                     :mode="mode"
                     :max="max"

                     v-model="inputValue"
                     v-bind="$attrs"

                     ref="selectRef"

                     @open="h_onOpenWrap"
                     @change="h_OnChangeWrap"
                     @search-change="h_onWriteSearch"
        >

            <!-- using 'slots props' features see here https://v3.vuejs.org/guide/component-slots.html#scoped-slots -->
            <!-- allow us to customize the render front parent component -->

            <template :v-if="$slots.customOption !== undefined" #option="{option}">
                <slot name="customOption" :option="option" />
            </template>

            <template :v-if="$slots.customTag !== undefined" #tag="{option, handleTagRemove}">
                <slot name="customTag" :option="option" :handleTagRemove="handleTagRemove" />
            </template>

            <template :v-if="$slots.customSingleLabel !== undefined" #singlelabel="{value}">
                <slot name="customSingleLabel" :value="value" />
            </template>

        </multiselect>

        <!-- Error Msg -->
        <label v-show="errorMessage" class="error">{{ errorMessage }}</label>

    </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { defineComponent, ref } from 'vue'
import Multiselect from '@vueform/multiselect'


export default defineComponent({
    components: { Multiselect },
    name:       'CmpMultiselectField',
    props: {
        name:          {
            type:        String,
            description: 'The name of the input',
            required:    true
        },
        label:         String,
        rules:         {
            type:        String,
            description: 'A vee validate global rule to apply to this input',
            default:     ''
        },
        type:          String,
        options:       {
            type:        [ Object, Array ],
            required:    true,
            description: 'Set of options to pick from'
        },
        mode:          {
            type:    String,
            default: 'single',
            validation( value: string ) {
                return [ 'single', 'multiple', 'tag' ].includes(value)
            }
        },
        max:           {
            type:        Number,
            default:     -1,
            description: 'The maximum number of options that can be selected when using multiple or tags mode. If -1 the number of options won\'t be limited.'
        },
        placeholder:   {
            type:        String,
            description: 'A placeholder to guide the user in the UI',
            required:    false
        },
        closeOnSelect: {
            type:     Boolean,
            default:  false,
            required: false
        },
        searchable:    {
            description: 'Tells if the component must handle user input to filter available options',
            type:        Boolean,
            default:     false,
            required:    false
        }
    },
    emits:      [ 'changehapend', 'openhapend', 'writehapend' ],
    setup( props: any, context: any ) {

        const { value: inputValue, errorMessage, handleChange, meta } = useField(
                props.name as string,
                props.rules
        )

        const selectRef = ref(null)                    // reference to the selectRef comp

        /**
         * This may come in handy when a parent component needs to trigger something after this
         * select changes
         *
         * @param newSelectedValue ... wel this is self explanatory
         */
        const h_OnChangeWrap = ( newSelectedValue: any ) => {
            handleChange(newSelectedValue)
            context.emit('changehapend', newSelectedValue)
        }

        /**
         * This may come in handy when a parent component needs to trigger something after
         * the select opens its window
         *
         * @param selectInstance MultiSelect instance reference
         */
        const h_onOpenWrap = ( selectInstance: Multiselect ) => {
            context.emit('openhapend', selectInstance)
        }

        /**
         * Hooks the moment after a character is typed in the select search input
         *
         * @param characterWritten Text written in the search input
         */
        const h_onWriteSearch = ( characterWritten: any ) => {
            if (characterWritten.length >= 3)
                context.emit('writehapend', characterWritten)
        }

        /**
         * As this component wraps the 'multi select' component, its API methods ar not reachable from others
         * parents component (of this). So this method acts like a proxy so parents component can reach / call
         * to 'multiselect.clear' API method
         *
         * check this https://github.com/vueform/multiselect#api
         */
        const clearSelection = () => {
            //@ts-ignore
            if (selectRef.value !== null) selectRef.value.clear()
        }

        const setSelectedValue = ( option: { value: string | number, label: string } ) => {
            //@ts-ignore
            if (selectRef.value !== null) selectRef.value.select(option)
        }


        return {
            selectRef,
            inputValue,
            errorMessage,
            meta,

            clearSelection,
            setSelectedValue,

            h_onOpenWrap,
            h_OnChangeWrap,
            h_onWriteSearch
            // handleChange,
        }
    }
})
</script>
