<template>
    <!-- SIDEBAR -->
    <CompSideBarMenu >
        <div id="topper-border-cont" class="mp-stylized main-panel" >
            <!-- NAV BAR -->
            <base-top-nav-lay></base-top-nav-lay>
            <notifications />

             <!--CONTENT-->
            <div class="content">
                <slot></slot>
            </div>

            <!-- BACK 2 TOP BUTTON -->
            <button-back-top-comp class="position-sticky" :global="true" :pivot="160"/>

            <!-- FOOTER -->
            <footer-content />
        </div>
    </CompSideBarMenu>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PerfectScrollbar from 'perfect-scrollbar'
import ContentFooter from './LayFooterContent.vue'
import ContentTopNav from './LayBaseTopNav.vue'
import { CompSideBarMenu, CompButtonBackTop } from '@/components'

export default defineComponent({
    name: 'LayBaseDashboard',
    components: {
        ContentFooter,
        ContentTopNav,
        CompSideBarMenu,
        CompButtonBackTop
    },
    mounted(this:any): void {
        new PerfectScrollbar('#topper-border-cont')
    }
})
</script>
