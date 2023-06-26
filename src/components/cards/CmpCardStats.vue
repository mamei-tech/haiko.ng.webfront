<template>
    <CmpCard class="card-stats" :showFooterLine="true">
        <div class="row">
            <div class="col-5" v-if="$slots.icon || icon">
                <div class="info-icon text-center" :class="`icon-${type}`">
                    <slot name="icon"> <i :class="icon"></i> </slot>
                </div>
            </div>
            <div class="col-7" v-if="$slots.content || title || subTitle">
                <div class="numbers">
                    <slot>
                        <p v-if="subTitle" class="card-category">{{ subTitle }}</p>
                        <h3 v-if="title" class="card-title">{{ title }}</h3>
                    </slot>
                </div>
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
        type:     {
            type:    String,
            default: 'primary'
        },
        icon:     String,
        title:    String,
        subTitle: String
    }
})
</script>

<style scoped>
</style>
