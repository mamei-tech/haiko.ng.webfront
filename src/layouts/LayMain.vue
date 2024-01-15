<template>

    <!-- SIDEBAR -->
    <!-- FIXME Why the sidebar have to wrap the whole view ?? -->
    <component :is="this.$route.meta.sidebar || 'div'">

        <div id="topper-border-cont" class="mp-stylized main-panel" >
            <!-- NAV BAR -->
            <LayMainTopNav></LayMainTopNav>
            <!--<notifications />-->

             <!--CONTENT-->
            <div class="content">
                <slot></slot>
            </div>

            <!-- BACK 2 TOP BUTTON -->
            <CmpButtonBackTop class="position-sticky" :global="true" :pivot="160"/>

            <!-- FOOTER -->
            <LayFooterContent />
        </div>
    </component>


</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import LayFooterContent from './LayFooterContent.vue'
import LayMainTopNav from './LayMainTopNav.vue'
import { CmpButtonBackTop } from '@/components'

export default defineComponent({
    name: 'LayMain',
    components: {
        LayMainTopNav,
        LayFooterContent,
        CmpButtonBackTop,
    },
    mounted(this:any): void {
        new PerfectScrollbar('#topper-border-cont')
    }
})
</script>
