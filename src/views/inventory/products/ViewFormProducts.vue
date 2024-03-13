<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- card / form action bar -->
          <!--<template v-if="cpt_fMode === 'edit'" v-slot:card-actionbar>-->
          <template v-if="cpt_fMode === 'edit'" v-slot:card-actionbar>

            <button :title="$t('btn.tip-action-clone', {subject: $t('entities.product.name') } )"
                    style="float: right"
                    class="btn btn-icon btn-default ml-1"
                    :class="!isCloning ? 'btn-default' : 'btn-danger'"
                    @click.prevent="h_formBtnAction_Clone">
              <i class="fa fa-clone"></i>
            </button>

            <button :title="$t('btn.tip-action-update-stock')"
                    style="float: right"
                    class="btn btn-icon btn-default ml-1 mr-1"
                    @click.prevent="h_formBtnAction_UpdateStock">
              <i class="tim-icons icon-molecule-40"></i>
            </button>

            <button :title="$t('btn.tip-action-replenish')"
                    style="float: right"
                    class="btn btn-icon btn-default mr-1"
                    @click.prevent="h_formBtnAction_Replenish">
              <i class="tim-icons icon-refresh-02"></i>
            </button>

          </template>

          <!-- FORM -->
          <form class="form-horizontal">

            <!-- main fields -->
            <div class="row">
              <div class="col-mx-12 col-md-6">

                <!-- name / status -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields.product.name' ) }}
                  </label>
                  <div class="col-md-5">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.product-name')"
                        name="pName"
                        type="text"
                    />
                  </div>

                  <label class="text-sm-left text-md-right col-md-1 col-form-label">
                    {{ $t( 'data.status' ) }}
                  </label>
                  <div class="col-md-2">
                    <CmpVeeCheckbox name="isActive"
                                    :checked="values.isActive"
                                    :labels="[$t('others.available'), $t('others.unavailable')]"
                    />
                  </div>
                </div>

                <!-- category -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'table-headers.category' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.supplier-category').toLowerCase()"
                                         :options="st_nomenclatures.getProdCat4Select"
                                         searchable
                                         name="pCategoryID"
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

                <!-- sell code -->
                <div class="row" v-if="cpt_fMode === 'edit'">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields.product.sell-code' ) }}
                  </label>
                  <div class="col-md-5">
                    <CmpBasicInput
                        disabled
                        placeholder="... NAM.CODE ..."
                        name="sellCode"
                        type="text"
                    />
                  </div>
                </div>

                <!-- notes sell -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields.product.note-sell' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpTextInput
                        height="150"
                        name="noteSell"
                        type="text"
                    />
                  </div>
                </div>

              </div>

              <div class="col-mx-12 col-md-6">
                <div class="row justify-content-center avatar-div-component-holder">

                  <CmpImageInput
                      name="productImg"
                      :avatar-mode="false"
                      :statics="configStatic"
                      :image="values.picPath ?? ''"
                      :max-size="5"
                      v-on:fileSelected="h_imgChange"
                      v-on:removePicture="h_removePicture"

                      v-on:restore="h_restoreForceImgDelOnCmp"
                      :parent-del-intent="forceImgDelOnCmp"
                  />
                </div>

              </div>
            </div>

            <!-- tabs section -->
            <hr class="collapsable-form-section-divisor mt-4">
            <div class="row mt-5">

              <!-- tabs | nav pills -->
              <div class="col-md-2">
                <ul role="tablist" class="nav nav-pills nav-pills-default flex-column">
                  <CmpTab v-for="tab in tabs"
                          :key="tab.title"
                          :title="tab.title"
                          :activeTabId="activeTabId"
                          :tabId="tab.id"
                          @tab-change="h_tabChange"
                  />
                </ul>
              </div>

              <!-- tabs content -->
              <div class="tab-content col-md-10">

                <!-- TAB general / common info  -->
                <CmpTabContent :key="1" :id="tabs[0].title" :activeTabId="activeTabId" :tabId="1">
                  <div class="row">
                    <!-- left col -->
                    <div class="col-mx-12 col-md-6">

                      <!-- can be sold -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.cbe-sold' ) }}
                        </label>
                        <div class="col-md-2">
                          <CmpVeeCheckbox name="canBeSold"
                                          :checked="values.canBeSold"
                                          :labels="[$t('btn.val-yes'), $t('btn.val-no')]"
                                          @chkboxchange="h_changeSoldStatus"
                          />

                        </div>
                      </div>

                      <!-- sell price -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.sell-price' ) }}
                        </label>
                        <div class="col-md-6">
                          <CmpBasicInput
                              aleftIcon="fa fa-usd"
                              placeholder="0.00"
                              name="sellPrice"
                              type="number"
                              :disabled="ls_activateSellPrice"
                          />
                        </div>
                      </div>

                      <!-- sell tax -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.sell-tax' ) }}
                          <CmpTooltip is-form-label-mode :tip="$t('form.fields.product.tool-tips.sell-tax')" />
                        </label>
                        <div class="col-md-6">
                          <CmpBasicInput
                              aleftIcon="fa fa-percent"
                              placeholder="0.00"
                              name="sellTax"
                              type="number"
                          />
                        </div>
                      </div>

                    </div>

                    <!-- right col -->
                    <div class="col-mx-12 col-md-6">

                      <!-- product uom stock / sell -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-4 col-form-label">
                          {{ $t( 'form.fields.product.uom' ) }}
                          <CmpTooltip is-form-label-mode :tip="$t('form.fields.product.tool-tips.uom')" />
                        </label>
                        <div class="col-md-7">
                          <CmpMultiselectField
                              :placeholder="$t('form.placeholders.product-uom').toLowerCase()"
                              :options="st_nomenclatures.getUoM4Select"
                              searchable
                              name="pUoMID"
                              class="mb-2"
                              closeOnSelect
                              ref="ref_selectUoM"
                              v-on:changehapend="h_uomChange"
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

                      <!-- product uom purchase -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-4 col-form-label">
                          {{ $t( 'form.fields.product.uom-purchase' ) }}
                          <CmpTooltip is-form-label-mode :tip="$t('form.fields.product.tool-tips.uom-purchase')" />
                        </label>
                        <div class="col-md-7">
                          <CmpMultiselectField
                              :placeholder="$t('form.placeholders.product-uom').toLowerCase()"
                              :options="ls_filteredUoM"
                              searchable
                              name="pUoMPurchaseID"
                              class="mb-2"
                              closeOnSelect
                              ref="ref_selectUoMPurchase"
                              v-on:changehapend="h_uomPurchaseSelect"
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
                </CmpTabContent>

                <!-- TAB inventory -->
                <CmpTabContent :key="2" :id="tabs[1].title" :activeTabId="activeTabId" :tabId="2">
                  <div class="row">
                    <!-- left col -->
                    <div class="col-mx-12 col-md-6">

                      <!-- track inventory -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.track-inventory' ) }}
                          <CmpTooltip is-form-label-mode :tip="$t('form.fields.product.tool-tips.track-inventory')" />
                        </label>
                        <div class="col-md-9">
                          <CmpVeeCheckbox name="doWeTrackInventory"
                                          :checked="values.doWeTrackInventory"
                                          :labels="[$t('btn.val-yes'), $t('btn.val-no')]"
                          />
                        </div>
                      </div>

                      <!-- notes internal transfer -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.note-transfer' ) }}
                        </label>
                        <div class="col-md-9">
                          <CmpTextInput
                              height="150"
                              name="noteTransfer"
                              type="text"
                          />
                        </div>
                      </div>

                    </div>

                    <!-- right col -->
                    <div class="col-mx-12 col-md-6">

                      <!-- logistics - responsible -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.logistic-responsible' ) }}
                          <CmpTooltip is-form-label-mode
                                      :tip="$t('form.fields.product.tool-tips.logistic-responsible')" />
                        </label>
                        <div class="col-md-6">
                          <CmpMultiselectField :placeholder="$t('form.placeholders.staffs').toLowerCase()"
                                               :options="st_nomenclatures.getStaffs4Select"
                                               searchable
                                               name="lResponsibleID"
                                               class="mb-2"
                                               ref="ref_selectInvResponsible"
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

                      <!-- logistics - weight -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.logistic-weight' ) }}
                        </label>
                        <div class="col-md-6">
                          <CmpBasicInput
                              placeholder="0.00"
                              name="weight"
                              type="number"
                          />
                        </div>
                        <div class="col-md-2" style="padding-left: 0 !important; padding-top: 10px;">
                          Kg
                        </div>
                      </div>

                      <!-- logistics - volume -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.logistic-volume' ) }}
                        </label>
                        <div class="col-md-6">
                          <CmpBasicInput
                              placeholder="0.00"
                              name="volume"
                              type="number"
                          />
                        </div>
                        <div class="col-md-2" style="padding-left: 0 !important; padding-top: 10px;">
                          m³
                        </div>
                      </div>

                      <!-- logistics - preparation manufacturing lead time -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.logistic-prep-manuf' ) }}
                          <CmpTooltip is-form-label-mode :tip="$t('form.fields.product.tool-tips.manuf-prep-l-time')" />
                        </label>
                        <div class="col-md-6">
                          <CmpBasicInput placeholder="0"
                                         name="preDay2Manuf"
                                         type="number"
                          />
                        </div>
                        <div class="col-md-2" style="padding-left: 0 !important; padding-top: 10px;">
                          {{ $t( 'data.days' ) }}
                        </div>
                      </div>

                    </div>
                  </div>
                </CmpTabContent>

                <!-- TAB purchases / suppliers -->
                <CmpTabContent :key="3" :id="tabs[2].title" :activeTabId="activeTabId" :tabId="3">
                  <div class="row">

                    <!-- left col -->
                    <div class="col-mx-12 col-md-6">

                      <!-- can be purchased -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.cbe-purchased' ) }}
                        </label>
                        <div class="col-md-2">
                          <CmpVeeCheckbox name="canBePurchased"
                                          :checked="values.canBePurchased"
                                          :labels="[$t('btn.val-yes'), $t('btn.val-no')]"
                          />
                        </div>
                      </div>

                      <!-- cost -->
                      <!-- TODO the actual business logic for this is still pendant -->
                      <!-- TIP from Odoo In Standard Price & AVCO: value of the product (automatically computed in AVCO).\n        In FIFO: value of the next unit that will leave the stock (automatically computed).\n        Used to value the product when the purchase cost is not known (e.g. inventory adjustment).\n        Used to compute margins on sale orders.-->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.cost' ) }}
                          <CmpTooltip is-form-label-mode tip="todo" />
                        </label>
                        <div class="col-md-5">
                          <CmpBasicInput
                              aleftIcon="fa fa-usd"
                              placeholder="0.00"
                              name="cost"
                              type="number"
                              disabled
                          />
                        </div>
                        <div class="col-md-2" style="padding-left: 0 !important; padding-top: 10px;">
                          por {{ ls_uomChosenLabel ?? $t( 'entities.uom.default' ) }}
                        </div>
                      </div>

                    </div>

                    <!-- right col -->
                    <div class="col-mx-12 col-md-6">

                      <!-- notes purchase -->
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'form.fields.product.note-purchase' ) }}
                        </label>
                        <div class="col-md-9">
                          <CmpTextInput
                              height="60"
                              name="notePurchase"
                              type="text"
                          />
                        </div>
                      </div>

                    </div>

                  </div>

                  <!-- product - supplier relationship -->
                  <div class="row mr-1 ml-1" style="justify-content: center">
                    <CmpDataTable table-type="hover"
                                  :action-bar-mode="abar_mode"
                                  :action-btn-mode="abutton_mode"

                                  :columns="columns"
                                  :data="values.supplierLines"

                                  :has-search="false"
                                  :has-actions="true"
                                  :has-top-btn-bar="true"
                                  :has-pagination="false"
                                  :has-page-size-selector="false"

                                  @deleteIntent="h_intentRowDelete"
                                  @navCreateIntent="h_intentSuppLineCreate"
                                  @cellUpdateIntent="h_updateCell"

                                  @enableIntent="h_intentToggleEnable"
                                  @disableIntent="h_intentToggleDisable"
                    >
                    </CmpDataTable>
                  </div>

                </CmpTabContent>

                <!-- TAB data an statistics -->
                <CmpTabContent :key="4" :id="tabs[3].title" :activeTabId="activeTabId" :tabId="4">
                  <div class="row">
                    <div class="col-lg-3 col-md-12" v-for="(card, i) in statsDataCards" :key="card.id">
                      <CmpCardStats :title="card.title"
                                    :subTitle="card.subTitle"
                                    :type="card.type"
                                    :icon="card.icon"
                                    :with-restore="card.id === 3 || card.id === 4"
                                    v-on:doRestore="card.id === 3 || card.id === 4 ? h_staticsRestore(card.id) : undefined">

                        <template v-slot:footer>

                          <!-- jump cases -->
                          <div v-if="card.id === 1 || card.id === 2 || card.id === 5 || card.id === 6">
                            <a href="#" @click.prevent="h_statGoCheck(card.id)">

                              <i class="tim-icons icon-zoom-split"></i>
                              {{ $t( 'form.fields-common.view-check' ) }}
                            </a>
                          </div>

                          <!-- change params cases -->
                          <div v-else-if="card.id === 3 || card.id === 4">
                            <a href="#" @click.prevent="h_changeStatsParams(card.id, 'pm')">
                              <i class="tim-icons icon-calendar-60"></i>
                              {{ $t( 'form.fields-common.month-pass-min' ) }}
                            </a>

                            <a href="#" @click.prevent="h_changeStatsParams(card.id, 'py')" class="ml-3">
                              <i class="tim-icons icon-chart-bar-32"></i>
                              {{ $t( 'form.fields-common.year-pass-min' ) }}
                            </a>

                            <a href="#" @click.prevent="h_changeStatsParams(card.id, 'cy')" class="ml-3">
                              <i class="tim-icons icon-chart-bar-32"></i>
                              {{ $t( 'form.fields-common.year-current-min' ) }}
                            </a>
                          </div>

                        </template>
                      </CmpCardStats>
                    </div>
                  </div>
                </CmpTabContent>

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
import appConfig from '@/configs/app.conf'
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useForm } from 'vee-validate'
import { i18n } from '@/services/i18n'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import {
    ACTION_KIND_STR,
    DIALOG_ICON,
    DT_ACTION_BUTTON_MODE,
    DT_ACTIONBAR_MODE,
    ENTITY_NAMES,
    FMODE,
    HProductSupplierLine,
    KEYS,
    OPS_KIND_STR,
    RoutePathNames, VSchemaProduct
} from '@/services/definitions'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton, CmpVeeCheckbox, CmpMultiselectField, CmpTabContent, CmpTab, CmpTooltip, CmpTextInput, CmpImageInput, CmpCardStats, CmpDataTable } from '@/components'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import useNumeric from '@/services/composables/useNumeric'
import { ApiProduct } from '@/services/api/inventory/api-product'
import { useSt_Nomenclatures } from '@/stores/nomenc'

import type { ComputedRef } from 'vue'
import type { IColumnHeader, IDtoProduct, TFormMode, IMultiselectBasic, ICellUpdate, IDtoProductSupplierL } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormProducts',
    components: {
        CmpTab,
        CmpCard,
        CmpTooltip,
        CmpCardStats,
        CmpTextInput,
        CmpDataTable,
        CmpBasicInput,
        CmpBaseButton,
        CmpTabContent,
        CmpImageInput,
        CmpVeeCheckbox,
        CmpCollapseItem,
        CmpBasicCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                                  // SUPPLIERS datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JDEL                     // SUPPLIERS datatable rows buttons mode
        const columns = ref<Partial<IColumnHeader>[]>(HProductSupplierLine)                        // SUPPLIERS customized datatable header

        const toast = useToast()                                                                   // The toast lib interface
        const route = useRoute()
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                                             // Pinia store for nomenclatures// pinia instance of pagination store | check the text on --> https://pinia.vuejs.org/cookbook/composing-stores.html#nested-stores

        const { fmode, id } = route.params                                                         // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        const { mkProduct, mkProductSupplierLine } = useFactory()
        const { tfyCRUDSuccess, tfyCRUDFail, tfyBasicRqError } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()
        const { valUI2Raw, toUIMoney } = useNumeric()

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, setValues, setFieldValue, resetForm, values } = useForm<IDtoProduct>({
            // validationSchema: fmode === FMODE.CREATE as TFormMode ? VSchemaStaffCreate : VSchemaStaffEdit,
            validationSchema: VSchemaProduct,
            initialValues:    mkProduct(),
            initialErrors:    undefined
        })

        // html references
        const ref_selectUoM = ref<InstanceType<typeof CmpMultiselectField>>()
        const ref_selectUoMPurchase = ref<InstanceType<typeof CmpMultiselectField>>()
        const ref_selectInvResponsible = ref<InstanceType<typeof CmpMultiselectField>>()

        // helpers & flags
        const isCloning = ref(false)                                                        // tells is we are in a cloning process so we call the creat endpoint instead the edition endpoint
        const ls_isSuppliersRequested = ref<boolean>(false)                                 // flag var to know if we already requested the suppliers
        /**
         * An ID counter auxiliary var for the ProductSupplier Line rows of the table when the creation mode is on. We need that the UoM rows has it own temporal identifier for proper data update when child component emit cell update intents
         * ❗ An important thing, we use negative values so we can diferenciate this from the existing UoM in edition mode
         */
        const auxIdCounter = ref<number>(-1)

        // form data
        const activeTabId = ref<number>(1)
        const forceImgDelOnCmp = ref<Boolean>(false)                                        // so we can tell to the image component 'CmpImageInput' to remove the image if we need to
        const ls_activateSellPrice = ref<boolean>(!values.canBeSold)
        const ls_uomChosenLabel = ref<string | undefined>(undefined)                        // string label located in the buying section, to show the selected UoM that will be used in purchase ops
        const ls_filteredUoM = ref<IMultiselectBasic[]>([])
        const tabs = [                                                                            // form tabs data array
            { id: 1, title: t('data.overview') },
            { id: 2, title: t('table-headers.inventory') },
            { id: 3, title: t('form.fields.suppliers.tab-purchases') },
            { id: 4, title: t('data.data') }
        ]
        const statsDataCards = reactive([                                                    // form supplier statistics data / information
            {
                id:       1,
                title:    !ls_uomChosenLabel.value
                                  ? `${ values.pTotalStock?.toString() } ${ t('entities.uom.default') }`
                                  : `${ values.pTotalStock?.toString() } ${ ls_uomChosenLabel.value }`,
                subTitle: t('form.fields.product.stats-stock-ready'),
                type:     values.pTotalStock ?? 0 <= 0 ? 'danger' : 'info',
                icon:     'tim-icons icon-components'
                // footer:   `<i class="tim-icons icon-zoom-split"></i></i> Update Now`
            },
            {
                id:       2,
                title:    `$ ${ values.pTotalStockValue }`,
                subTitle: t('form.fields.product.stats-stock-value'),
                type:     values.pTotalStockValue ?? 0 <= 0 ? 'danger' : 'info',
                icon:     'tim-icons icon-coins'
            },
            {
                id:       3,
                title:    values.pTotalSalesCountInMonth?.toString(),
                subTitle: t('form.fields.product.stats-total-sales-month'),
                type:     values.pTotalSalesCountInMonth ?? 0 <= 0 ? 'warning' : 'info',
                icon:     'tim-icons icon-cart'
            },
            {
                id:       4,
                title:    `$ ${ values.pTotalSalesValueInMonth }`,
                subTitle: t('form.fields.product.stats-values-sales-month'),
                type:     values.pTotalSalesValueInMonth ?? 0 <= 0 ? 'warning' : 'success',
                icon:     'tim-icons icon-money-coins'
            },
            {
                id:       5,
                title:    !ls_uomChosenLabel.value
                                  ? `${ values.pTotalPurchasesIn3Month?.toString() } ${ t('entities.uom.default') }`
                                  : `${ values.pTotalPurchasesIn3Month?.toString() } ${ ls_uomChosenLabel.value }`,
                subTitle: t('form.fields.product.stats-total-uom-purchase-3-mont'),
                type:     'info',
                icon:     'fa fa-codepen'
            },
            {
                id:       6,
                title:    values.pCountBoMRecipes?.toString(),
                subTitle: t('form.fields.product.stats-count-bom'),
                type:     'info',
                icon:     'fa fa-sticky-note-o'
            }
        ])
        let formDataFromServer: IDtoProduct | undefined = undefined                               // aux variable to save entity data requested from the server

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

            // requesting needed data
            st_nomenclatures.reqNmcSuppliers()
            .then(() => {
                columns.value[ 1 ].cellEditableSelectOptions = st_nomenclatures.getSupplier4Select
                // the 1st column is the 'supplier' / 'supplierId' column. In this datatable this is a (column) 'editable cell' select
                // So, rather define the 'select options' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.REQUEST))

            st_nomenclatures.reqNmcCurrency()
            .then(() => {
                columns.value[ 5 ].cellEditableSelectOptions = st_nomenclatures.getCurrencies4Select
                // the 4th column is the 'currency' column. In this datatable this is a (column) 'editable cell' select
                // So, rather define the 'select options' filter data statically in the
                // data-datable.ts file, we weed to do it dynamically. Hence this here and no the conventionally
                // definition in data-datable.ts.
            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.CURRENCY, OPS_KIND_STR.REQUEST))

            await st_nomenclatures.reqNmcStaff()                                                                                // getting the staff list that will be used in the responsible select input
            await st_nomenclatures.reqNmcUoM()                                                                                  // getting the UoM list that will be used in both pUoMID and pUoMPurchaseID UoM selection component, recall that the pUoMPurchaseID must be filtered with the same UoM category of pUoMID
            ls_filteredUoM.value = st_nomenclatures.getUoM4Select

            // ---- create mode ----

            // ---- edition mode ----
            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                formDataFromServer = await ApiProduct.getProductById(+id)

                // we need to sync / update some local vars coming from server so
                ls_activateSellPrice.value = !formDataFromServer.canBeSold                // this here is a hack, when we are in edition mode, we need to update the ls_activateSellPrice var, so the sell price input status can render accordingly

                statsDataCards[0].title = st_nomenclatures.getUoMByIdMap[+formDataFromServer.pUoMID].uName                  // updating stock info card
                statsDataCards[4].title = st_nomenclatures.getUoMByIdMap[formDataFromServer.pUoMPurchaseID].uName           // updating purchase info card
                ls_uomChosenLabel.value = st_nomenclatures.getUoMByIdMap[formDataFromServer.pUoMPurchaseID].uName           // updating purchase label in purchase tab

                resetForm({
                    errors: {},
                    values: { ...formDataFromServer }
                })
            }
            window.addEventListener('keydown', h_keyboardKeyPress)                              // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })
        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Api action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newProduct payload with the data for the request
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newProduct: IDtoProduct, doWeNeedToStay: boolean ) => {

            hpr_sanitation(newProduct)                                                      // sanitation

            // now we can actually call for the product insertion
            ApiProduct.reqIns(newProduct).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.PRODUCT, OPS_KIND_STR.ADDITION, newProduct.pName)

                // so now what ?
                if (!doWeNeedToStay) nav_back()                                               // so we are going back to the data table
                else hpr_clearState()                                                         // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.ADDITION))
        }

        /**
         * Api action for the updating (request) the existing entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param editedProduct
         * @param doWeNeedToStay
         */
        const a_edit = ( editedProduct: IDtoProduct, doWeNeedToStay: boolean ) => {
            hpr_sanitation(editedProduct)

            ApiProduct.update(editedProduct).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.PRODUCT, OPS_KIND_STR.UPDATE, editedProduct.pName)

                // so now what ?
                if (!doWeNeedToStay) nav_back()                                               // so we are going back to the data table
                else hpr_clearStateE()
            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.UPDATE))
        }

        /**
         * Request the deletion of a product
         * @param prodId product identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_delete = async (prodId: number, ref: undefined | string = undefined ): Promise<void> => {
            ApiProduct.reqDeleteProducts([prodId])
            .then(( response: any ) => {
                tfyCRUDSuccess(ENTITY_NAMES.PRODUCT, OPS_KIND_STR.DELETION, ref)
                nav_back()
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.PRODUCT, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Restoring the uom purchase selected value
         */
        const hpr_clearUoMPurchaseSelect = () => {
            if (!ref_selectUoMPurchase.value) return

            //@ts-ignore
            ref_selectUoMPurchase.value.clearSelection()
            ls_filteredUoM.value = st_nomenclatures.getUoM4Select
        }

        /**
         * Update the collection of the SupplierLine object (IDtoProductSupplierL) from the initial
         * then sync the same SupplierLine collection with the actual current form data managed by vee-validate lib
         *
         * ❗ PSL == product supplier line
         *
         * @param data ProductSupplier line data to be updated in the collection
         */
        const hpr_updatePSLInList = ( data: ICellUpdate ) => {
            if(!values.supplierLines) return

            // ---- business logic validation -----

            // ---- update suppliers list logic -----
            setFieldValue('supplierLines', values.supplierLines?.map(( row: IDtoProductSupplierL ) => {
                if (row.id === data.entityId)
                    row[ data.entityField as keyof IDtoProductSupplierL ] = data.updatedValue as never

                return row
            }))
        }

        /**
         * Restoring, cleaning some formulary data, so it will be refreshed and be used again for a new product
         */
        const hpr_clearState = () => {
            ls_activateSellPrice.value = true

            // cleaning the for through vee-validate lib
            resetForm({ values: mkProduct(), errors: undefined })

            // clearing suppliers
            setFieldValue('supplierLines', [])
            setFieldValue('suppLinesToDelete', [])

            // clearing selects
            ref_selectUoM.value?.clearSelection()
            ref_selectUoMPurchase.value?.clearSelection()
            ref_selectInvResponsible.value?.clearSelection()

            // clearing the selected image
            h_removePicture(true)
        }

        /**
         * Restoring, cleaning some formulary data for the **EDITION** mode when **applied** button was used, so almost the
         * entire formulary data should remain
         */
        const hpr_clearStateE = () => {
            setFieldValue('suppLinesToDelete', [])
        }

        /**
         * Form data sanitation method so we can clean the fields values before submitting
         */
        const hpr_sanitation = (dirtyProduct: IDtoProduct) => {
            dirtyProduct.sellPrice = valUI2Raw(dirtyProduct.sellPrice)                                    // converting the price to 100K scale using in the backend

            if (!dirtyProduct.cost) dirtyProduct.cost = 0
            if (!dirtyProduct.sellTax) dirtyProduct.sellTax = 0
            if (!dirtyProduct.volume) delete dirtyProduct.volume
            if (!dirtyProduct.weight) delete dirtyProduct.weight
            if (!dirtyProduct.preDay2Manuf) delete dirtyProduct.preDay2Manuf
            if (!dirtyProduct.lResponsibleID || dirtyProduct.lResponsibleID === 0) delete dirtyProduct.lResponsibleID

            if (!dirtyProduct.notePurchase) delete dirtyProduct.notePurchase
            if (!dirtyProduct.noteSell) delete dirtyProduct.noteSell
            if (!dirtyProduct.noteTransfer) delete dirtyProduct.noteTransfer

            // this is the creation, so is not for sale, then sellPrice not make any sense
            if(!dirtyProduct.canBeSold) delete dirtyProduct.sellPrice

            // suppliers sanitation
            if(cpt_fMode.value === FMODE.CREATE) delete dirtyProduct.suppLinesToDelete
            if (!dirtyProduct.supplierLines || dirtyProduct.supplierLines.length == 0) delete dirtyProduct.supplierLines
            else dirtyProduct.supplierLines = dirtyProduct.supplierLines.map(( supplier: IDtoProductSupplierL ) => {

                // sanitation
                supplier.sPrice = valUI2Raw(supplier.sPrice)                                    // price sanitation & conversion (remember the scale)

                if(cpt_fMode.value === FMODE.CREATE) delete supplier.sku                        // this value will be generate in the backend, it make no sense send it from here on creation
                delete supplier.id                                                              // only relevant in the front, it will not be needed in the backend

                if (supplier.supplierId)                                                        // seeking for the name of the supplier
                    supplier.sName = st_nomenclatures.getSuppByMapId[ supplier.supplierId ].sName

                // returning modifier supplier
                return supplier
            })

            // some data no need to be sent, e.g backend computed values
            delete dirtyProduct.pTotalStock
            delete dirtyProduct.pTotalStockValue
            delete dirtyProduct.pTotalSalesCountInMonth
            delete dirtyProduct.pTotalSalesValueInMonth
            delete dirtyProduct.pTotalPurchasesIn3Month
            delete dirtyProduct.pCountBoMRecipes

            if(cpt_fMode.value === FMODE.CREATE) delete dirtyProduct.picPath
            if(cpt_fMode.value === FMODE.EDIT && !dirtyProduct.picPath) delete dirtyProduct.picPath
            if(!dirtyProduct.productImg) delete dirtyProduct.productImg
            delete dirtyProduct.sellCode

            return dirtyProduct
        }

        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * Handling the change in the main UoM selector. The goal here is to ensure the main UoM selector and the
         * purchase UoM are in the same UoM category group
         *
         * @param uomId UoM identifier of the selected option in the main UoM selector
         */
        const h_uomChange = ( uomId: string ): void => {
            if (!uomId) {
                hpr_clearUoMPurchaseSelect()
                return
            }

            // so the main uom selected value was change,
            const u = st_nomenclatures.getUoMByIdMap[+uomId]
            if (!u) return

            if (ref_selectUoMPurchase.value) {                                                                      // making sure the reference value (purchase uom multiselect) exist
                ref_selectUoMPurchase.value.setSelectedValue({ value: u.id, label: u.uName } as IMultiselectBasic)
            }

            // so in the purchase uom select we need to filter the available options to only the uom of the same group / category
            ls_filteredUoM.value = st_nomenclatures.uom.filter(uom => uom.ucName == u?.ucName).map((fUom) => {      // filtering
                return { value: fUom.id, label: fUom.uName }
            })

            // another thing we need to do is to update de info card about stock units so
            statsDataCards[0].title = u.uName
        }

        /**
         * This is just for update the value of the product purchase unit.
         * We take advantage of this method for saving the selected value that will be used on cost (field) input in the inventory section
         *
         * @param uomId
         */
        const h_uomPurchaseSelect  = ( uomId: string ): void => {
            const u = st_nomenclatures.getUoMByIdMap[+uomId]                    // seeking
            if (!u) return

            // updating dependencies
            ls_uomChosenLabel.value = u.uName                                   // purchase uom label
            statsDataCards[4].title = u.uName                                   // purchase information card
        }

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

            // ---- validations starts ----
            // This entire logic block here validate 2 things
            // 1 Ensure that all the rows have a selected supplier
            // 2 Ensure that we don't have different associations (rows) with the same suppliers (supplier id) and the same price
            if(values.supplierLines && values.supplierLines.length >= 2)
            {
                for (let i = 0; i < values.supplierLines.length; i++)
                {
                    // we can't allow, we need to ensure a supplier selection for each product supplier association
                    // @ts-ignore
                    if (values.supplierLines[i].supplierId <= 0)
                    {
                        dfyShowAlert(t('dialogs.title-alert-not-allowed'), t('dialogs.product-supp-assoc-most-select'), DIALOG_ICON.E)
                        return
                    }

                    // seeking if we have different associations (rows) with the same suppliers (supplier id) and the same price
                    for (let j = i+1; j < values.supplierLines.length ; j++)
                        if(values.supplierLines[i].supplierId == values.supplierLines[j].supplierId && values.supplierLines[i].sPrice == values.supplierLines[j].sPrice) {
                            dfyShowAlert(t('dialogs.title-alert-not-allowed'), t('dialogs.product-invalid-supp-assoc'), DIALOG_ICON.E)
                            return
                        }
                }
            // @ts-ignore
            } else if (values.supplierLines && values.supplierLines.length == 1 ) {               // if we have just one supplier and it supplierId is lesser than or equal 0, we can't allow, we need to ensure a supplier selection
                if(values.supplierLines[0].supplierId <= 0) {
                    dfyShowAlert(t('dialogs.title-alert-not-allowed'), t('dialogs.product-supp-assoc-most-select'), DIALOG_ICON.E)
                    return
                }
            }
            // ---- validations ends ----

            // so far so good ?, then we are going to submit the data
            // handling the submission with vee-validate method
            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && isCloning.value && meta.value.dirty) console.log('pending cloning mode')      // TODO pending cloning mode
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !isCloning.value && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()
            }).call(this)
        }

        /**
         * Handler of the 'delete' button
         * @param evt
         */
        const h_delete = async ( evt: any ) => {
            if (cpt_fMode.value !== FMODE.EDIT as TFormMode) return

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.PRODUCT, values.pName, t('dialogs.prod-remove-warning'))
            if(wasConfirmed) await a_delete(values.id, values.pName)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        /**
         * Update the Stock (quantity) of the product
         */
        const h_formBtnAction_UpdateStock = () => {
            // TODO this is no done yet
            console.error('implement this')
        }

        /**
         * Replenish the product
         * ❗❗ [from odoo] Use this assistant to replenish your stock. Depending on your product configuration, launching a replenishment may trigger a request for quotation, a manufacturing order or a transfer.
         */
        const h_formBtnAction_Replenish = () => {
            // TODO this is no done yet
            console.error('implement this')
        }

        /**
         * Clone the (cloneable, 'cause some field must be unique) form data to prepare the form to insert a new supplier
         * instead of edit a existing one
         */
        const h_formBtnAction_Clone = () => {
            // TODO this is no done yet
            // disabling the clone, so we need to restore
            if (isCloning.value == true) {
                isCloning.value = false

                // restoring the form with the original data
                /*resetForm({
                    errors: {},
                    values: { ...formDataFromServer ?? mkSupplier() }
                })*/

                return
            }

            // enabling the clone, so we need to clone

            // -- resetting the identity identifier
            setFieldValue('id', 0)
            isCloning.value = true

            // -- resetting the fields that must be uniques
            // ..
        }

        const h_tabChange = ( tabId: number ) => activeTabId.value = tabId

        // TIP ❗❗ perhaps we can replace this with the v-model way (two-way data binding) as you do with the other inputs. If so I think we don't need the others image method around this
        const h_imgChange = (f: any) => setFieldValue('productImg', f)

        /**
         * Tries to restore the control variable to the original state.
         *
         * If CmpImageInput deleted the image 'cause this component tells, CmpImageInput will let this components knows,
         * and this method handles it
         */
        const h_restoreForceImgDelOnCmp = () => forceImgDelOnCmp.value = false

        /**
         * Handles the image deletion logic
         *
         * @param forceIt tell to this logic, if we need to force the image deletion no matter what
         */
        const h_removePicture = (forceIt = false) => {

            if (!forceIt) {
                if(formDataFromServer?.picPath === undefined || formDataFromServer?.picPath === '') return              // if there is NO data on server, we do nothing
                dfyShowAlert(t('dialogs.title-alert'), t('dialogs.img-rm-alert'))                              // if there is data (product picture in this particular case) we need to alert the user the image will be completely deleted on server if the user click apply or save btns
            }
            else forceImgDelOnCmp.value = true                                                                          // this line will tell to the 'CmpImageInput' that we want to delete de image

            // actual removing the image
            setFieldValue('productImg', undefined)
            setFieldValue('picPath', undefined)
        }

        /**
         * Go to an entity list (depends on the statistics card of the event) filtered by the current supplier
         * @param cardId card identifier
         */
        const h_statGoCheck = ( cardId: number ) => {
            // TODO implement this
            console.error('Not implemented', 'go check card' + cardId + ' filtered by suppliers')
        }

        /**
         * This will try to request the same statistics to the server but with different
         * params
         *
         * @param cardId card identifier
         * @param param
         */
        const h_changeStatsParams = ( cardId: number, param: string ): void => {
            // TODO implement this

            // meaning:
            // pm = past month | py = past year | cy = current year

            switch (param) {
                case 'pm':
                    console.error('implement _h_changeStatsParams_', cardId, param)
                    break
                case 'py':
                    console.error('implement _h_changeStatsParams_', cardId, param)
                    break
                case 'cy':
                    console.error('implement _h_changeStatsParams_', cardId, param)
                    break
            }
        }

        /**
         * Restore a modified statistics card
         *
         * @param carId card identifier
         */
        const h_staticsRestore = ( carId: number ): void => {
            // TODO implement this

            console.error('Not implemented', carId)
        }

        /**
         * Locally, add a empty ProductSupplierLine row in the collection so the UI can react / reflect the changes.
         * This method allows to add new SupplierLine to the Product entity being created / edited in the form
         */
        const h_intentSuppLineCreate = async () => {
            if(!values.supplierLines) return

            values.supplierLines.push(mkProductSupplierLine(auxIdCounter.value))
            auxIdCounter.value -= 1
        }

        /**
         * Tries to toggle the 'isActive' status in a ProductSupplier Line object present in the Product
         * (IDtoProductSupplierL) collection object
         *
         * @param id ProductSupplier Line identifier.
         */
        const h_intentToggleEnable = (id: number) => {
            hpr_updatePSLInList({ entityId: id, entityField: 'isActive', updatedValue: true })
        }

        const h_intentToggleDisable = (id: number) => {
            hpr_updatePSLInList({ entityId: id, entityField: 'isActive', updatedValue: false })
        }

        const h_intentRowDelete = ( rowId: number ) => {
            if(!values.supplierLines) return

            setFieldValue('supplierLines', values.supplierLines.filter((suppRow) => {

                if(suppRow.id !== rowId) return suppRow
                if(suppRow.id === rowId && cpt_fMode.value === FMODE.EDIT)
                    values.suppLinesToDelete?.push(suppRow.supplierId)

                // this las condition tries to handle the situation of the edit form mode, that we need to record a UoM
                // that already exist in the database and the user want to deleted. So we write down the 'ProductSupplierL' identifier
            }))
        }

        /**
         * Its jobs its to maintain sync the user changes in the table of ProductSupplierLine an the local store data of Product
         * @param data: data to be updated
         */
        const h_updateCell = (data: ICellUpdate) => {
            hpr_updatePSLInList(data)
        }

        /**
         * Handle the intent to change the 'canBeSoldStatus' field, so we can hide the 'sellPrice' input we it is not needed
         */
        const h_changeSoldStatus = () => {
            ls_activateSellPrice.value = !ls_activateSellPrice.value
        }

        watch(activeTabId, async () => {

            if(ls_isSuppliersRequested.value) return                                                                // breaking the habit | if we already requested we have our job done

            if(activeTabId.value == 3 && cpt_fMode.value === FMODE.EDIT) {                                          // we are looking for the 'purchase' tab so we can pull the product providers from server
                let result = await ApiProduct.reqProductSuppliers(+id).catch(err => tfyBasicRqError(err))           // requesting needed data

                //@ts-ignore
                setFieldValue('supplierLines', result.data.map(supplierLine => {                              // mapping / normalizing the data to be rendered properly in the table
                    supplierLine.id = auxIdCounter.value                                                            // setting up the local row identifier for each, so we can identify each other when an action take place
                    auxIdCounter.value -= 1

                    if (!supplierLine.supplierCode) supplierLine.supplierCode = ''                                  // setting up the field, so table can render it. This is 'cause it may be null

                    supplierLine.sPrice = toUIMoney(+supplierLine.sPrice)                                           // transform the raw currency value (recall the scale) into UI value

                    return supplierLine
                }))

                ls_isSuppliersRequested.value = true
            }
        })

        //#endregion ==========================================================================

        //region ======== NAVIGATION ==========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.product });
        }

        //endregion ===========================================================================

        return {
            values,
            isCloning,

            columns,
            abar_mode,
            abutton_mode,

            tabs,

            activeTabId,
            statsDataCards,
            ls_filteredUoM,
            forceImgDelOnCmp,
            ls_uomChosenLabel,
            ls_activateSellPrice,

            ref_selectUoM,
            ref_selectUoMPurchase,
            ref_selectInvResponsible,

            cpt_fMode,
            st_nomenclatures,

            nav_back,
            h_delete,
            h_uomChange,
            h_tabChange,
            h_statGoCheck,
            h_beforeSubmit,
            h_staticsRestore,
            h_keyboardKeyPress,
            h_changeSoldStatus,
            h_uomPurchaseSelect,
            h_changeStatsParams,

            h_restoreForceImgDelOnCmp,

            h_imgChange,
            h_removePicture,

            h_formBtnAction_Clone,
            h_formBtnAction_Replenish,
            h_formBtnAction_UpdateStock,

            h_updateCell,
            h_intentRowDelete,
            h_intentSuppLineCreate,

            h_intentToggleEnable,
            h_intentToggleDisable,

            configStatic: appConfig.server.statics
        }
    }
})
</script>

<style scoped>
</style>
