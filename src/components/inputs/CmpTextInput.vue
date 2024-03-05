<template>
  <div class="form-group"
       :class="{
            'input-group-focus': isFocused,
            'has-danger': !!errorMessage,
            'has-success': meta.valid,
        }"
  >
    <!-- LABEL -->
    <slot name="label">
      <label v-if="label" class="control-label">{{ label }}</label>
    </slot>

    <!-- INPUT -->
    <!--:v-model.value="value"-->
    <textarea class="form-control"
              :name="name"
              style="max-height: 100%"
              :style=" height > 0 ? 'height: ' + height + 'px !important' : ''"
              :value="inputValue"
              v-bind="$attrs"
              @focus="onInputFocused"
              @input="handleChange"
              @blur="onInputBlur"
    />

    <!-- Error Msg -->
    <label v-show="errorMessage" class="error">{{ errorMessage }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useField } from 'vee-validate'
import type { SetupContext } from 'vue'


export default defineComponent({
    name:  'CmpTextInput',
    props: {
        name:  {
            type:        String,
            description: 'The name of the input',
        },
        height: {
            type:        String,
            description: 'Text area height in px',
            default:     0
        },
        label: String,
        value: {
            type:        [ String, Number ],
            description: 'Input value'
        },
        rules: {
            type:        String,
            description: 'A vee validate global rule to apply to this input',
            default:     ''
        }
    },
    setup( props, cntx: SetupContext ) {
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
        const onInputBlur = () => {
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
