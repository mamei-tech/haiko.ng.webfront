<template>
    <div class="mt-5 d-flex justify-content-center justify-content-sm-between">

        <!-- INFO [LEFT] -->
        <!--<div><p class="card-category">{{ `Showing ${st_pagination.start} to ${st_pagination.end} of ${total} entries` }}</p></div>-->
        <div><p class="card-pagination">{{ $t('data.footer-description', { start: st_pagination.start, end: st_pagination.end, total: st_pagination.getEntitiesCount }) }}</p></div>

        <!-- BUTTONS [RIGHT] -->
        <ul class="pagination pagination-no-border">

            <!-- START ARROW -->
            <li :class="[{'disabled': st_pagination.currentPage === 1}]"
                class="page-item prev-page">
                <a aria-label="Previous" class="page-link" @click="h_arrowClick(0)">
                    <i aria-hidden="true" class="tim-icons icon-double-left"></i>
                </a>
            </li>

            <div v-if="st_pagination.currentGroup > 1" class="pt-1"><p class="mb-0">...</p></div>

            <!-- BUTTONS PAGES -->
            <template v-for="(page, index) in st_pagination.displayedPages" :key="`displayed-page-${index}`">
                <li class="page-item" :class="[{'active': st_pagination.currentPos === index}]" >
                    <a class="page-link" @click.prevent="h_pageClick(index)">{{ page }}</a>
                </li>
            </template>

            <div v-if="st_pagination.currentGroup < st_pagination.totalGroups" class="pt-1"><p class="mb-0">...</p></div>

            <!-- END ARROW -->
            <li :class="[{'disabled': st_pagination.currentPage === st_pagination.totalPages}]"
                class="page-item page-pre next-page">
                <a aria-label="Next" class="page-link" @click="h_arrowClick(4)">
                    <i aria-hidden="true" class="tim-icons icon-double-right"></i>
                </a>
            </li>

        </ul>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, reactive, watch } from 'vue'
    import type { ComputedRef, SetupContext } from 'vue'
    import { useSt_Pagination } from '@/stores/pagination'


    export default defineComponent({
        name: 'CmpTablePagination',
        setup (props: any, ctx: SetupContext) {
            //region ======== LOCAL TYPES ===========================================================
            //endregion =============================================================================

            //#region ======= DECLARATIONS & LOCAL STATE ============================================

            const st_pagination = useSt_Pagination()                            // Pinia instance of pagination store

            //#endregion ============================================================================

            //region ======== COMPUTATIONS & GETTERS ================================================
            //endregion =============================================================================

            //region ======== DECLARATIONS & LOCAL STATE ============================================
            //endregion =============================================================================

            //region ======== EVENTS HANDLERS & WATCHERS ============================================
            const h_pageClick = (clickedPos: number) => st_pagination.mutPageWasClicked(clickedPos)

            const h_arrowClick = (arrow: number) => st_pagination.mutArrowWasClicked(arrow)
            //endregion =============================================================================

            //region ======== HELPERS ===============================================================
            //endregion =============================================================================

            //region ======== WATCHERS ==============================================================

            /***
             *  This watcher is *essential*, as it is responsible for emit the event to make the request to update
             *  the data according to the new page (st_pagination.currentPage) in the datatable
             */
            watch(() => [st_pagination.currentPage], ([newPage]) => {
                // updating query data
                st_pagination.Offset = newPage == 1 ? 0 : newPage * st_pagination.selectorSize - st_pagination.selectorSize
                st_pagination.Limit = st_pagination.selectorSize

                ctx.emit('next', newPage)

                // updating pagination labels data
                st_pagination.start = st_pagination.currentPage === 1 ? st_pagination.currentPage : (st_pagination.currentPage * st_pagination.selectorSize) - st_pagination.selectorSize + 1
                st_pagination.end = st_pagination.start + st_pagination.selectorSize - 1 > st_pagination.totalRecords ? st_pagination.totalRecords : st_pagination.start + st_pagination.selectorSize - 1
            })

            watch(() => [st_pagination.totalPages], () => {st_pagination.mutResetDisplayPagesArray()})

            //endregion =============================================================================

            return {
                st_pagination,

                h_pageClick,
                h_arrowClick
            }
        },
        emits: ['next']
    })
</script>
