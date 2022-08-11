<template>
    <!-- SIDEBAR -->
    <cmp-side-bar-menu>
        <div id="topper-border-cont" class="mp-stylized main-panel" >
            <!-- NAV BAR -->
            <base-top-nav-lay></base-top-nav-lay>
            <notifications />

             <!--CONTENT-->
            <div class="content">
                <slot></slot>
            </div>

            <!-- BACK 2 TOP BUTTON -->
            <cmp-button-back-top class="position-sticky" :global="true" :pivot="160"/>

            <!-- FOOTER -->
            <footer-content />
        </div>
    </cmp-side-bar-menu>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import ContentFooter from './LayFooterContent.vue'
import ContentTopNav from './LayBaseTopNav.vue'
import { CmpSideBarMenu, CmpButtonBackTop } from '@/components'

export default defineComponent({
    name: 'LayBaseDashboard',
    components: {
        ContentFooter,
        ContentTopNav,
        CmpSideBarMenu,
        CmpButtonBackTop
    },
    mounted(this:any): void {
        new PerfectScrollbar('#topper-border-cont')
    }
})
</script>
