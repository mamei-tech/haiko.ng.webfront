<template>
    <div :class="'c-tooltip ' + [{ top: top }, { left: left }, { bottom: bottom }, { right: right }]">
        <p v-if="isFormLabelMode" class="c-tooltip-question-mark">?</p>

        <slot></slot>
        <span v-if="useVHtml == false" class="caption">{{ tip }}</span>
        <span v-else class="caption" v-html="tip"></span>
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
        },
        useVHtml: {
            default:     false,
            type:        Boolean,
            description: 'Force the component to use the v-HTML mode  to render the string. It can come in handy when we need to render multiline i18n text'
        }
    }
})
</script>

<style lang="scss">
</style>
