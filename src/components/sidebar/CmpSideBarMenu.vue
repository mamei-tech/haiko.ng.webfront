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
import { mapActions } from 'pinia'
import { RoutePathNames, RoutePaths } from '@/services/definitions/route-paths';
import { useSt_Pagination } from '@/stores/pagination'


export default {
    name: 'CmpSideBarMenu',
    data() {
        return {
            menu: [
                {
                    href: { path: RoutePaths.dashboard },
                    title: this.$t( 'routes.' + RoutePathNames.dashboard ).toUpperCase(),
                    icon: 'tim-icons icon-chart-pie-36',
                },
                {
                    href: {},
                    title: this.$t( 'nav.sb.people' ).toUpperCase(),
                    icon: 'fa fa-users',
                    child: [
                        {
                            href: { path: RoutePaths.rolesLists },
                            title: RoutePathNames.roles,
                            icon: 'tim-icons icon-badge',
                        },
                        {
                            href: { path: RoutePaths.staffList },
                            title: RoutePathNames.staff,
                            icon: 'tim-icons icon-single-02',
                        },
                        {
                            href: { path: RoutePaths.clientsList },
                            title: RoutePathNames.clients,
                            icon: 'fa fa-heartbeat',
                        }
                    ]
                },
                {
                    href: {},
                    title: this.$t( 'nav.sb.inventory' ).toUpperCase(),
                    icon: 'tim-icons icon-components',
                    child: [
                        {
                            href: { path: RoutePaths.muList },
                            title: this.$t( 'routes.' + RoutePathNames.munits ).toLowerCase(),
                            icon: 'tim-icons icon-support-17',
                        },
                    ]
                },
                {
                    href: {path: RoutePaths.purchaseList},
                    title: this.$t( 'routes.' + RoutePathNames.purchase ).toUpperCase(),
                    icon: 'tim-icons icon-money-coins',
                    child: [
                        {
                            href: { path: RoutePaths.suppliersCatList },
                            title: this.$t( 'routes.' + RoutePathNames.suppliersCat ).toLowerCase(),
                            icon: 'tim-icons icon-puzzle-10',
                        },
                        {
                            href: { path: RoutePaths.suppliersList },
                            title: this.$t( 'routes.' + RoutePathNames.suppliers ).toLowerCase(),
                            icon: 'fa fa-address-card',
                        },
                    ]
                },
                {
                    href: {},
                    title: this.$t( 'nav.sb.ops' ).toUpperCase(),
                    icon: 'tim-icons icon-compass-05',
                    child: []
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
        ...mapActions(useSt_Pagination, ['mutResetState']),

        onToggleCollapse( collapsed ) {},
        onItemClick() {
            if (this.isOnMobile) {
                this.collapsed = true;
            }

            // resetting pagination state
            this.mutResetState()
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
