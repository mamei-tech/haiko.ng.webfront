<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">

                <CmpCard :hasFormBackBtn="true" v-on:doClick="h_back" :title=" isCloning ? $t('form.fields-common.cloning-state') : undefined">

                    <!-- card / form action bard -->
                    <template v-if="cpt_fMode === 'edit'" v-slot:card-actionbar>
                        <button :title="$t('btn.tip-action-clone', {subject: $t('entities.supplier.name') } )"
                                style="float: right"
                                class="btn btn-icon btn-default ml-1"
                                :class="!isCloning ? 'btn-default' : 'btn-danger'"
                                @click.prevent="h_formBtnAction_Clone">
                            <i class="fa fa-clone"></i>
                        </button>

                        <button :title="$t('btn.tip-action-gen-vcard-file')"
                                style="float: right"
                                class="btn btn-icon btn-default ml-1 mr-1"
                                @click.prevent="h_formBtnAction_QR">
                            <i class="fa fa-qrcode"></i>
                        </button>

                        <button :title="$t('btn.tip-action-gen-vcard-qr')"
                                style="float: right"
                                class="btn btn-icon btn-default mr-1"
                                @click.prevent="h_formBtnAction_DownloadVCard">
                            <i class="fa fa-download"></i>
                        </button>
                    </template>

                    <!-- FORM -->
                    <form class="form form-horizontal">

                        <!-- id -->
                        <CmpBasicInput
                                disabled
                                placeholder="###########"
                                name="id"
                                type="hidden"
                                v-model="iniFormData.id"
                        />

                        <div class="row">

                            <div class="col-xm-12 col-md-6">

                                <!-- supplier name -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields-common.firstname') }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.suppliers-company-name')"
                                                name="sName"
                                                type="text"
                                                v-model="iniFormData.sName"
                                        />
                                    </div>
                                </div>

                                <!-- commercial contact -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t( 'table-headers.contact' ) }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.supplier-contact')"
                                                name="contactName"
                                                type="text"
                                                v-model="iniFormData.contactName"
                                        />
                                    </div>
                                </div>

                                <!-- contact notes -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields.suppliers.sContactNotes') }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.supplier-contact-notes')"
                                                name="sContactNotes"
                                                type="text"
                                                v-model="iniFormData.sContactNotes"
                                        />
                                    </div>
                                </div>

                                <!-- address & zip -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields-common.address') }}
                                    </label>
                                    <div class="col-md-6">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.address')"
                                                name="sAddress"
                                                type="text"
                                                v-model="iniFormData.sAddress"
                                        />
                                    </div>

                                    <label class="text-sm-left text-md-right col-md-1 col-form-label">
                                        Zip
                                    </label>
                                    <div class="col-md-2">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.zip')"
                                                name="zip"
                                                type="number"
                                                v-model="iniFormData.zip"
                                        />
                                    </div>
                                </div>

                                <!-- country & state -->
                                <!-- in edition mode we need to ensure that we have the data of all option for the select, so the Multiselect render the entity selected option properly -->
                                <!-- to assist this logic and make it more simple, make the fetch of the data before calling the router to render this entire view. CHECK h_navEditSuppIntent in ViewFormSuppliers.vue file -->
                                <div class="row" v-if="(cpt_fMode === 'edit' && iniFormData.countryCode !== undefined)">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields-common.country') }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                                             :options="st_nomenclatures.getCountry4Multiselect"
                                                             :searchable="true"
                                                             closeOnSelect
                                                             name="countryCode"
                                                             class="mb-2"
                                                             v-on:changehapend="h_countryChange"
                                        >

                                            <!--option coming from slot child component ('slots props') [option] -->
                                            <template #customOption="{option}">
                                                {{  option.label }}
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
                                        {{ $t('form.fields-common.country-state') }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                                             :options="st_nomenclatures.getCountryStates4Multiselect"
                                                             :searchable="true"
                                                             name="stateCode"
                                                             class="mb-2"
                                                             closeOnSelect
                                                             ref="ref_selectStates"
                                        >

                                            <!--option coming from slot child component ('slots props') [option] -->
                                            <template #customOption="{option}">
                                                {{  option.label }}
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
                                <div class="row" v-else>
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields-common.country') }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                                             :options="st_nomenclatures.getCountry4Multiselect"
                                                             :searchable="true"
                                                             closeOnSelect
                                                             name="countryCode"
                                                             class="mb-2"
                                                             v-on:changehapend="h_countryChange"
                                        >

                                            <!--option coming from slot child component ('slots props') [option] -->
                                            <template #customOption="{option}">
                                                {{  option.label }}
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
                                        {{ $t('form.fields-common.country-state') }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpMultiselectField :placeholder="$t('form.placeholders.select')"
                                                             :options="st_nomenclatures.getCountryStates4Multiselect"
                                                             :searchable="true"
                                                             name="stateCode"
                                                             class="mb-2"
                                                             closeOnSelect
                                                             ref="ref_selectStates">

                                            <!--option coming from slot child component ('slots props') [option] -->
                                            <template #customOption="{option}">
                                                {{  option.label }}
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

                                <!-- land phone & cell phone -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t("form.fields-common.cell") }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpBasicInput
                                                placeholder="### ## ### ## ##"
                                                name="cell"
                                                type="number"
                                                v-model="iniFormData.cell"
                                        />
                                    </div>

                                    <label class="text-sm-left text-md-right col-md-1 col-form-label">
                                        {{ $t("form.fields-common.phone") }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpBasicInput
                                                placeholder="### ## ### ## ##"
                                                name="sPhone"
                                                type="number"
                                                v-model="iniFormData.sPhone"
                                        />
                                    </div>
                                </div>

                                <!-- email -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields-common.email') }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.email')"
                                                name="sEmail"
                                                type="text"
                                                v-model="iniFormData.sEmail"
                                        />
                                    </div>
                                </div>

                                <!-- website -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('form.fields-common.website') }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.website')"
                                                name="sWebSite"
                                                type="text"
                                                v-model="iniFormData.sWebSite"
                                        />
                                    </div>
                                </div>

                                <!-- category -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('table-headers.category') }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpMultiselectField :placeholder="$t('form.placeholders.supplier-category').toLowerCase()"
                                                             :options="st_nomenclatures.getSuppCat4Multiselect"
                                                             name="sCategoryID"
                                                             class="mb-2"
                                                             closeOnSelect>

                                            <!--option coming from slot child component ('slots props') [option] -->
                                            <template #customOption="{option}">
                                                {{  option.label }}
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

                                <!-- isActive / status -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t('data.status') }}
                                    </label>
                                    <div class="col-md-3">
                                        <CmpVeeCheckbox name="isActive"
                                                        :checked="iniFormData.isActive"
                                                        v-model="iniFormData.isActive"
                                                        :labels="[$t('others.available'), $t('others.unavailable')]"
                                        />
                                    </div>

                                    <label class="text-sm-left text-md-right col-md-2 col-form-label">
                                        {{ $t('form.fields.suppliers.isCompany') }}
                                    </label>
                                    <div class="col-md-4">
                                        <CmpVeeCheckbox name="isCompany"
                                                        :checked="iniFormData.isCompany"
                                                        v-model="iniFormData.isCompany"
                                                        :labels="[$t('data.company'), $t('data.individual')]"
                                        />
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

                                <!-- supplier statistics -->
                                <CmpTabContent :key="1" :id="tabs[0].title" :activeTabId="activeTabId" :tabId="1">
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

                                        <div class="col-lg-3 col-md-6" :key="statsDataCards[0].title">
                                            <CmpCardStats :title="statsDataCards[0].title.toString()"
                                                          :subTitle="statsDataCards[0].subTitle"
                                                          :type="statsDataCards[0].type"
                                                          :icon="statsDataCards[0].icon">
                                                <template v-slot:footer>
                                                    <!--<div v-html="info.footer"></div>-->
                                                    <div>
                                                        <a href="#" @click.prevent="h_statGoCheck(ENTITY_NAMES.PRODUCT)">

                                                            <i class="tim-icons icon-zoom-split"></i>
                                                            {{ $t( 'form.fields-common.view-check' ) }}
                                                        </a>
                                                    </div>
                                                </template>
                                            </CmpCardStats>
                                        </div>

                                        <div class="col-lg-3 col-md-6" :key="statsDataCards[1].title">
                                            <CmpCardStats :title="statsDataCards[1].title.toString()"
                                                          :subTitle="statsDataCards[1].subTitle"
                                                          :type="statsDataCards[1].type"
                                                          :icon="statsDataCards[1].icon">
                                                <template v-slot:footer>
                                                    <div>
                                                        <a href="#" @click.prevent="h_statGoCheck(ENTITY_NAMES.PURCHASE)">
                                                            <i class="tim-icons icon-zoom-split"></i>
                                                            {{ $t( 'form.fields-common.view-check' ) }}
                                                        </a>
                                                    </div>
                                                </template>
                                            </CmpCardStats>
                                        </div>

                                        <div class="col-lg-3 col-md-6" :key="statsDataCards[2].title">
                                            <CmpCardStats :title="statsDataCards[2].title.toString()"
                                                          :subTitle="statsDataCards[2].subTitle"
                                                          :type="statsDataCards[2].type"
                                                          :icon="statsDataCards[2].icon"
                                                          :withRestore="true"
                                                          v-on:doRestore="h_staticsRestore('tcount')">
                                                <template v-slot:footer>
                                                    <div>
                                                        <a href="#" @click.prevent="h_changeStatsParams('tcount', 'pm')">
                                                            <i class="tim-icons icon-calendar-60"></i>
                                                            {{ $t( 'form.fields-common.month-pass-min' ) }}
                                                        </a>

                                                        <a href="#" @click.prevent="h_changeStatsParams('tcount', 'py')" class="ml-3">
                                                            <i class="tim-icons icon-chart-bar-32"></i>
                                                            {{ $t( 'form.fields-common.year-pass-min' ) }}
                                                        </a>

                                                        <a href="#" @click.prevent="h_changeStatsParams('tcount', 'cy')" class="ml-3">
                                                            <i class="tim-icons icon-chart-bar-32"></i>
                                                            {{ $t( 'form.fields-common.year-current-min' ) }}
                                                        </a>
                                                    </div>
                                                </template>
                                            </CmpCardStats>
                                        </div>

                                        <div class="col-lg-3 col-md-6" :key="statsDataCards[3].title">
                                            <CmpCardStats :title="statsDataCards[3].title.toString()"
                                                          :subTitle="statsDataCards[3].subTitle"
                                                          :type="statsDataCards[3].type"
                                                          :icon="statsDataCards[3].icon"
                                                          :withRestore="true"
                                                          v-on:doRestore="h_staticsRestore('tvalue')">
                                                <template v-slot:footer>
                                                    <div>
                                                        <a href="#" @click.prevent="h_changeStatsParams('tvalue', 'pm')">
                                                            <i class="tim-icons icon-calendar-60"></i>
                                                            {{ $t( 'form.fields-common.month-pass-min' ) }}
                                                        </a>

                                                        <a href="#" @click.prevent="h_changeStatsParams('tvalue', 'py')" class="ml-3">
                                                            <i class="tim-icons icon-chart-bar-32"></i>
                                                            {{ $t( 'form.fields-common.year-pass-min' ) }}
                                                        </a>

                                                        <a href="#" @click.prevent="h_changeStatsParams('tvalue', 'cy')" class="ml-3">
                                                            <i class="tim-icons icon-chart-bar-32"></i>
                                                            {{ $t( 'form.fields-common.year-current-min' ) }}
                                                        </a>
                                                    </div>
                                                </template>
                                            </CmpCardStats>
                                        </div>

                                    </div>
                                </CmpTabContent>

                                <!-- -->
                                <CmpTabContent :key="2" :tabId="2" :id="tabs[1].title" :activeTabId="activeTabId">
                                    <div>
                                        TODO<br><br>
                                        Datos relacionados con las compras [odoo]

                                    </div>
                                </CmpTabContent>

                                <!-- -->
                                <CmpTabContent :key="3" :tabId="3" :id="tabs[2].title" :activeTabId="activeTabId">
                                    <div>
                                        <div>
                                            TODO<br><br>
                                            Gestión de mas de una dirección para el proveedor [odoo]
                                        </div>
                                    </div>
                                </CmpTabContent>

                                <!-- -->
                                <CmpTabContent :key="4" :tabId="4" :id="tabs[3].title" :activeTabId="activeTabId">
                                    <!-- notes -->
                                    <div class="row">
                                        <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                            {{ $t('form.fields.suppliers.sInternalNotes') }}
                                        </label>
                                        <div class="col-md-9">
                                            <CmpTextInput
                                                    height="150"
                                                    name="sInternalNotes"
                                                    type="text"
                                                    v-model="iniFormData.sInternalNotes"
                                            />
                                        </div>
                                    </div>
                                </CmpTabContent>
                            </div>
                        </div>

                    </form>

                    <!-- FORM ACTION BUTTONS -->
                    <template v-slot:footer>
                        <CmpFormActionsButton
                                :show-delete="cpt_fMode === 'edit' && !isCloning"
                                v-on:saveIntent="h_beforeSubmit"
                                v-on:deleteIntent="h_intentDelete"
                                v-on:cancelIntent="h_back"
                        />
                    </template>
                </CmpCard>

                <!-- MODALS -->
                <!-- modal contact vCard -->
                <CmpModal v-model:show="isModalShowing"
                          class="modal-black"
                          id="searchModal"
                          :centered="false"
                          :show-close="true"
                          @close="h_modalVcardClosing()"
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

            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { Field, useForm } from 'vee-validate'
import { i18n } from '@/services/i18n'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { ApiSupplier } from '@/services/api/api-supplier'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useQrCodes from '@/services/composables/useQrCodes'
import useDialogfy from '@/services/composables/useDialogfy'
import { CmpCard, CmpCardStats, CmpFormActionsButton, CmpBasicInput, CmpMultiselectField, CmpVeeCheckbox, CmpTab, CmpTabContent, CmpTextInput, CmpModal } from '@/components'
import { ACTION_KIND_STR, ENTITY_NAMES, FMODE, KEYS, OPS_KIND_STR, RoutePathNames } from '@/services/definitions'
import { VSchemaSupplier } from '@/services/definitions/validations/validations-suppliers'

import type Multiselect from '@vueform/multiselect'
import type { ComputedRef } from 'vue'
import type { IDtoSupplier, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormSuppliers',
    components: {
        Field,
        CmpCard,
        CmpModal,
        CmpCardStats,
        CmpTextInput,
        CmpBasicInput,
        CmpTab,
        CmpTabContent,
        CmpVeeCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup: function() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global

        const toast = useToast()                                                // The toast lib interface
        const route = useRoute()
        const router = useRouter()

        const st_nomenclatures = useSt_Nomenclatures()                          // pinia store for nomenclatures
        const { fmode, id } = route.params                                      // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        const { mkSupplier } = useFactory()
        const { mkVCardQrImg } = useQrCodes()
        const { dfyConfirmation } = useDialogfy()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)

        // html references
        const ref_selectStates = ref<InstanceType<typeof Multiselect>>()        // reference to country province / states select field

        // helpers & flags
        const qrimage = ref()
        const isCloning = ref(false)                                     // tells is we are in a cloning process so we call the creat endpoint instead the edition endpoint
        const isModalShowing = ref(false)

        // form data
        const activeTabId = ref<number>(1)
        const iniFormData = reactive<IDtoSupplier>(mkSupplier())                // initial form data
        const tabs = [                                                          // form tabs data array
            { id: 1, title: t('form.fields-common.info') },
            { id: 2, title: t('form.fields.suppliers.tab-contact-plus') },
            { id: 3, title: t('form.fields.suppliers.tab-purchases') },
            { id: 4, title: t('form.fields-common.notes') }
        ]
        const statsDataCards = reactive([                                 // form supplier statistics data / information
            {
                title:    iniFormData.pCount,
                subTitle: t('form.fields.suppliers.stat-products'),
                type:     'info',
                icon:     'tim-icons icon-components'
                // footer:   '<i class="tim-icons icon-zoom-split"></i></i> Update Now'
            },
            {
                title:    iniFormData.purchasesCountPend,
                subTitle: t('form.fields.suppliers.stat-purchases-pend'),
                type:     'danger',
                icon:     'tim-icons icon-watch-time'
            },
            {
                title:    iniFormData.purchasesCountTotal,
                subTitle: t('form.fields.suppliers.stat-purchases-count'),
                type:     'info',
                icon:     'tim-icons icon-cart'
            },
            {
                title:    '$' + iniFormData.purchasesCountValue,
                subTitle: t('form.fields.suppliers.stat-purchases-count-value'),
                type:     'warning',
                icon:     'tim-icons icon-money-coins'
            }
        ])
        let formDataFromServer: IDtoSupplier | undefined = undefined            // aux variable to save entity data requested from the server

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

            // create mode
            if (cpt_fMode.value === FMODE.CREATE as TFormMode)
                await st_nomenclatures.reqNmcCountries().catch(err => tfyCRUDFail(err, ENTITY_NAMES.COUNTRY, OPS_KIND_STR.REQUEST))
                // this isn't needed in edition mode, see h_navEditSuppIntent in ViewFormSuppliers.vue file

            // edition edition
            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                formDataFromServer = await ApiSupplier.getSuppById(+id)

                Object.assign(iniFormData, formDataFromServer)                          // shallow (primitive values only) copy of form data

                // setValues(formDataFromServer)
                resetForm({
                    errors: {},
                    values: { ...formDataFromServer }
                })
            }

            // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
            window.addEventListener('keydown', h_keyboardKeyPress)
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
            window.removeEventListener('keydown', h_keyboardKeyPress)
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
            ApiSupplier.insertSupplier(newSupplier).then(() => {

                // some value sanitation to ensure pass backend validations
                if (newSupplier.zip == 0) newSupplier.zip = undefined

                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.ADDITION, newSupplier.sName)

                // so now what ?
                if (!doWeNeedToStay) h_back()                                               // so we are going back to the data table
                else {
                    resetForm({ values: mkSupplier(), errors: undefined })             // so wee need to clean the entire form and stay in it
                    hpr_clearStateSelect()                                                  // cleaning select field
                }

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.ADDITION))
        }

        /**
         * Action for edit the supplier category
         * @param editedSupplierCat object containing the edited information
         * @param doWeNeedToStay This value, in this context, tells if the clicked button was the 'Applied' or the 'Save'
         */
        const a_edit = ( editedSupplierCat: IDtoSupplier, doWeNeedToStay: boolean ): void => {

            ApiSupplier.reqUpdateSupplier(editedSupplierCat)
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.UPDATE, editedSupplierCat.sName)

                // so now what ?
                if(!doWeNeedToStay) h_back()                                  // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.SUPPLIER_CAT, OPS_KIND_STR.UPDATE))
        }

        /**
         * Request the deletion of a supplier to the backend
         * @param suppId Supplier identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_delete = async (suppId: number, ref: undefined | string = undefined ): Promise<void> => {
            ApiSupplier.reqDeleteSupp(suppId)
            .then(( response: any ) => {
                tfyCRUDSuccess(ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.DELETION, ref)
                h_back()
            })
            .catch(error => tfyCRUDFail(error, ENTITY_NAMES.SUPPLIER, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode

        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, setValues, setFieldValue, resetForm } = useForm<IDtoSupplier>({
            validationSchema: VSchemaSupplier,
            initialValues:    iniFormData,
            initialErrors:    undefined
        })

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Restoring the country provinces / state selected value
         */
        const hpr_clearStateSelect = () => {
            st_nomenclatures.states = []

            if (!ref_selectStates.value) return
            //@ts-ignore
            ref_selectStates.value.clearSelection()
        }

        //#endregion ==========================================================================

        //region ======== EVENTS HANDLERS & WATCHERS ==========================================

        /**
         * This method tries to accommodate the data before it will send to the server to update the permission of the role
         * Basically, filter the perms2mod record with the data it was actually changed and allocate in 2 groups
         * (remove & grant) the perms that has changed.
         *
         * @param evt The DOM event coming from our Vue UI custom component (CmpFormActionsButton in this case)
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = ( evt: Event, doWeNeedToStay: boolean ) => {
            evt.preventDefault()

            // handling the submission with vee-validate method
            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && isCloning.value && meta.value.dirty) a_create(formData, doWeNeedToStay)       // cloning mode
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !isCloning.value && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) h_back()                                             // was no changes (no dirty) with the data, so going back normally
            }).call(this)
        }

        const h_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.supplier })
        }

        const h_intentDelete = async ( evt: any ) => {
            if (cpt_fMode.value !== FMODE.EDIT as TFormMode) return

            const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.SUPPLIER, iniFormData.sName)
            if (wasConfirmed) await a_delete(iniFormData.id, iniFormData.sName)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) h_back()                       // going back if SCAPE is pressed
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
                    values: { ...formDataFromServer ?? mkSupplier() }
                })

                return
            }

            // enabling the clone, so we need to clone

            // -- resetting the identity identifier
            iniFormData.id = 0
            setFieldValue('id', 0)
            isCloning.value = true

            // -- resetting the fields that must be uniques
            setFieldValue('sName', '')
            setFieldValue('sEmail', undefined)
            setFieldValue('cell', '')
            setFieldValue('sPhone', undefined)
        }

        /**
         * Generate a VCard QR with the supplier info, son the image can be scanned
         */
        const h_formBtnAction_QR = () => {
            isModalShowing.value = true
            let names = iniFormData.contactName?.split(' ') ?? []               // stripping the contact name

            qrimage.value = mkVCardQrImg({
                name:      {
                    givenName:  names[ 0 ] ?? '',
                    familyName: `${ names[ 1 ] ?? '' } ${ names[ 2 ] ?? '' }`
                },
                work:      { role: iniFormData.sContactNotes, title: '', organization: iniFormData.sName ?? '' },
                emails:    [ { type: t('data.work'), text: iniFormData.sEmail ?? '' } ],
                phones:    [
                    { type: t('table-headers.cell'), text: iniFormData.cell ?? undefined },
                    { type: t('table-headers.land-phone'), text: iniFormData.sPhone ?? '' }
                ],
                addresses: [
                    {
                        type:     t('data.work'),
                        street:   iniFormData.sAddress,
                        code:     iniFormData.zip ?? undefined,
                        country:  iniFormData.countryCode,
                        region:   iniFormData.stateCode ?? undefined,
                        locality: st_nomenclatures.getStatesByCode(!iniFormData.stateCode ? '' : iniFormData.stateCode)
                    }
                ],
                note:      iniFormData.sInternalNotes ? { text: iniFormData.sInternalNotes } : undefined
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
         */
        const h_statGoCheck = ( entity: ENTITY_NAMES ) => {
            // TODO implement this
            console.error('Not implemented', 'go check ' + entity + ' filtered by suppliers')
        }

        /**
         * Restore a modified statistics card
         *
         * @param statics which one (to restore)
         */
        const h_staticsRestore = ( statics: string ): void => {
            // TODO implement this

            if (statics === 'tcount') console.error('Not implemented', 'PurchaseCount')
            if (statics === 'tvalue') console.error('Not implemented', 'PurchaseValue')
        }

        /**
         * This will try to request the same statistics to the server but with different
         * params
         *
         * @param subject
         * @param param
         */
        const h_changeStatsParams = ( subject: string, param: string ): void => {
            // TODO implement this

            // meaning:
            // pm = past month | py = past year | cy = current year

            if (subject === 'tcount') switch (param) {
                case 'pm':
                    console.error('implement _h_changeStatsParams_', subject, param)
                    break
                case 'py':
                    console.error('implement _h_changeStatsParams_', subject, param)
                    break
                case 'cy':
                    console.error('implement _h_changeStatsParams_', subject, param)
                    break
            }
            if (subject === 'tvalue') switch (param) {
                case 'pm':
                    console.error('implement _h_changeStatsParams_', subject, param)
                    break
                case 'py':
                    console.error('implement _h_changeStatsParams_', subject, param)
                    break
                case 'cy':
                    console.error('implement _h_changeStatsParams_', subject, param)
                    break
            }
        }

        /**
         * Handles the logic in case MultiSelect Country values changes, including clear or restore
         *
         * @param countryId Identifier of the country we want to look for
         */
        const h_countryChange = async ( countryId: string, ): Promise<void> => {
            if (!countryId) {
                hpr_clearStateSelect()
                return
            }

            await st_nomenclatures.reqNmcCountriesStates(countryId)
        }

        const h_modalVcardClosing = () => {
            isModalShowing.value = false
            qrimage.value = undefined
        }

        return {
            qrimage,
            isCloning,
            isModalShowing,

            tabs,
            iniFormData,
            activeTabId,
            statsDataCards,

            ref_selectStates,

            cpt_fMode,
            st_nomenclatures,

            h_back,
            h_tabChange,
            h_intentDelete,
            h_beforeSubmit,
            h_countryChange,
            h_keyboardKeyPress,
            h_modalVcardClosing,

            h_statGoCheck,
            h_staticsRestore,
            h_changeStatsParams,

            h_formBtnAction_QR,
            h_formBtnAction_Clone,
            h_formBtnAction_DownloadVCard,

            ENTITY_NAMES
        }

        //#endregion ==========================================================================
    }
})
</script>

<style scoped>
</style>
