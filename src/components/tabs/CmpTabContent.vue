<template>
    <div :id="id"
         class="tab-pane"
         :class="{ active: isActive }"
         :aria-expanded="isActive">

        <transition appear name="slide-fade">
            <div v-show="isActive">
                <slot></slot>
            </div>
        </transition>

    </div>
</template>

<script>
export default {
    props:    {
        id:          {
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
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
