<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <!--<CmpCard v-on:doClick="nav_back">-->

          <!-- FORM -->
        <form class="form form-horizontal">

          <!-- id -->
          <CmpBaseInput
              disabled
              placeholder="###########"
              name="id"
              type="hidden"
          />

          <div class="row">
            <div class="col-xm-12 col-md-12">
              <!-- pType => Partner type -->
              <div class="row">
                <div class="col-md-12">
                  <CmpBaseRadio inline
                                id="pType"
                                v-model="values.pType"
                                :value="values.pType"
                                :options="addressTypeOptions"
                                @updated="h_addressTypeSelection"
                  />
                </div>
              </div>
              <p v-show="values.pType !== undefined">{{ $t( `entities.address-type.tips.${values.pType}` ) }}</p>
            </div>

            <hr class="collapsable-form-section-divisor mt-4">        <!-- padding & divider -->

            <!-- ONLY 4 contact version -->
            <div v-if="values.pType === ADDRESS_TYPE.CONTACT" class="col-xm-12 col-md-6">

              <!-- isActive -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'data.status' ) }}
                </label>
                <div class="col-md-9">
                  <CmpVeeCheckbox name="isActive"
                                  :checked="values.isActive"
                                  :labels="[$t('others.available'), $t('others.unavailable')]"
                  />
                </div>
              </div>

              <!-- contact name -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'entities.partner.contact-name' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      :placeholder=" values.isCompany === true ? $t('form.placeholders.suppliers-company-name') : $t('form.placeholders.suppliers-individual-name')"
                      name="pName"
                      type="text"
                  />
                </div>
              </div>

              <!-- job position -->
              <div v-show="values.isCompany === false" class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'entities.supplier.job-position' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      :placeholder="$t('form.placeholders.suppliers-job-position')"
                      name="jobPosition"
                      type="text"
                  />
                </div>
              </div>

            </div>

            <!-- ONLY 4 addresses  type version -->
            <div v-if="values.pType !== ADDRESS_TYPE.CONTACT" class="col-xm-12 col-md-6">

              <!-- contact name -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'entities.partner.contact-name' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      :placeholder=" values.isCompany === true ? $t('form.placeholders.suppliers-company-name') : $t('form.placeholders.suppliers-individual-name')"
                      name="pName"
                      type="text"
                  />
                </div>
              </div>

              <!-- street -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.address' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      :placeholder="$t('form.placeholders.address')"
                      name="street"
                      type="text"
                  />
                </div>
              </div>

              <!-- city & zip -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.city' ) }}
                </label>
                <div class="col-md-5">
                  <CmpBaseInput
                      :placeholder="$t('form.placeholders.city')"
                      name="city"
                      type="text"
                  />
                </div>

                <label class="text-sm-left text-md-right col-md-1 col-form-label">
                  Zip
                </label>
                <div class="col-md-3">
                  <CmpBaseInput
                      :placeholder="$t('form.placeholders.zip')"
                      name="zip"
                      type="number"
                  />
                </div>
              </div>

              <!-- country -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.country' ) }}
                </label>
                <div class="col-md-9">
                  <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                       :options="countries"
                                       :searchable="true"
                                       closeOnSelect
                                       name="countryCode"
                                       class="mb-2"
                                       ref="ref_selectCountry"
                                       v-on:changehapend="h_countryChange"
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

              <!-- state -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.country-state' ) }}
                </label>
                <div class="col-md-9">
                  <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                       :options="ls_states"
                                       :searchable="true"
                                       name="stateCode"
                                       class="mb-2"
                                       closeOnSelect
                                       ref="ref_selectStates"
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

            <div class="col-xm-12 col-md-6">

              <!-- email -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.email' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      :placeholder="$t('form.placeholders.email')"
                      name="email"
                      type="text"
                  />
                </div>
              </div>

              <!-- cell phone -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.cell' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      placeholder="### ## ### ## ##"
                      name="cell"
                      type="number"
                  />
                </div>
              </div>

              <!-- land phone -->
              <div class="row">
                <label class="text-sm-left text-md-right col-md-3 col-form-label">
                  {{ $t( 'form.fields-common.phone' ) }}
                </label>
                <div class="col-md-9">
                  <CmpBaseInput
                      placeholder="### ## ### ## ##"
                      name="phone"
                      type="number"
                  />
                </div>
              </div>

            </div>

            <div class="col-xm-12 col-md-12">

              <!-- notes -->
              <div class="row mt-2 mb-3">
                <label class="text-sm-left text-md-right col-md-2 col-form-label">
                  {{ $t( 'entities.supplier.internal-notes' ) }}
                </label>
                <div class="col-md-10">
                  <CmpTextInput
                      height="150"
                      name="internalNotes"
                      type="text"
                  />
                </div>
              </div>

            </div>

          </div>

        </form>

        <!-- FORM ACTION BUTTONS -->
        <CmpFormActionsButton
            :show-delete="true"
            v-on:saveIntent="h_beforeSubmit"
            v-on:deleteIntent="h_delete"
            v-on:cancelIntent="nav_closeForm"
        />

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { i18n } from '@/services/i18n'
import { useForm } from 'vee-validate'
import useCommon from '@/services/composables/useCommon'
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ADDRESS_TYPE, FMODE, ENTITY_NAMES, OPS_KIND_STR, VSchemaSuppExtInfo } from '@/services/definitions'
import { useToast } from 'vue-toastification'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import { ApiSupplier } from '@/services/api/resources-infraestructure/api-supplier'
import { ApiNomenclaturesMng } from '@/services/api/api-nomenclatures-manager'
import { CmpCard, CmpFormActionsButton, CmpBaseInput, CmpCollapseItem, CmpBaseCheckbox, CmpBaseButton, CmpBaseRadio, CmpVeeCheckbox, CmpTextInput, CmpMultiselectField } from '@/components'

import type { SetupContext } from 'vue'
import type { IDtoSupplier, IMultiselectBasic, ICountryStatesBasic,  } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormSuppliersContactExt',
    props: {
        showing: {
            type: Boolean,
            description: 'Serve as a flag to tell if the form is currently visible',
        },
        index: {
            type: Number,
            default: undefined,
            description: 'A supplier may have a collection of associated contact data. This prop represent the index of this specific [form] data, in that collection.',
        },
        fmode: {
            type: String,
            default: FMODE.CREATE,
            description: 'Mode in which the formulary must operate',

            validator( value: string ): boolean {
                const acceptedValues = [
                    FMODE.EDIT as string,
                    FMODE.CREATE as string,
                    FMODE.EDIT_LOCAL as string
                ]
                return acceptedValues.indexOf(value) !== -1
            }
        },
        parentData: {
            type: Object,
            description: 'Object holding relevant information about the parent Parent data such as "parentId" and "suppCategoryID" ',
        },
        parentId: {
            type: Number,
            default: 0,
            description: 'If apply, this props should tell the identifier of the parent for the extended supplier information',
        },
        extData: {
            type: Object,
            default: undefined,
            description: 'Supplier extended information (data) to be showed in this modal formulary',
        },
        countries: {
            type: Object,
            description: 'Mode in which the formulary must operate',
        },
        hitRemote: {
            type: Boolean,
            default: false,
            description: 'Tells if this component it needs to request the creation and edition operations to the backend server'
        }
    },
    components: {
        CmpCard,
        CmpTextInput,
        CmpBaseRadio,
        CmpBaseInput,
        CmpBaseButton,
        CmpVeeCheckbox,
        CmpCollapseItem,
        CmpBaseCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    emits: [ 'closeForm', 'update', 'delete' ],
    setup(props, ctx: SetupContext) {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global
        const toast = useToast()                                                                // The toast lib interface

        // html references
        const ref_selectStates = ref<InstanceType<typeof CmpMultiselectField>>()                // reference to country province / states select field
        const ref_selectCountry = ref<InstanceType<typeof CmpMultiselectField>>()               // reference to country province / states select field

        const ls_states = ref<IMultiselectBasic[]>([])                                    // countries states / provinces

        // helpers & flags
        const { mkSupplierExt } = useFactory()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { isUndOrEmptyStr } = useCommon()

        // form data
        const addressTypeOptions = [
            {
                value: ADDRESS_TYPE.CONTACT,
                text: t(`entities.address-type.contact`)
            },
            {
                value: ADDRESS_TYPE.DELIVERY,
                text: t(`entities.address-type.delivery`)
            },
            {
                value: ADDRESS_TYPE.INVOICE,
                text: t(`entities.address-type.invoice`)
            },
            {
                value: ADDRESS_TYPE.OTHER,
                text: t(`entities.address-type.other`)
            },
            {
                value: ADDRESS_TYPE.PRIVATE,
                text: t(`entities.address-type.private`)
            }
        ]

        //endregion ===========================================================================

        //region ======= HOOKS ================================================================

        /**
         * Vue hook before component is mounted in the DOM
         * If this view is called as edit mode rather than creation mode, we need to call the backend API
         * asking for the resource so we can populate the datatable
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(async () => {})

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {})

        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        const a_create = ( data: IDtoSupplier, doWeNeedToStay: boolean ) => {
            hpr_sanitize(data)

            // ---- with remote request for edition
            if (props.hitRemote)
                ApiSupplier.reqInsSupplier(data, 'ext')
                .then(( response: any ) => {
                    tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.ADDITION, data.pName)

                    data.id = response.data                                                                             // the just created entity (supplier extended contact information) identifier, are coming in the request response. so we update the object with this data

                    ctx.emit(
                        'update',
                        props.fmode === FMODE.CREATE ? 0 : props.index,                                           // index
                        data
                    )

                    if(!doWeNeedToStay) nav_closeForm()

                })
                .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.ADDITION))

            // ---- with out remote request for edition
            else {
                ctx.emit(
                    'update',
                    props.fmode === FMODE.CREATE ? 0 : props.index,                                               // index
                    data
                )

                if(!doWeNeedToStay) nav_closeForm()
            }
        }

        const a_edit = ( data: IDtoSupplier, doWeNeedToStay: boolean ) => {

            if (props.fmode === FMODE.CREATE) return
            hpr_sanitize(data)

            data.suppCategoryID = (props.parentData as IDtoSupplier).suppCategoryID      // this comes in handy when the parent exist

            // ---- with remote request for edition
            if (props.hitRemote)
                ApiSupplier.reqUpdateSupplier(data, 'ext')
                .then(() => {
                    tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.UPDATE, data.pName)
                    ctx.emit('update', props.index, data)

                    if(!doWeNeedToStay) nav_closeForm()                                  // so we are going back to the data table
                })
                .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.UPDATE))

            // ---- with out remote request for edition
            else
            {
                ctx.emit('update', props.index, data)
                if(!doWeNeedToStay) nav_closeForm()                                     // so we are going back to the data table
            }
        }

        const a_delete = () => {
            ctx.emit('delete', props.index)
            nav_closeForm()
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // getting the vee validate method to manipulate the form related actions from the view

        const { handleSubmit, meta, resetForm, setFieldValue, values } = useForm<IDtoSupplier>({
            validationSchema: VSchemaSuppExtInfo,
            initialValues:    mkSupplierExt(),
            initialErrors:    undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Restoring the country provinces / state selected value
         *
         * @param both Tells if we need to clear both of the locations form multiselect s
         */
        const hpr_clearSelects = ( both: boolean = false ) => {
            ls_states.value = []
            if (!ref_selectStates.value || !ref_selectCountry.value) return

            ref_selectStates.value.clearSelection()
            setFieldValue('stateCode', undefined)

            if (!both) return

            ref_selectCountry.value.clearSelection()
            setFieldValue('countryCode', undefined)
        }

        /**
         * Restoring, cleaning some formulary data, so it will be refreshed and be used again for a new product
         */
        const hpr_clearState = () => {
            hpr_clearSelects(true)
            resetForm( { values: mkSupplierExt(), errors: undefined } )
        }

        const hpr_sanitize = ( supData: IDtoSupplier ) => {

            delete supData.extData
            delete supData.pCount
            delete supData.purchasesCountPend
            delete supData.purchasesCountTotal
            delete supData.purchasesCountValue

            if (isUndOrEmptyStr(supData.cell)) delete supData.cell
            if (isUndOrEmptyStr(supData.phone)) delete supData.phone

            if (props.parentId !==  undefined || props.parentId > 0) supData.parentID = props.parentId
            if (supData.pType !== ADDRESS_TYPE.CONTACT) delete supData.jobPosition                        // contact case
            else {                                                                                        // addresses cases
                delete supData.zip
                delete supData.city
                delete supData.street
                delete supData.stateCode
                delete supData.countryCode
            }

            supData.internalNotes?.trim()
        }

        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * This method tries to accommodate the data before it will be sent to the server
         * Handles the form submission event through the vee-validate 'SubmissionHandler' so we can take advantage of all
         * the its validation logic but using with own logic inserted as callback
         *
         * @param evt
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = (evt: Event, doWeNeedToStay: boolean) => {
            evt.preventDefault()

            // handling the submission with vee-validate method
            handleSubmit(formData => {

                if (props.fmode == FMODE.CREATE || props.fmode == FMODE.EDIT_LOCAL) a_create(formData, doWeNeedToStay)
                if (props.fmode == FMODE.EDIT && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (props.fmode == FMODE.EDIT && !meta.value.dirty) nav_closeForm()                                     // was no changes (no dirty) with the data, so going back normally
            }).call(this)
        }

        const h_delete = async ( evt: any ) => {
            a_delete()
        }

        const h_addressTypeSelection = ( selection: ADDRESS_TYPE ) => {
            setFieldValue( 'pType', selection )
        }

        /**
         * Handles the logic in case MultiSelect Country values changes, including clear or restore
         *
         * @param countryId Identifier of the country we want to look for
         */
        const h_countryChange = async ( countryId: string, ): Promise<void> => {
            if (!countryId) {
                hpr_clearSelects()
                return
            }

            ApiNomenclaturesMng.getCountryStates(countryId)
            .then((response:any) => {

                ls_states.value = response.data.map((stateData: ICountryStatesBasic) => {
                    return { value: stateData.id, label: stateData.sName }
                })

                // ❗❗ it may happen that (in the editions mode) the manually set up procedure (occurring in the watch around line 554)
                // of the ref_selectCountry select, triggers this methods. So if that was the case, it means that we
                // have a formulary value for the state (values.stateCode), so we need to set the in the UI state control, hence this following instructions here
                if (ls_states.value.length > 0 && (props.fmode == FMODE.EDIT_LOCAL || props.fmode == FMODE.EDIT) )
                {
                    const selSOption = ls_states.value.find((option: IMultiselectBasic) => option.value === values.stateCode )                                    // selSOption -> selected state option
                    if (selSOption !== undefined && ref_selectStates.value !== undefined) ref_selectStates.value.setSelectedValue(selSOption)
                }

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STATE, OPS_KIND_STR.REQUEST))
        }

        /**
         * watching for the intent to invoke the formulary in edition mode
         */
        watch(() => [ props.showing ], async () => {

            if ((props.fmode == FMODE.EDIT_LOCAL || props.fmode == FMODE.EDIT) && props.extData !== undefined)
            {
                resetForm({
                    errors: {},
                    values: { ...props.extData as IDtoSupplier }
                })

                if (props.countries === undefined ) return                                                                                                       //  we suppose to have the country list already, remember this is a form intended to be uses as modal
                if (values.countryCode === undefined || values.countryCode == '') return

                // instruction to properly setup the the 'locations' (country & state) UI select controls / components
                const selCOption = props.countries.find((option: IMultiselectBasic) => option.value === values.countryCode )                                    // selCOption -> selected country option
                if (selCOption !== undefined && ref_selectCountry.value !== undefined) ref_selectCountry.value.setSelectedValue(selCOption)
            }
        })

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_closeForm = () => {
            hpr_clearState()
            ctx.emit('closeForm')
        }

        //endregion ===========================================================================

        return {
            values,
            addressTypeOptions,

            ls_states,

            FMODE,
            ADDRESS_TYPE,

            ref_selectStates,
            ref_selectCountry,

            h_delete,
            h_beforeSubmit,
            h_countryChange,
            h_addressTypeSelection,

            nav_closeForm,
        }
    }

})
</script>

<style scoped>
</style>
