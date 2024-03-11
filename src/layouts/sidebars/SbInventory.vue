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
import { h } from 'vue';
import { mapActions } from 'pinia';
import { RoutePathNames, RoutePaths } from '@/services/definitions';
import { useSt_Pagination } from '@/stores/pagination';


export default {
    name: 'SbInventory',
    data() {

        // separator HR component to be use as line divider on the sidebar
        const separator = h( 'hr', {
            style: {
                borderColor: 'rgba(0, 0, 0, 0.2)',
                marginLeft:  '10px',
                marginRight: '10px',
                width:       '60%',
            },
        } )

        return {
            menu:       [
                {
                    // module header
                    disabled: true,
                    hiddenOnCollapse: true,
                    class: 'sidebar-cheader',
                    title: this.$t('nav.sb.inventory').toUpperCase(),
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
                    href:  { path: RoutePaths.inventory },
                    title: this.$t( 'nav.sb.overview' ).toUpperCase(),
                    icon:  'tim-icons icon-sound-wave',
                },
                {
                    href:  { path: RoutePaths.prodList },
                    title: this.$t( 'routes.' + RoutePathNames.product ).toUpperCase(),
                    icon:  'tim-icons icon-atom',
                },
                {
                    title: this.$t('nav.sb.ops').toUpperCase(),
                    icon:  'tim-icons icon-world',
                    child: [],
                },
                {
                    title: this.$t( 'nav.sb.configs' ).toUpperCase(),
                    icon:  'tim-icons icon-settings-gear-63',
                    child: [
                        // {
                        //     header: this.$t('entities.warehouse.name'),
                        //     hiddenOnCollapse: true,
                        //     class: 'sidebar-txt-head'
                        //     // title: this.$t('nav.sb.inventory').toUpperCase(),
                        // },
                        {
                            href:  { path: RoutePaths.warehouseList },
                            title: this.$t( 'routes.' + RoutePathNames.warehouseList ).toLowerCase(),
                            icon: {
                                element: 'span',
                                text: 'A',
                                class: 'sidebar-item-icon-text'
                            }
                        },
                        {
                            // href:  { path: RoutePaths.wlocation },
                            title: this.$t( 'routes.' + RoutePathNames.wlocationList ).toLowerCase(),
                            icon: {
                                element: 'span',
                                text:    'U',
                                class:   'sidebar-item-icon-text'
                            }
                        },
                        {
                            href:  { path: RoutePaths.strgcategoryList },
                            title: this.$t( 'routes.' + RoutePathNames.strgcategoryList ).toLowerCase(),
                            icon: {
                                element: 'span',
                                text:    'C',
                                class:   'sidebar-item-icon-text'
                            }
                        },
                        {
                            component: separator,
                        },
                        // {
                        //     header: this.$t('entities.product.section-name'),
                        //     hiddenOnCollapse: true,
                        //     class: 'sidebar-txt-head'
                        // },
                        {
                            href:  { path: RoutePaths.muList },
                            title: this.$t( 'routes.' + RoutePathNames.munits ).toLowerCase(),
                            icon: {
                                element: 'span',
                                text: 'U',
                                class: 'sidebar-item-icon-text'
                            }
                        },
                    ],
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
