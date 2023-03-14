<template>
    <div :class="'c-tooltip ' + [{ top: top }, { left: left }, { bottom: bottom }, { right: right }]">
        <p v-if="isFormLabelMode" class="c-tooltip-question-mark">?</p>

        <slot></slot>
        <span class="caption">{{ tip }}</span>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
    name: 'TooltipComp',
    props: {
        top:    Boolean,
        left:   Boolean,
        bottom: Boolean,
        right:  Boolean,
        tip: {
            type:        String,
            description: 'hint / tip to be shown in the tooltip'
        },
        isFormLabelMode: {
            type:        Boolean,
            description: 'Define is the tooltip need to be shown in form label mode'
        }
    }
})
</script>

<style lang="scss">
</style>
