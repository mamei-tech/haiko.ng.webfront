import { defineStore } from 'pinia'
import { PAGE_SIZE } from '@/services/definitions'

import type { IDataTableQuery, Filter } from '@/services/definitions'
import type { SortDir } from '@/services/definitions/types-common'

// https://pinia.vuejs.org/core-concepts/#setup-stores

// pagination Store.
// The name (pagination) does not do it justice as it handles the status of query data also. The query
// data is used to request data from server for the datatables components
//
// !! this state are mainly modified from 'CmpDataTable.vue' and 'CmpTablePagination.vue' files
export const useSt_Pagination = defineStore({
    id: 'pagination',

    state: () : IPageState => ({
        totalRecords:  0,           // total amount of data of all records
        totalPages:   0,
        totalGroups:  0,

        selectorSize: 10,           // UI select value for the config the size fo the list / page, this is changed by the user thoguht the UI
        recordsOnPage: 10,

        currentPage:    1,          // current page displayed
        currentPos:     0,          // current position in the display array for the page are been displayed
        currentGroup:   1,          // current group (of pages, means the little circles with the page number on it) displayed. Each group have five pages according, to the top of page that the pagination component can represent at the same time
        displayedPages: [],

        start:          1,          // used for pagination string (label) info
        end:            10,         // used for pagination string (label) info

        // datatable query state
        Offset: 0,
        Limit: PAGE_SIZE,
        Orderer: 'id',
        Search: '',
        OrderDir: 'ASC',
        Filters: {}
    }),

    getters: {
        /**
         * The number of all the records/document of this type of entity in the database
         * @param state
         */
        getEntitiesCount: ( state ): number => state.totalRecords,

        /**
         * Retrieve the data used to make the datatable request, accordingly with the pagination state in the moment of the request
         */
        getQueryData(): IDataTableQuery {
            return {
                Offset:   this.Offset,
                Limit:    this.Limit,
                Orderer:  this.Orderer,
                OrderDir: this.OrderDir,
                Search:   this.Search
            }
        }

    },

    actions: {

        // ---mutators ---

        /**
         * Call this mutator to update the the total records and the page records when a deletion happened
         *
         * @param amount Numbers of entities deleted
         */
        mutUpdateOnDelete( amount: number ): void {
            this.totalRecords -= amount
            this.recordsOnPage -= amount
        },

        /**
         * Call this mutator after a Page request was made to update this store (pagination store)
         *
         * @param totalRecordsFromServer The total record given byy the servers as the outcome of the request
         * @param amount Numbers of entities given by the server after as request response
         * @param offset Data offset from request
         */
        mutUpdateOnRequest( totalRecordsFromServer: number, amount: number, offset: number ): void {
            this.totalRecords = totalRecordsFromServer
            this.recordsOnPage = amount
            // this.pageNumber = offset

            this.totalPages = this.totalRecords % this.selectorSize === 0 ? this.totalRecords / this.selectorSize : Math.floor(this.totalRecords / this.selectorSize) + 1
            this.totalGroups = this.totalPages % 5 === 0 ? this.totalPages / 5 : Math.floor(this.totalPages / 5) + 1

            // only for the first request, when the pagination if called at the beginning in table representation
            // or when the user go backwards through pages until the first one
            if(this.currentPage == 1)
                this.displayedPages = this.totalPages >= 5 ? [ 1, 2, 3, 4, 5 ] : Array.from({ length: this.totalPages }, ( _, i ) => i + 1)
        },

        /**
         * Call this to set the pagination store good matching an empty page
         *
         * @param offset Data offset from request
         */
        mutSetEmptyPage(offset: number ): void {
            this.totalRecords = 0
            this.recordsOnPage = 0
        },

        /**
         * When the computations of TotalPage change, we can call this mated for recalculate and reset the page displayed array.
         * This method reset the current Page and Pos to the correspond initial values.
         */
        mutResetDisplayPagesArray(): void {
            this.currentPage = 1
            this.currentPos = 0
            this.displayedPages = this.totalPages >= 5 ? [ 1, 2, 3, 4, 5 ] : Array.from({ length: this.totalPages }, ( _, i ) => i + 1)
        },

        /**
         * Update the query data accordingly with the given new value from the datatable page size configuration
         * @param newSize The new size value to set the new page size configuration
         */
        mutSelectorPageSize (newSize:number): void {
            this.selectorSize = newSize
            if (this.selectorSize === 0) this.selectorSize = PAGE_SIZE

            this.Offset = this.currentPage * this.selectorSize - this.selectorSize
            this.Limit = this.selectorSize
        },

        /**
         * Just updates the pages state when a pages was clicked
         * @param pagePosition Position of the clicked page in the displayed array os pages
         */
        mutPageWasClicked (pagePosition: number): void {
            if (this.currentPos === pagePosition) return        // if was the same page we do nothing

            this.currentPos = pagePosition
            this.currentPage = this.displayedPages[pagePosition]
        },

        /**
         * Just updates the pages state when the right or left arrow was clicked
         * @param arrowPosition The number of the arrows that means a position in the array, meaning 0 (start position) left arrow and 4 (last position) right arrow
         */
        mutArrowWasClicked( arrowPosition: number ): void {
            // was <- LEFT and currentPage is not in the first page already
            if (arrowPosition == 0 && this.currentPage !== 1){
                // we reach the bottom page of the group, we need to redisplay the group
                // is called when we need to redisplay the pages array, 'cause page navigation on LEFT direction (<-)
                if (this.currentPos === 0) {
                    this.currentGroup -= 1
                    this.currentPos = 4

                    if (this.currentGroup > 1) this.displayedPages = this.displayedPages.map(x => x - 5)
                    else if (this.currentGroup === 1)                                                 // check if is the first group
                    {
                        if (this.displayedPages[0] !== 6) this.currentPos = (this.totalPages % 5) - 1  // if the total page are not even (five multiply), we need to handle the positions when the pagination is back to represent the first group
                        this.displayedPages = [1, 2, 3, 4, 5]
                    }
                    this.currentPage = this.displayedPages[this.currentPos]
                }
                // just passing to previous page within the current group
                else {
                    this.currentPos -= 1
                    this.currentPage -=1
                }
            }

            // was -> RIGHT and currentPage is not at the end page already
            else if (arrowPosition === 4 && this.currentPage !== this.totalPages) {
                // we reach the top page of the group, we need to redisplay the group
                // this is called when we need to redisplay the pages array, 'cause page navigation on RIGHT direction (->)
                if (this.currentPos === 4) {
                    this.currentGroup += 1                                            // changing the group
                    this.currentPos = 0                                               // reset the pos to the first position in the current group

                    const rest = this.totalPages % 5                                  // we have to know if the total page to represent in the page group are even, 'cause if not, we have to refill the group with pages that belong to the group before the current

                    // it isn't the first group || its the last group and the total page are multiply of five
                    if ((this.currentGroup < this.totalGroups) || (this.currentGroup === this.totalGroups && rest === 0))
                        this.displayedPages = this.displayedPages.map(x => x + 5)
                    else
                    {
                        let arr = []

                        for (let i = rest; i < 5; i++) arr.push(this.displayedPages[i])   // reallocation of the pages that that will be reuse from all group display array in the beginning of the new displaying array
                        for (let i = 0; i < rest; i++) arr.push(arr[arr.length - 1] + 1)  // refilling new pages (less than five) in the remaining empty position of the display array

                        this.currentPos = 4 - rest + 1                                    // fix, setting the current pos to the correct next position in the new rearranged array
                        this.displayedPages = arr
                    }
                    this.currentPage = this.displayedPages[this.currentPos]
                }
                // just passing to next page within the current group
                else {
                    this.currentPos += 1
                    this.currentPage += 1
                }
            }
        },

        /**
         * Hard reset of the state,  ... indian way ;)
         */
        mutResetState(): void {
            this.totalRecords = 0
            this.totalPages = 0
            this.totalGroups = 0

            this.selectorSize = 10
            this.recordsOnPage = 10

            this.currentPage = 1
            this.currentPos = 0
            this.currentGroup = 1
            this.displayedPages = []

            this.start = 1
            this.end = 10

            // datatable query state
            this.Offset = 0
            this.Limit = PAGE_SIZE
            this.Orderer = 'id'
            this.Search = ''
            this.OrderDir = 'ASC'
            this.Filters = {}
        }


        // --- async calls actions ---
    }
})

//region ======== INTERFACES & TYPES ====================================================


/**
 * Store State Interface
 *
 * We are handling the data-table paging  data in the store (Pinia) so we need to store pagination related data in the
 * store for each entity. Optionally we can handle the pagination data in the View local store using the Vue native
 * 'reactive' method
 */
interface IPageState {
    recordsOnPage: number,
    totalRecords: number                  // total entity count on the entire system

    totalPages: number,
    totalGroups: number,
    selectorSize: number,

    currentPage: number,                // current page displayed
    currentPos: number,                 // current position in the display array for the page are been displayed
    currentGroup: number,               // current group (of pages, means the little circles with the page number on it) displayed. Each group have five pages according, to the top of page that the pagination component can represent at the same time
    displayedPages: Array<number>,
    start: number,
    end: number

    // datatable query state
    Offset: number,
    Limit: number,
    Orderer: string,
    Search: string,
    OrderDir: SortDir
    Filters: Filter
}

//endregion =============================================================================
