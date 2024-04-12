<template>
  <component :is="tag"
             :button-type="tag === 'button' ? nativeType : ''"
             class="btn round btn-simple btn-tag"
             :class="[ {[`btn-${buttonType}`]: buttonType} ]"
             @click.prevent="h_Click">

    <!-- default slot -->
    <slot></slot>

    <i class="tim-icons icon-simple-remove ml-3" />

  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
    name:  'CmpButtonTag',
    props: {
        simple:   {
            type:        Boolean,
            description: 'Whether button is simple (outlined)'
        },
        tag:        {
            type:        String,
            default:     'button',
            description: 'Button html tag'
        },
        nativeType: {
            type:        String,
            default:     'button',
            description: 'Button native type (e.g button, input etc)'
        },
        buttonType: {
            type:        String,
            default:     'default',
            description: 'Button type (primary|secondary|danger|warning|success etc)'
        }
    },

    methods: {
        //region ======== HANDLERS ==============================================================

        h_Click( evt: Event ) {
            this.$emit('doClick', evt)
        }

        //endregion =============================================================================
    },
    emits:   [ 'doClick' ]
})

</script>
