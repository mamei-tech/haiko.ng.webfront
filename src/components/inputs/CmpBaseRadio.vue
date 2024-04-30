<template>
  <fieldset :id="id">
    <div v-for="(option, index) in options" :key="option.text"
         class="form-check form-check-radio"
         :class="[inlineClass]">
      <label :for="id + index" class="form-check-label">{{ option.text }}
        <input type="radio"
               class="form-check-input"
               :id="id + index"
               :name="id"
               :value="option.value"
               :checked="option.value === value"
               :disabled="disabled"
               :required="required"
               @change="updateValue(option.value)"
        />
        <slot v-if="option.value === value" :name="option.value" />
        <span class="form-check-sign"></span>
      </label>
    </div>
  </fieldset>
</template>

<script>
import { defineComponent } from 'vue';

// modified version, taken from https://eczepiel.medium.com/creating-a-custom-radio-button-group-component-in-vue-js-d96e177c84a4

export default defineComponent( {
    name:  'CmpBaseRadio',
    emits: [ 'updated' ],
    props:    {
        id:     {
            type:     String,
            required: true,
        },
        inline: {
            type:        Boolean,
            description: 'Whether radio is inline',
        },
        value:    {
            type:    [ String, Number, Boolean, Object ],
            default: null,
        },
        options:  {
            type:     [ Array ],
            required: true,
        },
        required: {
            type:    Boolean,
            default: false,
        },
        disabled: {
            type:    Boolean,
            default: false,
        },
    },
    computed: {
        inlineClass() {
            if (this.inline) {
                return `form-check-inline`;
            }
            return '';
        },
    },
    methods:  {
        updateValue( value ) {
            this.$emit( 'updated', value );
        },
    },
} );
</script>
