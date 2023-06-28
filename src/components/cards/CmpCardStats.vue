<template>
    <CmpCard class="card-stats" :showFooterLine="true">
        <div class="row">
            <div class="col-5" v-if="$slots.icon || icon">
                <div class="info-icon text-center" :class="`icon-${type}`">
                    <slot name="icon"> <i :class="icon"></i> </slot>
                </div>
            </div>
            <div class="col-7" v-if="title || subTitle">
                <div class="numbers">
                    <!-- !!! this is the default slot (no name on it) -->
                    <slot>
                        <p v-if="subTitle" class="card-category">{{ subTitle }}</p>
                        <h3 v-if="title" class="card-title">{{ title }}</h3>
                    </slot>
                </div>
            </div>
        </div>

        <div class="row" v-if="$slots.content">
            <!-- !!! this should be the default but isn't, so you have to use the name in a component if u want to use it -->
            <slot name="content"></slot>
        </div>

        <div class="row" v-if="info || withRestore">
            <div class="col-10" v-if="info">
                {{ info }}
            </div>
            <div class="col-12" v-if="withRestore && !info" @click.prevent="$emit('doRestore')">
                <i class="tim-icons icon-refresh-01" style="float: right"></i>
            </div>
            <div class="col-2" v-else @click.prevent="$emit('doRestore')">
                <i class="tim-icons icon-refresh-01" style="float: right"></i>
            </div>
        </div>

        <template v-if="$slots.footer" v-slot:footer>
            <div class="stats" slot="footer">
                <slot name="footer"></slot>
            </div>
        </template>

    </CmpCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CmpCard from '@/components/cards/CmpCard.vue'


export default defineComponent({
    name:       'CmpCardStats',
    components: {
        CmpCard
    },
    props:      {
        type:        {
            type:    String,
            default: 'primary'
        },
        icon:        String,
        title:       String,
        subTitle:    String,
        info:        {
            type:        String,
            description: 'Additional information'
        },
        withRestore: {
            type:        Boolean,
            default:     false,
            description: 'Say if we need the _restore_ button and the emission of the event'
        }
    },
    emits:      [ 'doRestore' ]
})
</script>

<style scoped>
</style>
