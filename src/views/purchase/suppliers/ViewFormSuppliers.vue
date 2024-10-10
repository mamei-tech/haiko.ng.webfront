<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back"
                 :title=" isCloning ? $t('form.fields-common.cloning-state') : undefined">

          <!-- card / form action bar -->
          <template v-if="cpt_fMode === 'edit'" v-slot:card-actionbar>
            <button :title="$t('btn.tip-action-clone', {subject: $t('entities.supplier.name') } )"
                    style="float: right"
                    class="btn btn-icon btn-default ml-1"
                    :class="!isCloning ? 'btn-default' : 'btn-danger'"
                    @click.prevent="h_formBtnAction_Clone">
              <i class="fa fa-clone"></i>
            </button>

            <button :title="$t('btn.tip-action-gen-vcard-qr')"
                    style="float: right"
                    class="btn btn-icon btn-default ml-1 mr-1"
                    @click.prevent="h_formBtnAction_QR">
              <i class="fa fa-qrcode"></i>
            </button>

            <button :title="$t('btn.tip-action-gen-vcard-file')"
                    style="float: right"
                    class="btn btn-icon btn-default mr-1"
                    @click.prevent="h_formBtnAction_DownloadVCard">
              <i class="fa fa-download"></i>
            </button>
          </template>

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

              <div class="col-xm-12 col-md-6">

                <!-- isActive / customer or company -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'data.status' ) }}
                  </label>
                  <div class="col-md-3">
                    <CmpVeeCheckbox name="isActive"
                                    :checked="values.isActive"
                                    :labels="[$t('others.available'), $t('others.unavailable')]"
                    />
                  </div>

                  <label class="text-sm-left text-md-right col-md-2 col-form-label">
                    {{ $t( 'entities.supplier.isCompany' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpVeeCheckbox name="isCompany"
                                    :checked="values.isCompany"
                                    :labels="[$t('data.company'), $t('data.individual')]"
                    />
                  </div>
                </div>

                <!-- [ supplier | contact | company ] name -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.firstname' ) }}
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
                <div class="row" v-if="!isExtContactInfo">
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
                <div class="row" v-if="!isExtContactInfo">
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

                <!-- country & state -->
                <!-- in edition mode we need to ensure that we have the data of all option for the select before render it, so the Multiselect render the entity selected option properly -->
                <!-- to assist this logic and make it more simple, make the fetch of the data before calling the router for rendering this entire view. CHECK h_navEditSuppIntent in ViewFormSuppliers.vue file -->
                <div class="row" v-if="(cpt_fMode === 'edit' && values.countryCode !== undefined) && !isExtContactInfo">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.country' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getCountry4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="countryCode"
                                         class="mb-2"
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

                  <label class="text-sm-left text-md-right col-md-1 col-form-label">
                    {{ $t( 'form.fields-common.country-state' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getCountryStates4Select"
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
                <!-- normal mode (form crete mode) -->
                <div class="row" v-else-if="!isExtContactInfo">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.country' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getCountry4Select"
                                         :searchable="true"
                                         closeOnSelect
                                         name="countryCode"
                                         class="mb-2"
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

                  <label class="text-sm-left text-md-right col-md-1 col-form-label">
                    {{ $t( 'form.fields-common.country-state' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                         :options="st_nomenclatures.getCountryStates4Select"
                                         :searchable="true"
                                         name="stateCode"
                                         class="mb-2"
                                         closeOnSelect
                                         ref="ref_selectStates">

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

                <!-- company -->
                <div v-show="values.isCompany === false" class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'data.company' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField
                        :disabled="isExtContactInfo"
                        :placeholder="$t('form.placeholders.select').toLowerCase()"
                        :options="st_nomenclatures.getCompanies4Select"
                        name="parentID"
                        class="mb-2"
                        closeOnSelect>

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

                <!-- land phone & cell phone -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.cell' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpBaseInput
                        placeholder="### ## ### ## ##"
                        name="cell"
                        type="number"
                    />
                  </div>

                  <label class="text-sm-left text-md-right col-md-1 col-form-label" v-if="!isExtContactInfo">
                    {{ $t( 'form.fields-common.phone' ) }}
                  </label>
                  <div class="col-md-4" v-if="!isExtContactInfo">
                    <CmpBaseInput
                        placeholder="### ## ### ## ##"
                        name="phone"
                        type="number"
                    />
                  </div>
                </div>

                <!-- email & website -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.email' ) }}
                  </label>
                  <div class="col-md-4">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.email')"
                        name="email"
                        type="text"
                    />
                  </div>

                  <label class="text-sm-left text-md-right col-md-1 col-form-label" v-if="!isExtContactInfo">
                    {{ $t( 'form.fields-common.website' ) }}
                  </label>
                  <div class="col-md-4" v-if="!isExtContactInfo">
                    <CmpBaseInput
                        :placeholder="$t('form.placeholders.website')"
                        name="website"
                        type="text"
                    />
                  </div>
                </div>

                <!-- category -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'table-headers.category' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField
                        :disabled="isExtContactInfo"
                        :placeholder="$t('form.placeholders.supplier-category').toLowerCase()"
                        :options="st_nomenclatures.getSuppCat4Select"
                        name="suppCategoryID"
                        class="mb-2"
                        closeOnSelect>

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

            <!-- tabs form section -->
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
                <template v-for="tab in tabs" :key="'tc'+tab.title">

                  <CmpTabContent :tabId="tab.id" :id="tab.title" :activeTabId="activeTabId">

                    <!-- TAB data statistics -->
                    <template v-if="tab.id === 1">
                      <div class="row">

                        <!--<div class="col-lg-3 col-md-6" v-for="info in statsDataCards" :key="info.title">-->
                        <!--    <CmpCardStats :title="info.title.toString()"-->
                        <!--                  :subTitle="info.subTitle"-->
                        <!--                  :type="info.type"-->
                        <!--                  :icon="info.icon">-->
                        <!--        <template v-slot:footer>-->
                        <!--            <div v-html="info.footer"></div>-->
                        <!--        </template>-->
                        <!--    </CmpCardStats>-->
                        <!--</div>-->

                        <!--<CmpCard style="width: 20rem;">-->
                        <!--    <img slot="image" class="card-img-top" src="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22320%22%20height%3D%22180%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20320%20180%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_1664f6b99d2%20text%20%7B%20fill%3Argba(255%2C255%2C255%2C.75)%3Bfont-weight%3Anormal%3Bfont-family%3AHelvetica%2C%20monospace%3Bfont-size%3A16pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_1664f6b99d2%22%3E%3Crect%20width%3D%22320%22%20height%3D%22180%22%20fill%3D%22%23777%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%22119.0859375%22%20y%3D%2297.35%22%3E320x180%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" alt="Card image cap"/>-->
                        <!--    <h4 class="card-title">Card title</h4>-->
                        <!--    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>-->
                        <!--    <a href="#" class="btn btn-primary">Go somewhere</a>-->
                        <!--</CmpCard>-->

                        <div class="col-lg-3 col-md-12" v-for="(card, i) in statsDataCards"
                             :key="`card_${card.id}`">
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

                                <a href="#" @click.prevent="h_changeStatsParams(card.id, 'py')"
                                   class="ml-3">
                                  <i class="tim-icons icon-chart-bar-32"></i>
                                  {{ $t( 'form.fields-common.year-pass-min' ) }}
                                </a>

                                <a href="#" @click.prevent="h_changeStatsParams(card.id, 'cy')"
                                   class="ml-3">
                                  <i class="tim-icons icon-chart-bar-32"></i>
                                  {{ $t( 'form.fields-common.year-current-min' ) }}
                                </a>
                              </div>

                            </template>
                          </CmpCardStats>
                        </div>

                      </div>
                    </template>

                    <!-- TAB data supplier extended data -->
                    <template v-if="tab.id === 2">
                      <!-- btn 4 create -->
                      <div style="text-align: end">
                        <button :title="$t('btn.tip-create-new')"
                                class="btn btn-icon btn-primary"
                                @click.prevent="h_btnMkExtendedInfo">
                          <i class="tim-icons icon-simple-add"></i>
                        </button>
                      </div>

                      <!-- supplier extended contact info cards generation -->
                      <div class="row mt-2">
                        <CmpCard v-for="(value, key) in ls_dicExtData"
                                 class="col-md-3"
                                 :key="`ext_card_${key}`"
                                 :class="{
                                 'mr-2': key == 0,
                                 'ml-2 mr-2': key > 0 && key < Object.keys(ls_dicExtData).length - 1,
                                 'ml-2': key == Object.keys(ls_dicExtData).length - 1
                             }"
                                 @click.prevent="h_openExtDataCard(+key)"
                        >
                          <div class="row">

                            <!-- icon -->
                            <div class="col-2">
                              <i class="tim-icons ext-contad-data-card"
                                 :class="{
                                        'icon-single-02': value.pType === ADDRESS_TYPE.CONTACT,
                                        'icon-lock-circle': value.pType === ADDRESS_TYPE.PRIVATE,
                                        'icon-delivery-fast': value.pType === ADDRESS_TYPE.DELIVERY,
                                        'icon-paper': value.pType === ADDRESS_TYPE.INVOICE,
                                        'icon-pin': value.pType === ADDRESS_TYPE.OTHER,
                                     }"
                              />
                            </div>

                            <!-- contact data -->
                            <div class="col-10">
                              <p v-if="!isUndEmpZero(value.pName)">{{ value.pName }}</p>
                              <p v-if="!isUndEmpZero(value.jobPosition)">{{ value.jobPosition }}</p>
                              <p v-if="!isUndEmpZero(value.email)">{{ value.email }}</p>
                              <div v-if="!isUndEmpZero(value.countryCode) || !isUndEmpZero(value.stateCode) || !isUndEmpZero(value.city)" style="display: inline-flex">
                                <p v-if="!isUndEmpZero(value.city)">{{ value.city }}</p>
                                <p v-if="!isUndEmpZero(value.countryCode) || !isUndEmpZero(value.stateCode)">,&nbsp</p>
                                <p v-if="!isUndEmpZero(value.stateCode)">{{ value.stateCode }}</p>
                                <p v-if="!isUndEmpZero(value.countryCode)">&nbsp-&nbsp</p>
                                <p v-if="!isUndEmpZero(value.countryCode)">{{ value.countryCode }}</p>
                              </div>
                              <div>
                                <div v-if="!isUndEmpZero(value.phone) || !isUndEmpZero(value.cell)" style="display: inline-flex">
                                  <p v-if="!isUndEmpZero(value.phone)">{{ $t( 'form.fields-common.phone-mini' ) }}: {{ value.phone }}</p>
                                  <p v-if="!isUndEmpZero(value.cell) && !isUndEmpZero(value.phone)">&nbsp&nbsp|&nbsp&nbsp</p>
                                  <p v-if="!isUndEmpZero(value.cell)">{{ $t( 'form.fields-common.cell' ) }}: {{ value.cell }}</p>
                                </div>
                              </div>
                            </div>

                          </div>
                        </CmpCard>
                      </div>
                    </template>

                    <!-- TAB data purchase -->
                    <template v-if="tab.id === 3">
                      <div>
                        TODO<br><br>
                        Datos relacionados con las compras [odoo]
                      </div>
                    </template>

                    <!-- TAB data note -->
                    <template v-if="tab.id === 4">
                      <div class="row">
                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                          {{ $t( 'entities.supplier.internal-notes' ) }}
                        </label>
                        <div class="col-md-9">
                          <CmpTextInput
                              height="150"
                              name="internalNotes"
                              type="text"
                          />
                        </div>
                      </div>
                    </template>

                  </CmpTabContent>

                </template>
              </div>

            </div>

          </form>

          <!-- FORM ACTION BUTTONS -->
          <template v-slot:footer>
            <CmpFormActionsButton
                :show-delete="cpt_fMode === FMODE.EDIT && !isCloning"
                v-on:saveIntent="h_beforeSubmit"
                v-on:deleteIntent="h_intentDelete"
                v-on:cancelIntent="nav_back"
            />
          </template>
        </CmpCard>

        <!-- MODALS -->

        <!-- modal contact vCard -->
        <CmpModal v-model:show="isModalQRShowing"
                  class="modal-black"
                  id="modalQR"
                  :modal-with="'auto'"
                  :centered="false"
                  @close="h_modalQRClosing"
                  headerClasses="justify-content-center">

          <template v-slot:header>
            <h4 class="title title-up">{{ $t( 'modals.vcard' ) }}</h4>
          </template>

          <template v-slot:default>
            <div class="row">
              <div class="col-12" style="text-align: center;">
                {{ $t( 'modals.vcard-info' ) }}
              </div>
              <div class="col-12 mt-2" style="display: flex; justify-content: center;">
                <img :src="qrimage" alt="vcard-contact-image" class="mb-3">
              </div>
            </div>

          </template>
        </CmpModal>

        <!-- modal extended contact info -->
        <CmpModal v-model:show="isModalContactInfoShowing"
                  class="modal-black"
                  id="modalContactInfo"
                  :show-close="false"
                  :centered="false"
                  :close-on-backdrop-clk="false"
                  :modal-with="'wide'"
                  @close="h_modalContactInfoClosing"
                  headerClasses="justify-content-center">

          <template v-slot:header>
            <p v-if="ls_formExtMode === FMODE.CREATE"> {{ $t('modals.contact-info-create') }}</p>
            <p v-else>{{ $t('modals.contact-info-edit') }}</p>
          </template>

          <template v-slot:default>
            <ViewFormSuppliersExt
                :fmode="ls_formExtMode"
                :ext-data="ls_extData"
                :index="ls_extDataIndex"
                :showing="isModalContactInfoShowing"
                :parent-id="isUndEmpZero(id) ? 0 : +id"
                :countries="st_nomenclatures.getCountry4Select"
                :hit-remote="cpt_fMode === FMODE.EDIT"

                @update="h_updateSupData"
                @delete="h_deleteSupData"
                @closeForm="h_modalContactInfoClosing"

                :parent-data="values"
            />
          </template>

        </CmpModal>

      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import type { ComputedRef } from 'vue'
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Field, useForm } from 'vee-validate'
import { i18n } from '@/services/i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { ApiSupplier } from '@/services/api/resources-infraestructure/api-supplier'
import useFactory from '@/services/composables/useFactory'
import useCommon from '@/services/composables/useCommon'
import useToastify from '@/services/composables/useToastify'
import useQrCodes from '@/services/composables/useQrCodes'
import useDialogfy from '@/services/composables/useDialogfy'
import { CmpBaseInput, CmpCard, CmpCardStats, CmpFormActionsButton, CmpModal, CmpMultiselectField, CmpTab, CmpTabContent, CmpTextInput, CmpVeeCheckbox } from '@/components'
import { ACTION_KIND_STR, ADDRESS_TYPE, ENTITY_NAMES, FMODE, KEYS, OPS_KIND_STR, RoutePathNames, VSchemaSupplier } from '@/services/definitions'
import ViewFormSuppliersExt from '@/views/purchase/suppliers/ViewFormSuppliersExt.vue'

import type { ById, IDtoSupplier, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormSuppliers',
    components: {
        Field,
        CmpTab,
        CmpCard,
        CmpModal,
        CmpCardStats,
        CmpTextInput,
        CmpBaseInput,
        CmpTabContent,
        CmpVeeCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton,

        ViewFormSuppliersExt
    },
    setup: function() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const toast = useToast()                                                        // The toast lib interface
        const route = useRoute()
        const router = useRouter()

        const { fmode, id } = route.params                                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions
        const st_nomenclatures = useSt_Nomenclatures()                                  // pinia store for nomenclatures
        const ls_formExtMode = ref<String>(FMODE.CREATE)                                // flag so we can tell which form mode we need to open de extended address form for the supplier
        const ls_dicExtData = ref<ById<IDtoSupplier>>({})                         // local store | extended contact information data, for suppliers / partners
        const ls_extData = ref<IDtoSupplier | undefined>(undefined)
        const ls_extDataIndex = ref<number | undefined>(undefined)                // ref value to save the index of the card is currently opened

        const { mkSupplier } = useFactory()
        const { mkVCardQrImg } = useQrCodes()
        const { isUndEmpZero, isUnd } = useCommon()
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, setFieldValue, resetForm, values } = useForm<IDtoSupplier>({
            validationSchema: VSchemaSupplier,
            initialValues:    mkSupplier(),
            initialErrors:    undefined
        })

        // html references
        const ref_selectStates = ref<InstanceType<typeof CmpMultiselectField>>()        // reference to country province / states select field

        // helpers & flags
        const qrimage = ref()
        const isCloning = ref(false)                                              // tells is we are in a cloning process so we call the creat endpoint instead the edition endpoint
        const isModalQRShowing = ref(false)
        const isModalContactInfoShowing = ref(false)
        const isExtContactInfo = ref (false)                                      // tells if we open a 'extended contact information' entity. Comes in handy for telling a field needs to be rendered or to know how to make the edition request to the backend..

        // form data
        const activeTabId = ref<number>(1)
        const _tab1 = { id: 1, title: t('form.fields-common.info') }
        const _tab2 = { id: 2, title: t('entities.supplier.tab-contact-plus') }
        const _tab3 = { id: 3, title: t('entities.supplier.tab-purchases') }
        const _tab4 = { id: 4, title: t('form.fields-common.notes') }
        const tabs = ref<Array<{id:number, title:string}>>([])                    // form tabs data array
        const statsDataCards = reactive([                                         // form supplier statistics data / information
            {
                id:       1,
                title:    isUnd(values.pCount) ? 0 : values.pCount?.toString(),
                subTitle: t('entities.supplier.stat-products'),
                type:     isUnd(values.pCount) || values.pCount as number <= 0 ? 'warning' : 'success',
                icon:     'tim-icons icon-components'
                // footer:   `<i class="tim-icons icon-zoom-split"></i></i> Update Now`
            },
            {
                id:       2,
                title:    isUnd(values.purchasesCountPend) ? 0 : values.purchasesCountPend?.toString(),
                subTitle: t('entities.supplier.stat-purchases-pend'),
                type:     isUnd(values.purchasesCountPend) || values.purchasesCountPend as number <= 0 ? 'warning' : 'success',
                icon:     'tim-icons icon-watch-time'
            },
            {
                id:       3,
                title:    isUnd(values.purchasesCountTotal) ? 0 : values.purchasesCountTotal?.toString(),
                subTitle: t('entities.supplier.stat-purchases-count'),
                type:     isUnd(values.purchasesCountTotal) || values.purchasesCountTotal as number <= 0 ? 'danger' : 'info',
                icon:     'tim-icons icon-cart'
            },
            {
                id:       4,
                title:    `$ ${ values.purchasesCountValue }`,
                subTitle: t('entities.supplier.stat-purchases-count-value'),
                type:     isUnd(values.purchasesCountValue) || values.purchasesCountValue as number <= 0 ? 'danger' : 'info',
                icon:     'tim-icons icon-money-coins'
            }
        ])

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

            tabs.value = [_tab1, _tab2, _tab3, _tab4 ]                                                                  // normal case for the tabs, its a parent / root supplier
            await st_nomenclatures.reqNmcCompanies().catch(err => tfyCRUDFail(err, ENTITY_NAMES.COMPANY, OPS_KIND_STR.REQUEST))

            // ---- creation mode
            if (cpt_fMode.value === FMODE.CREATE as TFormMode)
                await st_nomenclatures.reqNmcCountries().catch(err => tfyCRUDFail(err, ENTITY_NAMES.COUNTRY, OPS_KIND_STR.REQUEST))
                // this isn't needed in edition mode, see nav_2Form in ViewListSuppliers.vue file

            // ---- edition mode
            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                let formDataFromServer: IDtoSupplier | undefined = await ApiSupplier.getSuppById(+id)                   // aux variable to save entity data requested from the server

                // setValues(formDataFromServer)
                resetForm({
                    errors: {},
                    values: { ...formDataFromServer }
                })

                // setting up the dictionary holding the extended contact information
                if (formDataFromServer.extData != undefined && formDataFromServer.extData.length > 0)
                    for (let index = 0; index < formDataFromServer.extData.length ; index++)
                        ls_dicExtData.value[index] = formDataFromServer.extData[index]

                // sub-normal case for the tabs, we opened (click) an a extended information entity for another parent / root supplier entity. So we are skipping the tabs for adding 'extended contact' info
                if (!isUndEmpZero(formDataFromServer.parentID))
                {
                    tabs.value = [_tab1, _tab3, _tab4 ]
                    if (formDataFromServer.pType == ADDRESS_TYPE.CONTACT) isExtContactInfo.value = true
                }
            }


            window.addEventListener('keydown', h_keyboardKeyPress)                                                // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                           // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })
        //#endregion ==========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newSupplier payload with the data for the request
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newSupplier: IDtoSupplier, doWeNeedToStay: boolean ) => {



            hpr_sanitation(newSupplier)

            ApiSupplier.reqInsSupplier(newSupplier)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.ADDITION, newSupplier.pName)

                // so now what ?
                if (!doWeNeedToStay) nav_back()                                                                         // so we are going back to the data table
                else {
                    resetForm({ values: mkSupplier(), errors: undefined })                                        // so wee need to clean the entire form and stay in it
                    hpr_clearSelects()                                                                                  // cleaning select field
                }

            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.ADDITION))
        }

        /**
         * Action for edit the supplier category
         * @param editedSupplier object containing the edited information
         * @param doWeNeedToStay This value, in this context, tells if the clicked button was the 'Applied' or the 'Save'
         */
        const a_edit = ( editedSupplier: IDtoSupplier, doWeNeedToStay: boolean ): void => {

            if (editedSupplier.id == 1) {                                                                               // default entity cannot be changed
                dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-mod-default'))
                return
            }

            isExtContactInfo.value
                ? hpr_sanitationExt(editedSupplier)
                : hpr_sanitation(editedSupplier)

            ApiSupplier.reqUpdateSupplier(editedSupplier, isExtContactInfo.value ? 'ext' : undefined)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.UPDATE, editedSupplier.pName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()                                                                          // so we are going back to the data table

            })
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.UPDATE))
        }

        /**
         * Request the deletion of a supplier
         * @param suppId Supplier identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_delete = async (suppId: number, ref: undefined | string = undefined ): Promise<void> => {
            ApiSupplier.reqDeleteSupp(suppId)
            .then(( response: any ) => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.DELETION, ref)
                nav_back()
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================
        // https://medium.com/@growthcoder/how-to-correctly-use-computed-properties-in-vue3-690c16bc096c

        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Restoring the country provinces / state selected value
         */
        const hpr_clearSelects = () => {
            st_nomenclatures.states = []

            if (!ref_selectStates.value) return

            ref_selectStates.value.clearSelection()
            setFieldValue('stateCode', undefined)
        }

        /**
         * Form data sanitation method so we can clean the fields values before submitting
         * @param dirtyObj formulary data 'Supplier' object
         */
        const hpr_sanitation = (dirtyObj: IDtoSupplier) => {

            if (cpt_fMode.value === FMODE.EDIT) delete dirtyObj.extData             // ❗ in this (parent supplier entity) edition mode, all the contact extended information (children supplier) will be saved (update, create) in the backend directly. So we will not need this field on the request

            delete dirtyObj.pType                                                   // in this view / crud, case can safely remove this property, backend will handle it
            delete dirtyObj.cmpDisplayName

            if (!isUndEmpZero(dirtyObj.website)) dirtyObj.website = dirtyObj.website!.trim()                         // trimming spaces trailing spaces
            if (isUndEmpZero(dirtyObj.website)) delete dirtyObj.website
            if (dirtyObj.zip == 0) dirtyObj.zip = undefined
            if (isUndEmpZero(dirtyObj.city)) delete dirtyObj.city
            if (isUndEmpZero(dirtyObj.jobPosition)) delete dirtyObj.jobPosition

            if(dirtyObj.isCompany)
            {
                delete dirtyObj.jobPosition
                delete dirtyObj.parentID
            }

            delete dirtyObj.pCount
            delete dirtyObj.purchasesCountPend
            delete dirtyObj.purchasesCountTotal
            delete dirtyObj.purchasesCountValue

            if (Object.keys(ls_dicExtData.value).length <= 0) delete dirtyObj.extData
            else dirtyObj.extData = Object.values(ls_dicExtData.value)

            dirtyObj.internalNotes?.trim()
        }

        /**
         * Form data sanitation method so we can clean the fields values before submitting.
         * 📍 Should be used when we are editing a child supplier contact info (extended contact information)
         * ⚠ This logic was taken from the 'hpr_sanitize' method located in the 'ViewFormSuppliersExt.vue' view file
         *
         * @param dirtyObj formulary data 'Supplier' object
         */
        const hpr_sanitationExt = ( dirtyObj: IDtoSupplier ) => {
            delete dirtyObj.extData
            delete dirtyObj.pCount
            delete dirtyObj.purchasesCountPend
            delete dirtyObj.purchasesCountTotal
            delete dirtyObj.purchasesCountValue

            if (isUndEmpZero(dirtyObj.cell)) delete dirtyObj.cell
            if (isUndEmpZero(dirtyObj.phone)) delete dirtyObj.phone

            delete dirtyObj.zip
            delete dirtyObj.city
            delete dirtyObj.street
            delete dirtyObj.stateCode
            delete dirtyObj.countryCode

            dirtyObj.internalNotes?.trim()
        }

        //#endregion ==========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * Tries to update the supplier extended contact information coming from the formulary view
         *
         * @param index The index for the extended supplier contact information in the local collection
         * @param supData Extended supplier contact information object, with its fields just updated, coming form the child component
         */
        const h_updateSupData = ( index: number, supData: IDtoSupplier ) => {
            const infoCount = Object.keys(ls_dicExtData.value).length                                                   // getting the existing supplier data count on the dictionary, cause we will use that value for index if the 'extended contact info' ios a new one

            if      (ls_formExtMode.value == FMODE.CREATE) ls_dicExtData.value[infoCount] = supData                     // the supplier (parent entity) doesn't exist in database yet, so we use the extended contact count in the collection as index
            else if (ls_formExtMode.value == FMODE.EDIT_LOCAL || ls_formExtMode.value == FMODE.EDIT) ls_dicExtData.value[index] = supData
            else ;  // we have nothing to do here

        }

        const h_deleteSupData = (index: number) => {
            if (index >= 0) delete ls_dicExtData.value[index]
        }

        /**
         * This method tries to accommodate the data before it will be sent to the server
         * Handles the form submission event through the vee-validate 'SubmissionHandler' so we can take advantage of all
         * the its validation logic but using with own logic inserted as callback
         *
         * @param evt The DOM event coming from our Vue UI custom component (CmpFormActionsButton in this case)
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = ( evt: Event, doWeNeedToStay: boolean ) => {
            evt.preventDefault()

            // handling the submission with vee-validate method
            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && isCloning.value && meta.value.dirty) a_create(formData, doWeNeedToStay)   // cloning mode
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !isCloning.value && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()                                             // was no changes (no dirty) with the data, so going back normally
            }).call(this)
        }

        const h_intentDelete = async ( evt: any ) => {

            // default entity cannot be changed
            if (+id == 1) {
                dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-mod-default'))
                return
            }

            if (cpt_fMode.value !== FMODE.EDIT as TFormMode) return

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.SUPPLIER, values.pName)
            if (wasConfirmed) await a_delete(values.id, values.pName)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        /**
         * Clone the (cloneable, 'cause some field must be unique) form data to prepare the form to insert a new supplier
         * instead of edit a existing one
         */
        const h_formBtnAction_Clone = () => {

            // disabling the clone, so we need to restore
            if (isCloning.value == true) {
                isCloning.value = false

                // restoring the form with the original data
                resetForm({
                    errors: {},
                    values: { ...values }
                })

                return
            }

            // enabling the clone, so we need to clone

            // -- resetting the identity identifier
            setFieldValue('id', 0)
            isCloning.value = true

            // -- resetting the fields that must be uniques
            setFieldValue('pName', '')
            setFieldValue('email', undefined)
            setFieldValue('cell', '')
            setFieldValue('phone', undefined)
        }

        /**
         * Generate a VCard QR with the supplier info, son the image can be scanned
         */
        const h_formBtnAction_QR = () => {
            isModalQRShowing.value = true
            let names = values.pName?.split(' ') ?? []               // stripping the contact name

            let customNameData = {}
            if (values.isCompany) customNameData = {  givenName: values.pName  }
            else  customNameData = {
                givenName:  names[ 0 ] ?? '',
                familyName: `${ names[ 1 ] ?? '' } ${ names[ 2 ] ?? '' }`
            }

            qrimage.value = mkVCardQrImg({
                name:       customNameData,
                work:      { role: values.jobPosition, title: '', organization: values.pName ?? '' },
                emails:    [ { type: t('data.work'), text: values.email ?? '' } ],
                phones:    [
                    { type: t('table-headers.cell'), text: values.cell ?? '' },
                    { type: t('table-headers.land-phone'), text: values.phone ?? '' }
                ],
                addresses: [
                    {
                        type:     t('data.work'),
                        street:   values.street,
                        code:     values.zip ?? undefined,
                        country:  values.countryCode,
                        region:   values.stateCode ?? undefined,
                        locality: st_nomenclatures.getStatesByCode(!values.stateCode ? '' : values.stateCode)
                    }
                ],
                note:      values.internalNotes ? { text: values.internalNotes } : undefined
            })
        }

        /**
         * Generate a VCard file with the contact information, so the file can be downloaded
         */
        const h_formBtnAction_DownloadVCard = () => {
            // TODO implement this
            console.error('action btn << vcard file >>')
        }

        const h_tabChange = ( tabId: number ) => {
            activeTabId.value = tabId
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
         * Handles the logic in case MultiSelect Country values changes, including clear or restore
         *
         * @param countryId Identifier of the country we want to look for
         */
        const h_countryChange = async ( countryId: string, ): Promise<void> => {
            if (!countryId) {
                hpr_clearSelects()
                return
            }

            await st_nomenclatures.reqNmcCountriesStates(countryId)
        }

        const h_modalQRClosing = () => {
            isModalQRShowing.value = false
            qrimage.value = undefined
        }

        // Handles the closing event of the extended contact information formulary
        const h_modalContactInfoClosing = () => {
            window.addEventListener('keydown', h_keyboardKeyPress)                              // keyboard keys event handler, we need to clean this kind of event when the component are destroyed

            ls_extData.value = undefined
            ls_extDataIndex.value = undefined
            isModalContactInfoShowing.value = false
        }

        // Handles the intention of create a new extended contact information for the supplier.
        // So we need to open the modal with the extended contact information formulary for creation
        const h_btnMkExtendedInfo = () => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                           // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible

            isModalContactInfoShowing.value = true
            ls_formExtMode.value = FMODE.CREATE
            ls_extDataIndex.value = undefined
        }

        /**
         * Tries to open the Contact Extended Information Card with the appropriated data
         * @param dataIndex The Card index in the contact extended data collection (array)
         */
        const h_openExtDataCard = ( dataIndex: number ) => {
            window.removeEventListener('keydown', h_keyboardKeyPress)                           // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible

            ls_extData.value = ls_dicExtData.value[dataIndex]
            ls_formExtMode.value = +id <= 0 || isNaN(+id) ? FMODE.EDIT_LOCAL : FMODE.EDIT
            ls_extDataIndex.value = +dataIndex

            isModalContactInfoShowing.value = true
        }

        //#endregion ==========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.supplier })
        }

        //endregion ===========================================================================

        return {
            id,
            values,

            FMODE,
            ADDRESS_TYPE,
            ENTITY_NAMES,

            qrimage,
            isCloning,
            isModalQRShowing,
            isModalContactInfoShowing,

            isExtContactInfo,

            ls_extData,
            ls_dicExtData,
            ls_formExtMode,
            ls_extDataIndex,

            tabs,
            activeTabId,
            statsDataCards,

            ref_selectStates,
            st_nomenclatures,

            cpt_fMode,

            nav_back,
            h_tabChange,

            h_intentDelete,
            h_beforeSubmit,
            h_updateSupData,
            h_deleteSupData,
            h_countryChange,
            h_modalQRClosing,
            h_openExtDataCard,
            h_keyboardKeyPress,
            h_btnMkExtendedInfo,
            h_modalContactInfoClosing,

            h_statGoCheck,
            h_staticsRestore,
            h_changeStatsParams,

            h_formBtnAction_QR,
            h_formBtnAction_Clone,
            h_formBtnAction_DownloadVCard,

            // --- composable-s
            isUndEmpZero,
        }
    }
})
</script>

<style scoped>

.ext-contad-data-card {
  font-size: 2.2rem !important;
}

</style>
