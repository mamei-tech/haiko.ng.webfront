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
    name: 'SbPurchase',
    data() {
        return {
            menu:       [
                {
                    // module header
                    disabled: true,
                    hiddenOnCollapse: true,
                    class: 'sidebar-cheader',
                    title: this.$t('nav.sb.purchases').toUpperCase(),
                    icon: {
                        element: 'span',
                    }
                    // icon: {
                    //     element: 'span',
                    // class: 'fa fa-user',
                    // attributes: {}
                    // text: 'I'
                    // }
                },
                {
                    href:  { path: RoutePaths.hub },
                    title: this.$t( 'routes.' + RoutePathNames.hub ).toUpperCase(),
                    icon:  'tim-icons icon-app',
                },
                {
                    href: { path: RoutePaths.purchaseList },
                    title: this.$t( 'routes.' + RoutePathNames.supplier ).toUpperCase(),
                    icon: 'tim-icons icon-money-coins',
                    child: [
                        {
                            href: { path: RoutePaths.supplierCatList },
                            title: this.$t( 'routes.' + RoutePathNames.supplierCat ).toLowerCase(),
                            icon: 'tim-icons icon-puzzle-10',
                        },
                        {
                            href: { path: RoutePaths.supplierList },
                            title: this.$t( 'routes.' + RoutePathNames.supplier ).toLowerCase(),
                            icon: 'tim-icons icon-delivery-fast',
                        },
                    ]
                }
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
