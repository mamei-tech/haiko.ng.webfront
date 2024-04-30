<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- FORM -->
          <form class="form">
            <div class="row">

              <div class="col-xm-12 col-md-6">
                <!-- id -->
                <div class="row">
                  <div class="col-md-9">
                    <CmpBaseInput
                        disabled
                        placeholder="###########"
                        name="id"
                        type="hidden"
                    />
                  </div>
                </div>

                <!-- ucName -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.uomcatetgory.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.strg-category-name')"
                        name="sCatName"
                        type="text"
                    />
                  </div>
                </div>

                <!-- category -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.strgcategory.prod-policy' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.strg-category-policy').toLowerCase()"
                                         :options="st_nomenclatures.getStrgProdPolicies4Select"
                                         searchable
                                         name="allowProdType"
                                         class="mb-2"
                                         closeOnSelect
                    >

                      <!--option coming from slot child component ('slots props') [option] -->
                      <template #customOption="{option}">
                        {{ option.label }}
                      </template>

                      <!-- option coming from slot child component ('slots props') [value] -->
                      <template #customSingleLabel="{value}">
                        <div class="multiselect-placeholder">
                          {{ value.label }}
                        </div>
                      </template>

                    </CmpMultiselectField>
                  </div>
                </div>

              </div>
            </div>

            <!-- products line | capacity by products -->
            <div class="row">
              <div class="col-12">
                <CmpDataTable table-type="hover"
                              :action-bar-mode="abar_mode"
                              :action-btn-mode="abutton_mode"

                              :columns="columns"
                              :data="values.prodCapacityLine"

                              :has-actions="true"
                              :has-top-btn-bar="true"
                              :has-page-size-selector="false"
                              :has-search="false"

                              @deleteIntent="h_intentRowDelete"
                              @navCreateIntent="h_intentProdLineCreate"

                              @cellUpdateIntent="h_updateCell"
                              @selectFieldOpened="h_prodSelectOpened"
                              @selectFieldSearch="h_prodSelectSearch"
                >
                </CmpDataTable>
              </div>
            </div>
          </form>

          <!-- FORM ACTION BUTTONS -->
          <template v-slot:footer>
            <CmpFormActionsButton
                :show-delete="cpt_fMode === 'edit'"
                v-on:saveIntent="h_beforeSubmit"
                v-on:deleteIntent="h_delete"
                v-on:cancelIntent="nav_back"
            />
          </template>
        </CmpCard>

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { onMounted, defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { i18n } from '@/services/i18n'
import { CmpCard, CmpFormActionsButton, CmpBaseInput, CmpBaseButton, CmpDataTable, CmpMultiselectField } from '@/components'
import { ApiStrgCategory } from '@/services/api/inventory/api-strgcategory'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import useCommon from '@/services/composables/useCommon'
import {
    ENTITY_NAMES, DT_ACTIONBAR_MODE,
    FMODE,
    KEYS, OPS_KIND_STR,
    RoutePathNames, DT_ACTION_BUTTON_MODE,
    HStrgCatProductLine, ACTION_KIND_STR, VSchemaStrgCategory,
} from '@/services/definitions'

import type { ComputedRef } from 'vue'
import type { IColumnHeader, TFormMode, ICellUpdate, IDtoStrgCategory, IStrgCatProdLine, IProdUoM, IDtoWarehouse } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormStrgCat',
    components: {
        CmpCard,
        CmpDataTable,
        CmpBaseInput,
        CmpBaseButton,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global
        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                           // PRODUCTS datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JDEL              // PRODUCTS datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HStrgCatProductLine)                  // PRODUCTS entity customized datatable header

        const route = useRoute()
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                                      // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const toast = useToast()                                                            // the toast lib interface

        const { debounce } = useCommon()
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()
        const { tfyCRUDSuccess, tfyError, tfyCRUDFail } = useToastify(toast)

        const { fmode, id } = route.params                                                  // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions
        const { mkStrgCategory, mkStrgCatProductLine } = useFactory()

        // html references

        // helpers & flags
        /**
         * ls_isProdUoMRequestedByOpenW = ls (local storage) is product unit of measurement requested by select open
         * It is a boolean flag to know las time we made a product request related to the select open windows criteria
         */
        const ls_isProdUoMRequestedBySOpen = ref<boolean>(false)

        /**
         * An ID counter auxiliary var for the IStrgCatProdLine (products line) rows of the table when the creation mode is on. We need that the Product Lines (IStrgCatProdLine) rows has it own temporal identifier for proper data update when child component emit cell update intents
         * ❗ An important thing, we use negative values so we can diferenciate new associations from the existing ones in edition mode
         */
        const auxIdCounter = ref<number>(-1)

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================

        /**
         * Vue hook before component is mounted in the DOM
         * If this view is called as edit mode rather than creation mode, we need to call the backend API
         * asking for the resource so we can populate the datatable
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(async () => {
            window.addEventListener('keydown', h_keyboardKeyPress)                            // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
            await st_nomenclatures.reqNmcUoM()

            if (cpt_fMode.value === FMODE.CREATE as TFormMode) return

            let formDataFromServer: IDtoStrgCategory | undefined = undefined                        // aux variable to save entity data requested from the server
            try {
                formDataFromServer = ( await ApiStrgCategory.reqStrgCategoryById(+id) ).data as IDtoStrgCategory
                if (formDataFromServer.id == undefined ) return;

                await hpr_setUpData(formDataFromServer)

                // ❗❗❗ we have to use the spread operator here to prevent the array of units it's being copied by reference, and reflect the changes in the store

                // this is so the form does not appear as dirty
                // as javascript pass the values as reference
                // https://vee-validate.logaretm.com/v4/guide/components/handling-forms/ | resetting the form
                resetForm({
                    values: {
                        ...formDataFromServer,
                        prodCapacityLine: [ ...formDataFromServer?.prodCapacityLine ?? [] ],
                        prodCapacityToDelete: []
                    },
                    errors: {}
                })
            }
            catch (err) {tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST)}
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newStrgCategory new storage category to be created. This categories are related to warehouses locations
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newStrgCategory: IDtoStrgCategory, isFormDirty: boolean, doWeNeedToStay: boolean): void => {
            hpr_sanitation(newStrgCategory)             // sanitation

            // making the request
            ApiStrgCategory.reqInsStrgCategory(newStrgCategory).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.STRGCATEGORY, OPS_KIND_STR.ADDITION, newStrgCategory.sCatName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()            // so we are going back to the data table
                else hpr_cleanForm()                    // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STRGCATEGORY, OPS_KIND_STR.ADDITION))
        }

        const a_edit = ( updatedStrgCategory: IDtoStrgCategory, isFormDirty: boolean, doWeNeedToStay: boolean): void => {
            hpr_sanitation(updatedStrgCategory)         // sanitation

            ApiStrgCategory.reqUpdateStrgCat(updatedStrgCategory).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.STRGCATEGORY, OPS_KIND_STR.UPDATE, updatedStrgCategory.sCatName)

                // so now what ?
                if (!doWeNeedToStay) nav_back()            // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STRGCATEGORY, OPS_KIND_STR.UPDATE))
        }

        /**
         * Request the deletion (from server) of an entity according with the given identifier
         *
         * @param id UoM category identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async ( id: number, ref: undefined | string = undefined ): Promise<void> => {

            console.error("not implemented")                      // TODO pending implementation

            /*st_uom.reqUoMCatDeletion(id)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.DELETION, ref)
                nav_back()
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.DELETION, ref))*/
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, resetForm, setFieldValue, values } = useForm<IDtoStrgCategory>({
            validationSchema: VSchemaStrgCategory,
            initialValues:    mkStrgCategory(),
            initialErrors:    undefined
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================

        const hpr_getUoMByProdID = ( prodID: number ) => {

            const prodUoM = st_nomenclatures.prodUoM.find(( prodUoM: IProdUoM ) => prodUoM.id === prodID)           // search for IProdUoM in the select state
            if (prodUoM != undefined) return st_nomenclatures.getUoMByIdMap[+prodUoM.pUoMID]                        // so we find a product, so we need to retrieve the UoM label to be displayed on the IStrgCatProdLine table

            return undefined                                                                                        // so we don't, we return empty string
        }

        /**
         * Update the collection of the ProUoM object from the initial form value
         * then sync the same ProUoM collection with the actual current form data managed by vee-validate lib
         *
         * @param data UoM data to be updated in the collection
         */
        const hpr_updateProdUoMInList = ( data: ICellUpdate ) => {

            setFieldValue('prodCapacityLine', values.prodCapacityLine.map(( row: IStrgCatProdLine ) => {
                if (row.id === data.entityId)
                {
                    row[ data.entityField as keyof IStrgCatProdLine ] = data.updatedValue as never

                    // if the update cell is the product selection, we need to grasp the 'ProductID' an look for the label of its UoM
                    if (data.entityField == 'productID') {
                        let uom = hpr_getUoMByProdID (+data.updatedValue)

                        uom != undefined ? row.uomLabel = uom.uName : row.uomLabel = ''
                    }
                }

                return row
            }))
        }

        /**
         * Get and setup the product and its UoM data from server, related to the edited entity. This method is intended to be
         * used only in entity edition situations
         *
         * @param formData formulary data of the entity that wants to be edited
         */
        const hpr_setUpData = async ( formData: IDtoStrgCategory ) => {

            if (formData.prodCapacityLine.length > 0)                                                           // requesting product related data, if needed
            {
                const ids = formData.prodCapacityLine.map(p => +p.productID)
                await st_nomenclatures.reqNmcProdUoMById(ids)
                columns.value[ 1 ].cellEditableSelectOptions = st_nomenclatures.getProdUoM4Select               // populating the select
            }

            formData.prodCapacityLine = formData.prodCapacityLine.map(( row: IStrgCatProdLine ) => {
                let uom = hpr_getUoMByProdID(+row.productID)
                uom != undefined ? row.uomLabel = uom.uName : row.uomLabel = ''

                return row
            })
        }

        /**
         * Runs a set of validations checks.
         * If the set of validations isn't successful, the the submit event doesn't go any further.
         */
        const hpr_isProdCapacityLineValid = (): boolean => {
            let errorMsg = undefined

            for (let i = 0; i < values.prodCapacityLine.length ; i++) {
                if (values.prodCapacityLine[i].maxCapacity > 1) continue

                errorMsg = t('validation.strg-cat-prod-lines-qty')
                break
            }

            // so far so good
            if (errorMsg === undefined) return true

            tfyError(errorMsg)
            return false
        }

        /**
         * Sanitation instructions
         */
        const hpr_sanitation = ( strgCat: IDtoStrgCategory ): void => {

            strgCat.prodCapacityLine = strgCat.prodCapacityLine.map(( item: IStrgCatProdLine ) => {
                if (item.id < 0) item.id = 0                              // the index less than 0 it only relevant to the front logic, so the new item on the list can be identified. In the backend new entities new entities must always be 0.
                delete item.uomLabel

                return item
            })

            delete strgCat.wLocationCount
        }

        /**
         * Resetting the form
         */
        const hpr_cleanForm = (): void => {
            resetForm({ values: mkStrgCategory(), errors: undefined })
        }

        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * This method tries to accommodate the data before it will be sent to the server
         * Handles the form submission event through the vee-validate 'SubmissionHandler' so we can take advantage of all
         * the its validation logic but using with own logic inserted as callback
         *
         * @param evt HTML event
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = (evt: Event, doWeNeedToStay: boolean) => {
            evt.preventDefault()

            // validating the product capacity line list first
            if(!hpr_isProdCapacityLineValid()) return

            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, meta.value.dirty, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode)) a_edit(formData, meta.value.dirty, doWeNeedToStay)
                // if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()
            }).call(this)
        }

        const h_keyboardKeyPress = (evt: any) => {
            if(evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        /**
         * Locally, add a empty Storage Category Product Line (StrgCatProductLine) in the collection so the UI can react / reflect the changes.
         * This method allows to add new UoM to the Storage Category (StrgCategory)
         */
        const h_intentProdLineCreate = async () => {
            values.prodCapacityLine.push(mkStrgCatProductLine(auxIdCounter.value, cpt_fMode.value === FMODE.CREATE ? 0 : +id))
            auxIdCounter.value -= 1
        }

        /**
         * Its jobs its to maintain sync the user changes in the table of UoM an the local store data of UoM
         * @param data
         */
        const h_updateCell = (data: ICellUpdate) => {
            hpr_updateProdUoMInList(data)
        }

        const h_intentRowDelete = ( rowId: number ) => {

            setFieldValue('prodCapacityLine', values.prodCapacityLine.filter(( row: IStrgCatProdLine ) => {
                if(row.id !== rowId) return row
                if(row.id === rowId && rowId > 0 && cpt_fMode.value === FMODE.EDIT) values.prodCapacityToDelete.push(+row.productID)

                // this las condition tries to handle the situation of the edit form mode, that we need to record a Product Capacity Association
                // that already exist in the database and the user want to deleted. So we write down the its identifier
            }))
        }

        /**
         * Handles the dynamic request for getting the products list from the backend to populate the product selection
         * options in the form input select, allowing us to define the Product Capacity Associations of the Storage Category
         */
        const h_prodSelectOpened = async () => {
            if (ls_isProdUoMRequestedBySOpen.value) return

            await st_nomenclatures.reqNmcProdUoM()                                                          // requesting products data
            columns.value[ 1 ].cellEditableSelectOptions = st_nomenclatures.getProdUoM4Select               // populating the select

            ls_isProdUoMRequestedBySOpen.value = true
        }

        /**
         * Handles the dynamic request and the search query written in form input select, so we can get the products
         * list from the backend to populate the product selection options, allowing us to define the Product Capacity
         * Associations of the Storage Category
         */
        const h_prodSelectSearch = debounce(async ( queryStr: string ) => {

            await st_nomenclatures.reqNmcProdUoM(queryStr)                                                // requesting products data
            columns.value[ 1 ].cellEditableSelectOptions = st_nomenclatures.getProdUoM4Select             // populating the select
            ls_isProdUoMRequestedBySOpen.value = false

        }, 1500)

        const h_delete = async ( evt: any ) => {
            // TODO
        }

        //endregion ===========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.strgcategoryList })
        }

        //endregion ===========================================================================

        return {
            values,

            abar_mode,
            abutton_mode,

            columns,
            cpt_fMode,

            nav_back,
            h_delete,
            h_updateCell,
            h_beforeSubmit,
            h_intentRowDelete,
            h_intentProdLineCreate,

            h_prodSelectOpened,
            h_prodSelectSearch,

            st_nomenclatures
        }
    }
})
</script>
