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
    name: 'SbPeople',
    data() {
        return {
            menu:       [
                {
                    // module header
                    disabled: true,
                    hiddenOnCollapse: true,
                    class: 'sidebar-cheader',
                    title: this.$t('nav.sb.people').toUpperCase(),
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
                    // href: { path: '' },
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
