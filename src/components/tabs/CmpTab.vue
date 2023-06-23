<template>
    <li @click="handleTabChange" :class="{ active: isActive }"  aria-expanded="true" data-toggle="tab" class="nav-item">
        <a data-toggle="tab" role="tablist" href="#" class="nav-link" :class="{ active: isActive }">
            <div>{{ title }}</div>
        </a>
    </li>
</template>

<script>
import { defineComponent } from 'vue';


export default defineComponent( {
    name:     'CmpTab',
    props:    {
        title:       {
            type:     String,
            required: true,
        },
        activeTabId: {
            type:     Number,
            required: true,
        },
        tabId:       {
            type:     Number,
            required: true,
        },
    },
    computed: {
        isActive() {
            return this.activeTabId === this.tabId;
        },
    },
    methods:  {
        handleTabChange() {
            this.$emit( 'tab-change', this.tabId );
        },
    },
} );
</script>

<style scoped>
</style>
