<template>

    <!-- BUTTONS BAR -->
    <template v-if="hasTopBtnBar">
        <!-- If you need another direction of action bar function create a dynamic component here -->
        <CmpTableActionBar
                :subject="this.$props.subject"
                :mode="abar_mode"
                :chkCount="Object.keys(ls_selections.selected).length"
                :extendedFilters="ls_extFilters"
                v-on:navCreateIntent="$emit('navCreateIntent')"
                v-on:enableChkCollIntent="h_EnableChkCollection"
                v-on:disableChkCollIntent="h_DisableChkCollection"
                v-on:removeChkCollIntent="h_RemoveChkCollection"
                v-on:extFilClick="h_extFilter"
        />
    </template>

    <!-- SEARCH & PAGE SIZE BAR -->
    <template v-if="hasPageSizeSelector || hasSearch">
        <div class="table-action-bars col-12 d-flex justify-content-center justify-content-sm-between flex-wrap">
            <!-- TABLE PAGE SIZE -->
            <div class="select-primary mb-3 m-1 pagination-select row" v-if="hasPageSizeSelector">
                <multiselect
                        v-model="pageSizeOptions.value"
                        id="table-page-size"
                        v-if="data.length > 0"
                        name="page_size"
                        closeOnSelect
                        placeholder="10"
                        :options="pageSizeOptions"
                        style="width:100px"
                        @change="h_pageSizeChange($event)"
                />
            </div>

            <!-- SEARCH INPUT -->
            <div class="form-group has-icon" v-if="hasSearch">
                <div class="mb-0 input-group">
                    <div v-if="cpt_isAnyFilerActive " class="pr-3 justify-content-left">
                        <button
                                @click.prevent="h_clearAllFilters()"
                                type="button"
                                :title="$t('form.placeholders.reset-filters')"
                                class="btn remove btn-icon btn-sm"
                        >
                            <i class="tim-icons icon-refresh-01"></i>
                        </button>
                    </div>
                    <span class="input-group-prepend" @click="h_doRequest">
                        <div class="input-group-text">
                            <i :class="cpt_searchHasText ? 'multiselect-clear multiselect-clear-icon' : 'tim-icons icon-zoom-split'"
                               @click="h_cleanInputSearch()"
                            ></i>
                        </div>
                    </span>

                    <!--With debaunce version for trigger the event for request the new data with the search criteria-->
                    <!--<input v-model="search"-->
                    <!--       class="form-control"-->
                    <!--       type="text"-->
                    <!--       :placeholder="cap('data.ph-search')"-->
                    <!--       aria-describedby="addon-right addon-left"-->
                    <!--       @input="debounceListener"-->
                    <!--       @blur="h_onSrchBlursEvt($event)"-->
                    <!--       @focus="h_onSrchFocusEvt($event)"                           -->
                    <!--/>-->

                    <input v-model="search"
                           class="form-control"
                           type="text"
                           :placeholder="cap($t('form.placeholders.search'))"
                           aria-describedby="addon-right addon-left"
                           @blur="h_onSrchBlursEvt($event)"
                           @focus="h_onSrchFocusEvt($event)"
                           @keydown.enter="h_searchChange($event)"
                    />

                </div>
            </div>
        </div>
    </template>

    <!-- TABLE -->
    <table v-if="data.length > 0" class="table table-responsive-sm" :class="cpt_tableClass">
        <!-- TABLE HEADER -->
        <thead :class="theadClasses">
        <tr>
            <template v-for="header in ls_columns" :key="header.title">
                <!-- check all cell -->
                <th v-if="header.chk" colspan="1" rowspan="1">
                    <div class="form-check">
                        <label class="form-check-label">
                            <input
                                    class="form-check-input"
                                    type="checkbox"
                                    v-bind="$attrs"
                                    :checked="ls_rootChkBoxState"
                                    @change="h_ChkAllObjects($event)"
                            />
                            <span class="form-check-sign"></span>
                        </label>
                    </div>
                </th>

                <!-- normal header cell -->
                <th v-else-if="!header.hidden"
                    colspan="1"
                    rowspan="1"
                    :class="[
                            { 'text-right': header.styleToRight },
                            { 'text-left': header.styleToLeft },
                            { 'text-center': header.styleToCenter }
                        ]">

                    <!-- printing the header with i18n -->

                    {{ header.title !== '' ? $t( 'table-headers["' + header.title + '"]' ) : '' }}

                    <!-- some alternatives -->
                    <!--{{ $t( 'table-headers.' + header.title ) }}-->
                    <!--{{ $t( 'table-headers["' + header.title + '"]' ) }}-->
                    <!-- {{ header.navKey ? $t("table-headers." + header.navKey) : $t("table-headers." + header.title) }} -->

                    <!-- printing the sorters carets -->
                    <span @click.prevent="h_changeSort(header)"
                          v-if="header.sorting || header.sorting === ''"
                          class="caret-wrapper"
                    >
                            <i class="fa fa-caret-up sorter" :class="{ active: header.sorting === 'ASC' }"></i>
                            <i class="fa fa-caret-down sorter" :class="{ active: header.sorting === 'DESC' }"></i>
                    </span>
                </th>
            </template>
        </tr>

        <!-- Another row if field filters are specified -->
        <tr v-if="headerFilters.length > 0">
            <template v-for="(header, i) in ls_columns" :key="`filter-${header.title}`" class="text-center">
                <!-- filter cases: checkbox || a fieldSwitch || a iconField with only 2 options -->
                <th v-if="(header.chk || header.fieldSwitch || (header.iconField && header.iconMapValues?.length === 2 )) && headerFilters.includes(hpr_getNavKey(header))"
                    colspan="1"
                    rowspan="1"
                    :style="[{ width: header.styleWidth + '%' }]">
                    <div class="form-check text-center">
                        <label class="form-check-label">
                            <input class="form-check-input"
                                   type="checkbox"
                                   :checked="dtFilters[hpr_getNavKey(header)]"
                                   v-model="dtFilters[hpr_getNavKey(header)]"
                                   @click="hpr_setCheckBoxDirty($event)"
                            />
                            <span class="form-check-sign"></span>
                        </label>
                    </div>
                </th>
                <th v-else-if="headerFilters.includes(hpr_getNavKey(header)) && header.filterSelectOptions"
                    colspan="1"
                    rowspan="1"
                    :style="[{ width: header.styleWidth + '%' }]"
                >
                    <div class="form-group input-group">
                        <multiselect
                                v-model="dtFilters[hpr_getNavKey(header)]"
                                :options="header.filterSelectOptions"
                                @change="hpr_lastSelectedSelectElem($event)"
                                :ref=" el => { if (el) selectFilterListRef [i] = el; }"
                        />
                    </div>
                </th>
                <th v-else-if="!header.hidden"></th>
            </template>
        </tr>
        </thead>

        <!-- TABLE BODY -->
        <tbody :class="tbodyClasses">
        <tr v-for="(rowObj, rindex) in data" class="d-md-table-row" :key="rindex">
            <template v-for="(header, hindex) in ls_columns" :key="hindex">

                <!-- checkbox cell -->
                <td v-if="header.chk === true" rowspan="1" colspan="1" :style="[{ width: header.styleWidth + '%' }]">
                    <CmpTableChkbox :identifier="rowObj['id']"
                                    :checked="ls_selections.selected[rowObj['id']]"
                                    v-on:checkIntent="h_ChkObject"

                                    :key="hindex + '' + rindex"
                    />
                </td>

                <!-- switch / toggle mode for a cell -->
                <td v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.fieldSwitch"
                    rowspan="1"
                    colspan="1"
                    :style="[{ width: header.styleWidth + '%' }]"
                >
                    <!-- main role -->
                    <CmpCellSwitch :identifier="rowObj['id']"
                                   :is-enable="hpr_getRowValue(rowObj, header)"
                                   v-on:enableIntent="$emit('enableIntent', $event)"
                                   v-on:disableIntent="$emit('disableIntent', $event)"
                                   v-if="header.fieldSwitchRole !== undefined && header.fieldSwitchRole === 'main'"
                                   :key="hindex + '' + rindex"
                    />

                    <!-- secondary role | when we need two switches in the data-grid -->
                    <CmpCellSwitch :identifier="rowObj['id']"
                                   :is-enable="hpr_getRowValue(rowObj, header)"
                                   v-on:enableIntent="$emit('enableIntentSecond', $event)"
                                   v-on:disableIntent="$emit('disableIntentSecond', $event)"
                                   v-else-if="header.fieldSwitchRole !== undefined && header.fieldSwitchRole === 'secondary'"
                                   :key="hindex + '' + rindex"
                    />

                    <!-- default switch -->
                    <CmpCellSwitch :identifier="rowObj['id']"
                                   :is-enable="hpr_getRowValue(rowObj, header)"
                                   v-on:enableIntent="$emit('enableIntent', $event)"
                                   v-on:disableIntent="$emit('disableIntent', $event)"
                                   v-else
                                   :key="hindex + '' + rindex"
                    />
                </td>

                <!-- picture mode -->
                <td v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.fieldPicture"
                    class="text-center"
                    rowspan="1" colspan="1"
                    :style="[{ width: header.styleWidth + '%' }]"
                >
                    <CmpTableCellPicture
                            :type="PICTURE_TYPE_CELL.USER"
                            :statics="configStatic"
                            :picture="hpr_getRowValue( rowObj, header )"
                            :key="hindex + '' + rindex"
                    />
                </td>

                <!-- color cell -->
                <td v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.fieldColor"
                    rowspan="1"
                    colspan="1"
                    :class="[ { 'text-right': header.styleToRight }, { 'text-left': header.styleToLeft }, { 'text-center': header.styleToCenter } ]"
                    :style="[{ width: header.styleWidth + '%' }, { color: hpr_getRowValue( rowObj, header ) + '!important' }]"
                >
                    {{ hpr_getRowValue( rowObj, header ) }}
                </td>

                <!-- icon cell -->
                <td v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.iconField"
                    rowspan="1"
                    colspan="1"
                    :class="[ { 'text-right': header.styleToRight }, { 'text-left': header.styleToLeft }, { 'text-center': header.styleToCenter } ]"
                    :style="[{ width: header.styleWidth + '%' }]"
                >
                    <i :class="h_renderIconCell( rowObj, header )"></i>
                </td>

                <!-- list mode | UoM (listOPillsUoM)  version -->
                <td v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.listOPillsUoM"
                    class="text-left"
                    rowspan="1" colspan="1"
                    :style="[{ width: header.styleWidth + '%' }]"
                >
                    <CmpCellListUoM :units="hpr_getRowValue( rowObj, header )"
                                    :key="hindex + '' + rindex"
                    />
                </td>

                <!-- normal mode | follow 3 modes: 2 editables (text & select) and 1 non editable normal text cell  -->
                <!-- normal mode | normal editable cell -->
                <CmpTableEditableCell v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.cellEditable"
                        :style="[{ width: header.styleWidth + '%' }]"
                        :class="[ { 'text-right': header.styleToRight }, { 'text-left': header.styleToLeft }, { 'text-center': header.styleToCenter } ]"

                        :cell-data="hpr_getRowValue( rowObj, header )"
                        :ref-field="hpr_getNavKey(header)"
                        :ref-id="rowObj.id ?? 0"
                        :validation="header.cellEditableValidation ?? hpr_empty"
                        :input-type="header.cellEditableInputType ?? 'text'"

                        :align-tex-left="header.styleToLeft"
                        :align-tex-right="header.styleToRight"

                        @fieldUpdateIntent="h_passCellUpdateEmission"

                        :key="hindex + '' + rindex"
                />

                <!-- normal mode | select editable cell -->
                <CmpTableEditableCellSelect v-else-if="hpr_chkHasValue(rowObj, header) && !header.hidden && header.cellEditableSelect"
                        :placeholder="header.cellEditableSelectPlaceholder ?? ''"
                        :cell-data="hpr_getRowValue( rowObj, header )"
                        :ref-field="hpr_getNavKey(header)"
                        :ref-id="rowObj.id ?? 0"
                        :validation="header.cellEditableValidation ?? hpr_empty"
                        :options="header.cellEditableSelectOptions ?? []"
                        :searchable="header.cellEditableSelectSearchable ?? false"

                        @fieldUpdateIntent="h_passCellUpdateEmission"

                        :key="hindex + '' + rindex"
                />

                <!-- normal mode | non editable cell -->
                <td v-else-if="hpr_chkHasValue(rowObj, header, header.forceEmptyRender) && !header.hidden"
                    rowspan="1"
                    colspan="1"
                    :class="[ { 'text-right': header.styleToRight }, { 'text-left': header.styleToLeft }, { 'text-center': header.styleToCenter } ]"
                    :style="[{ width: header.styleWidth + '%' }]"
                >
                    {{ hpr_getRowValue( rowObj, header ) }}
                </td>

            </template>

            <!-- ACTIONS BUTTONS TD -->
            <td class="actions" v-if="hasActions && hpr_chkHasId(rowObj)">
                <!-- we can are going to adapt the action bar buttons according to the entity given in entityMode props -->

                <CmpTableRowActions :mode="abutton_mode"
                                    :identifier="rowObj['id']"
                                    v-on:deleteIntent="$emit('deleteIntent', $event)"
                                    v-on:detailsIntent="$emit('detailsIntent', $event)"
                                    v-on:editIntent="$emit('editIntent', {...rowObj})"

                                    :key="'a' + rindex"
                />
            </td>
        </tr>
        </tbody>
    </table>
    <CmpTableEmpty v-else />

    <!-- PAGINATION -->
    <CmpTablePagination v-if="data.length > 0 && hasPagination" v-on:next="h_computePaginationData" />
</template>

<script lang="ts">
import appConfig from '@/configs/app.conf'
import { onBeforeUpdate, computed, defineComponent, toRaw, reactive, ref } from 'vue'
import { watch } from '@vue/runtime-core'
import CmpTablePagination from './CmpTablePagination.vue'
import CmpCellSwitch from './CmpCellSwitch.vue'
import CmpTableEmpty from './CmpTableEmpty.vue'
import CmpTableChkbox from './CmpTableChkbox.vue'
import CmpTableCellPicture from './CmpTableCellPicture.vue'
import CmpCellListUoM from './CmpCellListUoM.vue'
import CmpTableRowActions from './CmpTableRowActions.vue'
import CmpTableEditableCell from './CmpTableEditableCell.vue'
import CmpTableEditableCellSelect from './CmpTableEditableCellSelect.vue'
import CmpTableActionBar from './CmpTableActionBar.vue'
import { CmpBaseButton } from '@/components'
import useCommon from '@/services/composables/useCommon'
import Multiselect from '@vueform/multiselect'
import { useSt_Pagination } from '@/stores/pagination'
import { PICTURE_TYPE_CELL } from '@/services/definitions'

import type { SetupContext, PropType } from 'vue'
import type { ById, TBulkAction, IIndexable, IColumnHeader, ITableChkEmit, IChecked, Filter, ICellUpdate, IExtFilterGroup  } from '@/services/definitions'


export default defineComponent({
    name: 'CmpDataTable',
    components: {
        Multiselect,
        CmpBaseButton,

        CmpTablePagination,
        CmpCellSwitch,
        CmpTableEmpty,
        CmpTableChkbox,
        CmpCellListUoM,
        CmpTableActionBar,
        CmpTableRowActions,
        CmpTableCellPicture,
        CmpTableEditableCell,
        CmpTableEditableCellSelect,
    },
    props: {
        subject:             {
            type:        String,
            description: 'This should be the translation (❗means the translated string) value string for a specific entity of the business. This value could be used for contextualization in components tips & titles and others translations strings.',
            required:    false
        },
        actionBarMode:       {
            type:        Number,
            description: 'Tells in which mode should the action bar most be rendered',
            required:    true
        },
        actionBtnMode:       {
            type:        Number,
            description: 'Tells in which mode should rendered the rows\' action buttons',
            required:    true
        },
        columns:             {
            type:        Array,
            default:     (): IColumnHeader[] => [],
            description: 'Table columns'
        },
        data:                {
            type:        Object as PropType<IIndexable[]>,
            default:     [],
            description: 'The collection of the data for display in the table'
        },
        hasActions:          {
            type:        Boolean,
            default:     false,
            description: 'If the table has actions buttons or not'
        },
        hasTopBtnBar:        {
            type:        Boolean,
            default:     true,
            description: 'If the table has the top button bar for specific actions like creation button'
        },
        hasPageSizeSelector: {
            type:        Boolean,
            default:     true,
            description: 'If the table has the page size (limit) selector items'
        },
        hasPagination: {
            type:        Boolean,
            default:     true,
            description: 'Tells if the table have to render the pagination component'
        },
        hasSearch:           {
            type:        Boolean,
            default:     true,
            description: 'If the table has search field or not'
        },
        tbodyClasses:        {
            type:        String,
            default:     '',
            description: 'tbody tag css classes'
        },
        theadClasses:        {
            type:        String,
            default:     '',
            description: 'thead tag css classes'
        },
        tableType:           {
            type:        String,            // values can be 'striped' | 'hover'
            default:     '',
            description: 'Whether table is striped or hover type',

            validator( value: string ): boolean {
                const acceptedValues = [ '', 'striped', 'hover' ]
                return acceptedValues.indexOf(value) !== -1
            }
        },

        headerFilters:   {
            type:        Array,
            description: 'Array of fields to filter by. This just for filters we want to render in the table column headers',
            required:    false,
            default:     []
        },
        extendedFilters: {
            type:        Object as PropType<IExtFilterGroup[]>,
            description: 'Helps to defined a extended collections of filters. Can come in handy when we need other filter criteria that we don\'t want to put in the table columns headers',
            required:    false,
            default:     []
        }
    },
    emits: [
        'cellUpdateIntent',                     // an editable cell (is a child component) emit an update event

        'detailsIntent',                        // details, rows action event
        'deleteIntent',                         // delete, rows action event
        'editIntent',                           // edit, rows action event

        'navCreateIntent',                      // for creating new entity

        'enableIntent',
        'disableIntent',
        'enableIntentSecond',
        'disableIntentSecond',

        'bulkActionIntent',

        'requestIntent'                        // make a request of data, normally using a IDataTableQuery object as parameter with the event emission
    ],

    setup( props: any, ctx: SetupContext ) {

        //region ======== DECLARATIONS & LOCAL STATE ============================================

        const pageSizeOptions = { '10': 10, '25': 25, '50': 50, '100': 100 }                            // pagination size (options) data
        const ls_selections = reactive<{ selected: ById<IChecked> }>({ selected: {} })            // ls =  local state
        const ls_rootChkBoxState = ref<boolean>(false)
        const ls_columns = ref<Array<Partial<IColumnHeader>>>([ ...props.columns ])
        const ls_extFilters = ref<Array<IExtFilterGroup>>([...props.extendedFilters])

        const hpr_lastSelectedSelectElemRef = ref<number>(0)                                      // Receive the value of item selected in select component
        const isAnyCheckboxSelectedRef = ref<boolean>(false)                                      // True if at least, one checkbox component filter was selected
        const selectFilterListRef = <any> ref([])                                                 // reference to any select component filter

        /**
         * Datatable action *bar* mode
         */
        const abar_mode = toRaw(props.actionBarMode)                                                    // Returns the raw, original object of a reactive or readonly proxy. This is an escape hatch that can be used to temporarily read without incurring proxy access/tracking overhead or write without triggering changes.
        /**
         * Datatable action *button* mode
         */
        const abutton_mode = toRaw(props.actionBtnMode)                                                 // Returns the raw, original object of a reactive or readonly proxy. This is an escape hatch that can be used to temporarily read without incurring proxy access/tracking overhead or write without triggering changes.

        const { cap } = useCommon()
        const search = ref('')
        const dtFilters = ref<any>({})

        const st_pagination = useSt_Pagination()                                                        // Pinia instance of pagination store// Store the datatable filters

        //endregion =============================================================================

        //region ======== HOOKS =================================================================

        /***
         * Make sure to reset the refs before each update.
         */
        onBeforeUpdate(() => {
            selectFilterListRef.value = []
        })

        //endregion =============================================================================

        //region ======== COMPUTATIONS & GETTERS ================================================

        const cpt_tableClass = computed((): string => props.tableType && `table-${ props.tableType }`)
        const cpt_searchHasText = computed(() => search.value.length > 0)

        /**
         * Tells is we have any of the extended filters active in the UI
         */
        const cpt_isAnyExtFActive = computed(() => {

            for (let i = 0; i < ls_extFilters.value.length; i++)
                if (ls_extFilters.value[i].filters.some(filter => filter.isActive === true)) return true

            return false
        })

        //endregion =============================================================================

        //region ======= EVENTS HANDLERS & WATCHERS =============================================

        /**
         * This method process the changes made in the UI regarding the extended filters
         *
         * @param fGroupIndex index of the filter group
         * @param fIndex index of the actual filter
         */
        const h_extFilter = (fGroupIndex: number, fIndex: number) => {
            // toggling the filters status
            ls_extFilters.value[fGroupIndex].filters[fIndex].isActive = !ls_extFilters.value[fGroupIndex].filters[fIndex].isActive

            // if the  extended filter status was set to true (so the filter is active), we add it to the active filters collection, we remove it otherwise.
            ls_extFilters.value[fGroupIndex].filters[fIndex].isActive
                ? dtFilters.value[ls_extFilters.value[fGroupIndex].filters[fIndex].entityField] = ls_extFilters.value[fGroupIndex].filters[fIndex].value
                : delete dtFilters.value[ls_extFilters.value[fGroupIndex].filters[fIndex].entityField]
        }

        const h_passCellUpdateEmission = (data: ICellUpdate) => {
            ctx.emit('cellUpdateIntent', data)
        }

        const h_onSrchFocusEvt = ( evt: any ) => {
            if (evt.target.value.length < 4) hpr_inputToggleFocusClass(evt.target.parentElement.parentNode)
        }

        const h_onSrchBlursEvt = ( evt: any ) => {
            if (evt.target.value.length < 4) hpr_inputToggleFocusClass(evt.target.parentElement.parentNode)
        }

        const h_ChkAllObjects = ( evt: any ) => {
            ls_selections.selected = hpr_updateChckAllToSelection(evt.target.checked, props.data)
        }

        const h_ChkObject = ( args: ITableChkEmit ) => {
            hpr_updateChkSelection(ls_selections.selected, args)
        }

        const h_EnableChkCollection = () => {
            ctx.emit('bulkActionIntent', {
                ids: [ ...Object.keys(ls_selections.selected) ],
                actionType: 'ENABLE' as TBulkAction
            })
            hpr_cleanCheckBoxes()
        }

        const h_DisableChkCollection = () => {
            ctx.emit('bulkActionIntent', {
                ids: [ ...Object.keys(ls_selections.selected) ],
                actionType: 'DISABLE' as TBulkAction
            })
            hpr_cleanCheckBoxes()
        }

        const h_RemoveChkCollection = () => {
            ctx.emit('bulkActionIntent', {
                ids: [ ...Object.keys(ls_selections.selected) ],
                actionType: 'REMOVE' as TBulkAction
            })
            hpr_cleanCheckBoxes()
        }

        const h_pageSizeChange = ( evt: any ) => {
            st_pagination.mutSelectorPageSize(+evt)
            ctx.emit('requestIntent', st_pagination.getQueryData)
        }

        const h_computePaginationData = ( nextPage: number ) => {
            ctx.emit('requestIntent', st_pagination.getQueryData)
        }

        /***
         * Update sorting information of the headers/columns array (IColumnHeader [])
         * @param clickedSortHeader Clicked header/column object
         */
        const h_changeSort = ( clickedSortHeader: Partial<IColumnHeader> ) => {
            ls_columns.value = ls_columns.value.map<Partial<IColumnHeader>>(header => {
                if (header.title === clickedSortHeader.title && header.sorting !== undefined) {
                    switch (header.sorting) {
                        case 'ASC':
                            header.sorting = 'DESC'
                            break
                        case 'DESC':
                            header.sorting = ''
                            break
                        case '':
                            header.sorting = 'ASC'
                            break
                    }
                    let key = hpr_getNavKey(header)

                    // Handling the orderer as API expects it: CamelCase with first letter caps. Specially handling the 'id' header,
                    // hopefully this is the only corner case
                    if (key !== 'id') key = key.replace(/^\w/, c => c.toUpperCase())

                    st_pagination.Orderer = key
                    st_pagination.OrderDir = header.sorting

                    ctx.emit('requestIntent', st_pagination.getQueryData)
                }
                else if (header.sorting !== undefined) header.sorting = ''

                return header
            })
        }

        const h_searchChange = ( evt: any ) => {
            st_pagination.Search = evt.target.value
            ctx.emit('requestIntent', st_pagination.getQueryData)
        }

        const h_cleanInputSearch = () => {
            st_pagination.Search = ''
            search.value = ''
        }

        /**
         * Process the filters present in the UI to make a request to populate the table with tha data, according to
         * the filters and the input search field (the search field value is handled by h_searchChange method)
         *
         * When the user inputs data to lookup for in the search input, this methods updates
         * the query filter data struct. This struct of data will be used as query to make the
         * request to the backend with the filters and the lookup / search terms. Finally
         * the event is emitted
         *
         * ❗ the 'filter' value identify a column header, because take the same values as the columns navigation key (navkey)
         */
        function h_doRequest() {
            const dataFilter: Filter = {}

            Object.keys(dtFilters.value).forEach(filter => {
                if (dtFilters.value[ filter ]) dataFilter[ `Filters[${ cap(filter) }]` ] = dtFilters.value[ filter ]
                else if (isAnyCheckboxSelectedRef.value && (hpr_getColumnHeaderByNavKey(filter)?.fieldSwitch || hpr_getColumnHeaderByNavKey(filter)?.iconField))
                    dataFilter[ `Filters[${ cap(filter) }]` ] = dtFilters.value[ filter ]
            })

            st_pagination.Filters = { ...dataFilter }

            ctx.emit('requestIntent', st_pagination.getQueryData)
        }

        /***
         * Clean all components that has a filter setup
         */
        const h_clearAllFilters = () => {
            search.value = ''
            isAnyCheckboxSelectedRef.value = false

            st_pagination.Search = ''
            hpr_cleanCheckBoxes()
            hpr_cleanExtFilters()

            // clearing the filters entirely
            dtFilters.value = {}

            // clearing the select field
            for (let elemSelect of selectFilterListRef.value)
                if (elemSelect !== undefined) elemSelect.remove([ 0 ])

            // ctx.emit('requestIntent', st_pagination.getQueryData)        // becase the reset of *dtFilters* the watcher will be trigger a request, so I think this isn't needed, in case of active this line, the request will be made twice and we don't want that
        }

        /**
         * For the IconCells, this tries to render the correct icon according with the
         * cell value, if the proper that was given in the 'iconMapValues' (IColumnHeader object) header field
         *
         * @param obj entity data used as a row
         * @param column IColumnHeader object
         */
        const h_renderIconCell = ( obj: any, column: IColumnHeader ): string => {

            if(column.iconMapValues?.length === undefined) return ''

            const cellVal = hpr_getRowValue(obj, column)

            for (let i = 0; i < column.iconMapValues?.length; i++)
                if(cellVal === column.iconMapValues[i].val)
                    return column.iconMapValues[i].icon

            return ''
        }

        //endregion =============================================================================

        //region ======== WATCHERS ==============================================================

        watch(
                () => dtFilters,
                () => h_doRequest(),
                { deep: true }
        )

        //endregion =============================================================================

        //region ======== HELPERS ===============================================================

        /**
         * Tries to get an existed column header according with the given navigation key (navkey).
         * Check 'IColumnHeader' definition.
         *
         * @param cNavKey column header navigation key to look for
         */
        const hpr_getColumnHeaderByNavKey = ( cNavKey: string ) => {
            return ls_columns.value.find(header => header.navKey == cNavKey)
        }

        /***
         * Try to empty the selection reactive var to make unchecked all the checked rows in the table
         */
        const hpr_cleanCheckBoxes = () => {
            ls_rootChkBoxState.value = false
            ls_selections.selected = hpr_updateChckAllToSelection(false)
        }

        /**
         * Tries to reset the *isActive* status of all the defined extended filters, se the UI not shows any of them active
         */
        const hpr_cleanExtFilters = () => {

            ls_extFilters.value = ls_extFilters.value.map(fg => {
                fg.filters = fg.filters.map(filter => {
                    filter.isActive = false
                    return filter
                })

                return fg           // filter group
            })
        }

        /**
         * If status is true, return a new selection for selecting all the object from table (the same as data). Otherwise
         * return an empty selection collection.
         *
         * @param status The new status from the root checkbox input event
         * @param data The props containing all the data represented on the table
         */
        const hpr_updateChckAllToSelection = ( status: boolean, data: Array<IIndexable> | undefined = undefined ): ById<IChecked> => {
            ls_rootChkBoxState.value = status

            if (status)
                return data!.reduce<ById<IChecked>>(( accumulator, obj ) => {
                    accumulator[ obj.id ] = { chked: true }

                    return accumulator
                }, {})
            else return {}
        }

        /***
         * Modify the source (selected objects in the table) to update (depends of newStatus in updateData) the selected object ID
         *
         * @param source The source collection of already selected (or none) ID object
         * @param updateData ITableChkEmit data. Coming from the checked row cell, containing the object id and its new checked status.
         */
        const hpr_updateChkSelection = ( source: ById<IChecked>, updateData: ITableChkEmit ): void => {
            if (updateData.newStatus) source[ updateData.id ] = { chked: updateData.newStatus }
            else delete source[ updateData.id ]
        }

        /***
         * After the addition to this class to the element the styles applies the correct border
         * color to the form group (class) element (div)
         *
         * @param formGroupEl Div with the form-group class the input (event target) belongs to
         */
        const hpr_inputToggleFocusClass = ( formGroupEl: Element ) => {
            formGroupEl.classList.toggle('input-group-focus')
        }

        /***
         * Get navigation key for obtain the row object property value. Like 2D matrix['navigation_key']
         * @param column object describing the header properties
         */
        const hpr_getNavKey = ( column: Partial<IColumnHeader> ): string => {
            return column.navKey ?? column.title!.toLowerCase()
            // return column.navKey !== undefined ? column.navKey : column.title!.toLowerCase()
        }

        /***
         * Check if the row object has a value corresponding to a specific header
         * @param obj row object
         * @param column object describing the header properties
         * @param forceEmptyRender
         */
        const hpr_chkHasValue = ( obj: any, column: IColumnHeader, forceEmptyRender: boolean | undefined = undefined ): boolean => {
            const key = hpr_getNavKey(column)

            if (!forceEmptyRender) return obj[ key ] !== undefined
            return true
        }

        /***
         * Check if the row object has an id property
         * @param obj row object
         */
        const hpr_chkHasId = ( obj: any ): boolean => {
            return obj[ 'id' ] !== undefined
        }

        /**
         * Get the actual row object property value base on the navigation key from the column object
         * @param obj row object
         * @param column object describing the header properties
         */
        const hpr_getRowValue = ( obj: any, column: IColumnHeader ): string | number => {
            const key = hpr_getNavKey(column)
            return obj[ key ] === undefined ? '' : obj[ key ]
        }

        /**
         * Check if a item was selected in select component filter
         * @param evt
         */
        const hpr_lastSelectedSelectElem = ( evt: any ) => {
            hpr_lastSelectedSelectElemRef.value = +evt
        }

        /***
         * Set if a checkbox item as  selected / touched / dirty by the user or the program
         * @param evt
         */
        const hpr_setCheckBoxDirty = ( evt: any ) => {
            // isAnyCheckboxSelectedRef.value = evt.target!.checked
            if (!isAnyCheckboxSelectedRef.value) isAnyCheckboxSelectedRef.value = true
        }

        /**
         * Intents to be used as shadow / empty function as substitution if no validation function is provided for an
         * editable cell in the Partial<IColumnHeader> array of data
         * @param _
         */
        const hpr_empty = ( _: any ) => { return true }

        /**
         * Check if any filter is active and returns true in case positive
         * E.g: A word on input search field, a checkbox or all checkbox selected,
         * or an item of select component
         */
        const cpt_isAnyFilerActive = computed(() => {
            let chkBoxSelected = Object.keys(ls_selections.selected).length
            return search.value.length > 0 || chkBoxSelected > 0 || hpr_lastSelectedSelectElemRef.value > 0 || isAnyCheckboxSelectedRef.value || cpt_isAnyExtFActive.value
        })

        //endregion =============================================================================

        return {

            abar_mode,
            abutton_mode,

            ls_columns,
            ls_selections,
            ls_rootChkBoxState,
            ls_extFilters,
            dtFilters,
            selectFilterListRef,
            hpr_lastSelectedSelectElemRef,
            cpt_isAnyFilerActive,
            pageSizeOptions,
            search,
            cpt_searchHasText,

            hpr_empty,
            hpr_getNavKey,
            hpr_chkHasValue,
            hpr_getRowValue,
            hpr_chkHasId,

            h_onSrchFocusEvt,
            h_onSrchBlursEvt,

            h_ChkObject,
            h_ChkAllObjects,
            h_cleanInputSearch,
            h_pageSizeChange,
            h_EnableChkCollection,
            h_DisableChkCollection,
            h_RemoveChkCollection,
            h_computePaginationData,
            h_changeSort,
            h_searchChange,
            h_doRequest,
            h_extFilter,
            h_clearAllFilters,
            h_passCellUpdateEmission,
            h_renderIconCell,

            // ...useDebaunce(h_searchChange),

            hpr_lastSelectedSelectElem,
            hpr_setCheckBoxDirty,
            cpt_tableClass,

            cap,

            configStatic: appConfig.server.statics,
            PICTURE_TYPE_CELL: PICTURE_TYPE_CELL
        }
    }
})
</script>
