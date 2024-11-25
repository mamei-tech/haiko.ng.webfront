<template>
  <div
      class="form-group"
      :class="{
            'input-group-focus': isFocused,
            'has-danger': !!errorMessage && type !== 'hidden',
            'has-success': meta.valid && type !== 'hidden',
        }"
  >

    <!-- INPUT -->
    <!--:v-model.value="value"-->
    <input class="form-control"
           :name="name"
           :value="inputValue"
           :placeholder="placeholder"
           :type="type"
           v-bind="$attrs"
           @focus="onInputFocused"
           @input="handleChange"
           @blur="onInputBlur"
    />

  </div>

  <!-- Error Msg -->
  <label v-show="errorMessage" class="error">{{ errorMessage }}</label>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useField } from 'vee-validate'
import type { SetupContext } from 'vue'


export default defineComponent({
    name:  'CmpBaseDateTime',
    props: {
        name:        {
            type:        String,
            description: 'The name of the input (eg. object property name)'
        },
        placeholder: String,
        value:       {
            type:        [ Date ],
            description: 'Input value'
        },
        rules:       {
            type:        String,
            description: 'A vee validate global rule to apply to this input',
            default:     ''
        },
        type:        {
            type:        String,
            description: 'The kind of date UI control',
            default:     'date',
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
    setup( props, _: SetupContext ) {

        // we check some other alternatives of using HTML native control for datetime selection the creative-team
        // https://demos.creative-tim.com/vue-black-dashboard-pro/#/forms/extended | archivo en vue-black-dashboard-pro-v1.4.0 -> ExtendedForms.vue
        // https://demos.creative-tim.com/vue-soft-ui-dashboard-pro/#/pages/projects/new-project
        // libraries
        // https://flatpickr.js.org/examples/ | https://amsul.ca/pickadate.js/


        // #region  ======== DECLARATIONS & LOCAL STATE ============================================
        let isFocused = ref<boolean>(false)

        const {
                  value: inputValue,
                  errorMessage,
                  handleBlur,
                  handleChange,
                  meta
              } = useField(props.name as string, props.rules, { initialValue: props.value })

        // #endregion =============================================================================

        //region ======== COMPUTATIONS & GETTERS ================================================
        //endregion =============================================================================

        //region ======= EVENTS HANDLERS & WATCHERS =============================================
        const onInputFocused = () => {
            isFocused.value = true
        }
        const onInputBlur    = () => {
            isFocused.value = false
            handleBlur()
        }
        //endregion =============================================================================

        return {
            isFocused,

            inputValue,

            onInputFocused,
            onInputBlur,

            handleChange,
            errorMessage,
            meta
        }
    }
})
</script>

<style scoped>
</style>
