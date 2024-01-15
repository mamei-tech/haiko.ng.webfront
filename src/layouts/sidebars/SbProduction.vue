<template>

    <sidebar-menu v-model:collapsed="collapsed"
                  :menu="menu"
                  :showOneChild="true"
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
import { mapActions } from 'pinia';
import { RoutePathNames, RoutePaths } from '@/services/definitions';
import { useSt_Pagination } from '@/stores/pagination';


export default {
    name: 'SbProduction',
    data() {
        return {
            menu:       [
                {
                    href:  { path: RoutePaths.hub },
                    title: this.$t( 'routes.' + RoutePathNames.hub ).toUpperCase(),
                    icon:  'tim-icons icon-app',
                },
            ],
            collapsed:  false,
            isOnMobile: false,
        };
    },
    mounted() {
        this.onResize();
        window.addEventListener( 'resize', this.onResize );
    },
    methods: {
        ...mapActions( useSt_Pagination, [ 'mutResetState' ] ),

        onToggleCollapse( collapsed ) {
        },
        onItemClick() {
            if (this.isOnMobile) {
                this.collapsed = true;
            }

            // resetting pagination state
            this.mutResetState();
        },
        onResize() {
            if (window.innerWidth <= 991) {
                this.isOnMobile = true;
                this.collapsed  = true;
            } else {
                this.isOnMobile = false;
                this.collapsed  = false;
            }
        },
    },
};
</script>

<style lang="scss">
</style>
