<template>
    <sidebar-menu v-model:collapsed="collapsed"
                  :menu="menu"
                  @update:collapsed="onToggleCollapse"
                  @item-click="onItemClick" />

    <div v-if="isOnMobile && !collapsed"
         class="sidebar-overlay"
         @click="collapsed = true" />

    <div id="container" :class="[{'collapsed' : collapsed}, {'onmobile' : isOnMobile}]">
        <slot></slot>
    </div>
</template>

<script>
import { RoutePathNames, RoutePaths } from '@/services/definitions/route-paths';

export default {
    name: 'CompSideBarMenu',
    data() {
        return {
            menu: [
                {
                    href: { path: RoutePaths.dashboard },
                    title: ('routes.' + RoutePathNames.dashboard ).toUpperCase(),
                    icon: 'tim-icons icon-chart-pie-36',
                }
            ],
            collapsed: false,
            isOnMobile: false,
        };
    },
    mounted() {
        this.onResize();
        window.addEventListener( 'resize', this.onResize );
    },
    methods: {
        onToggleCollapse( collapsed ) {
        },
        onItemClick() {
            if (this.isOnMobile) {
                this.collapsed = true;
            }
        },
        onResize() {
            if (window.innerWidth <= 991) {
                this.isOnMobile = true;
                this.collapsed = true;
            } else {
                this.isOnMobile = false;
                this.collapsed = false;
            }
        },
    },
};
</script>

<style lang="scss">


</style>
