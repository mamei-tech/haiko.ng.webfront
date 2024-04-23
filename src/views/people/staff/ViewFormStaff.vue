<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- FORM -->
          <form class="form-horizontal">
            <div class="row">
              <div class="col-xm-12 col-md-6">
                <h4 class="text">{{ $t( 'form.section.staff-information' ) }}</h4>

                <!-- id -->
                <div class="row">
                  <div class="col-md-9">
                    <CmpBasicInput
                        disabled
                        placeholder="###########"
                        name="id"
                        type="hidden"
                    />
                  </div>
                </div>

                <!-- firstname -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.firstname' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.staff-firstname')"
                        name="firstName"
                        type="text"
                    />
                  </div>
                </div>

                <!-- lastname -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.lastname' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.staff-lastname')"
                        name="lastName"
                        type="text"
                    />
                  </div>
                </div>

                <!-- username -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.username' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.username')"
                        name="username"
                        type="text"
                    />
                  </div>
                </div>

                <!-- username -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.email' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.email')"
                        name="email"
                        type="text"
                    />
                  </div>
                </div>

                <!-- cell -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'form.fields-common.cell' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        placeholder="### ## ### ## ##"
                        name="cell"
                        type="number"
                    />
                  </div>
                </div>

                <!-- role -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.role.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpMultiselectField placeholder="- rol - "
                                         :options="st_nomenclatures.getRoles4Select"
                                         name="roleId"
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

                <!-- isActive / status -->
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

                <!-- change / set password -->
                <div class="row" @click.prevent="h_toggleCollapsable">
                  <h5 class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{
                      cpt_fMode === 'edit' ? $t( 'form.fields-common.change-password' ) : $t( 'form.fields-common.set-password' )
                    }}
                  </h5>
                  <div class="col-md-9">
                    <i class="tim-icons icon-minimal-down caret-form-section"
                       :class="hpr_rotationCaretClass" />
                  </div>
                  <hr class="collapsable-form-section-divisor">
                </div>
                <Transition name="collapsable">
                  <div class="collapsable-div" v-if="hpr_doWeShowCollapsable">
                    <div class="row">
                      <label class="text-sm-left text-md-right col-md-3 col-form-label">
                        {{ $t( 'form.fields-common.password' ) }}
                      </label>
                      <div class="col-md-9">
                        <CmpBasicInput
                            placeholder="**************"
                            name="password"
                            type="password"
                            ref="password"
                        />
                      </div>
                    </div>

                    <div class="row">
                      <label class="text-sm-left text-md-right col-md-3 col-form-label">
                        {{ $t( 'form.fields-common.password-confirm' ) }}
                      </label>
                      <div class="col-md-9">
                        <CmpBasicInput
                            placeholder="**************"
                            name="passwordConf"
                            type="password"
                            data-vv-as="password"
                        />
                      </div>
                    </div>
                  </div>
                </Transition>

              </div>

              <div class="col-xs-12 col-md-6">
                <div class="row justify-content-center avatar-div-component-holder">

                  <CmpImageInput
                      name="avatarImg"
                      :avatar-mode="true"
                      :statics="configStatic"
                      :image="values.avatarPath"
                      :max-size="5"
                      v-on:fileSelected="h_avatarChange"
                      v-on:removePicture="h_removePicture"

                      v-on:restore="h_restoreForceImgDelOnCmp"
                      :parent-del-intent="forceImgDelOnCmp"
                  />

                </div>
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
import { onBeforeUnmount } from 'vue'
import { useToast } from 'vue-toastification'
import { useSt_Staff } from '@/stores/staff'
import { useSt_Nomenclatures } from '@/stores/nomenc'
import { ApiStaff } from '@/services/api/people/api-staff'
import { i18n } from '@/services/i18n'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { computed, onMounted, ref, defineComponent, reactive } from 'vue'
import { Field, useForm } from 'vee-validate'
import { useRoute, useRouter } from 'vue-router'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpVeeCheckbox, CmpMultiselectField, CmpImageInput } from '@/components'
import { FMODE, RoutePathNames, VSchemaStaffCreate, VSchemaStaffEdit, ENTITY_NAMES, OPS_KIND_STR, ACTION_KIND_STR, KEYS } from '@/services/definitions'

import type { ComputedRef } from 'vue'
import type { IDtoStaff, TFormMode } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormStaff',
    components: {
        Field,
        CmpCard,
        CmpBasicInput,
        CmpImageInput,
        CmpVeeCheckbox,
        CmpMultiselectField,
        CmpFormActionsButton
    },
    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const { t } = i18n.global
        const route = useRoute()
        const router = useRouter()

        const st_staff = useSt_Staff()                                      // pinia store for staff
        const st_nomenclatures = useSt_Nomenclatures()                      // pinia store for nomenclatures
        const { fmode, id } = route.params                                  // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        const toast = useToast()                                            // the toast lib interface
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()
        const { mkStaff } = useFactory()

        const forceImgDelOnCmp = ref<Boolean>(false)                 // so we can tell to the image component 'CmpImageInput' to remove the image if we need to
        let formDataFromServer: IDtoStaff | undefined = undefined          // aux variable to save entity data requested from the server
        // const rolesData = ref<IMultiselectBasic[]>([])                  // I will use ref 'cause is only one nested object

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

            // ---- edition mode ----
            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                formDataFromServer = await ApiStaff.getStaffById(+id)

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
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param newStaff payload with the data for the request
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = ( newStaff: IDtoStaff, doWeNeedToStay: boolean): void => {
            st_staff.reqInsertStaff(newStaff).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.STAFF, OPS_KIND_STR.ADDITION, newStaff.firstName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()                                  // so we are going back to the data table
                else {                                                        // so wee need to clean the entire form and stay in it
                    resetForm({ values: mkStaff() })
                    h_removePicture(true)                               // forcing image deletion no matter what
                }

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.ADDITION))
        }

        /**
         * Action for edit the user
         * @param editedStaff Staff object containing the edited information
         * @param doWeNeedToStay This value, in this context, tells if the clicked button was the 'Applied' or the 'Save'
         */
        const a_edit = ( editedStaff: IDtoStaff, doWeNeedToStay: boolean ): void => {

            if(!editedStaff.avatarPath ) delete editedStaff.avatarPath

            st_staff.reqStaffUpdate(editedStaff).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.STAFF, OPS_KIND_STR.UPDATE, editedStaff.firstName)

                // so now what ?
                if(!doWeNeedToStay) nav_back()                                  // so we are going back to the data table

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.UPDATE))
        }

        const a_delete = ( staffId: number, entityReference: undefined | string = undefined ): void => {
            st_staff.reqStaffDeletion({ ids: [ staffId ] })
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.STAFF, OPS_KIND_STR.DELETION, entityReference)
                nav_back()
            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.DELETION))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, setValues, setFieldValue, resetForm, values } = useForm<IDtoStaff>({
            validationSchema: fmode === FMODE.CREATE as TFormMode ? VSchemaStaffCreate : VSchemaStaffEdit,
            initialValues:    mkStaff(),
            initialErrors:    undefined
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================

        const hpr_rotationCaretClass = ref('')                                       // rotate the caret | this is the CSS alternative, no Vue transition needed
        const hpr_doWeShowCollapsable = ref(cpt_fMode.value === FMODE.CREATE)       // start the animation of the actual collapsible

        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        const h_toggleCollapsable = () => {
            hpr_doWeShowCollapsable.value = !hpr_doWeShowCollapsable.value
            hpr_rotationCaretClass.value === 'rotate-up' ? hpr_rotationCaretClass.value = 'rotate-down' : hpr_rotationCaretClass.value = 'rotate-up'
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
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && meta.value.dirty) a_edit(formData, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) nav_back()               // was no changes (no dirty) with the data, so going back normally
            }).call(this)
        }

        const h_delete = async ( evt: any ) => {

            if (fmode as TFormMode == FMODE.EDIT) {                                     // 'cause we can deleted something isn't created yet ... (remember we reuse this view for edition too, so we need to check which mode we currently are)
                const isOk = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.STAFF, formDataFromServer!.firstName)
                if (isOk) a_delete(+id, formDataFromServer!.firstName)                  // The 'id' comes from url params (vue router we mean)
            }
        }

        // const h_keyboardKeyPress = (event: Event) => {
        const h_keyboardKeyPress = ( evt: any ) => {
            if(evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        // TIP ❗❗ perhaps we can replace this with the v-model way (two-way data binding) as you do with the other inputs see the note around line 297 in the 'onMounted' method. If so I think we don't need the others image method around this
        const h_avatarChange = (f: any) => setFieldValue('avatarImg', f)

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
                if(formDataFromServer?.avatarPath === undefined || formDataFromServer?.avatarPath === '') return        // if there is NO data on server, we do nothing
                dfyShowAlert(t('dialogs.title-alert'), t('dialogs.img-rm-alert'))                                       // if there is data (profile picture in this particular case) we need to alert the user the image will be complete completely on server if the user click apply or save btns
            }
            else forceImgDelOnCmp.value = true                                                                          // this line will tell to the 'CmpImageInput' that we want to delete de image

            // actual removing the image
            setFieldValue('avatarImg', undefined)                                                                       // I don't know if this is needed here
            setFieldValue('avatarPath', undefined)
        }

        //endregion ===========================================================================

        //region ======= NAVIGATION ===========================================================

        const nav_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.staff });
        }

        //endregion ===========================================================================

        return {
            values,
            forceImgDelOnCmp,

            hpr_doWeShowCollapsable,
            hpr_rotationCaretClass,

            cpt_fMode,
            st_nomenclatures,

            nav_back,

            h_delete,
            h_beforeSubmit,
            h_keyboardKeyPress,
            h_toggleCollapsable,

            h_avatarChange,
            h_removePicture,
            h_restoreForceImgDelOnCmp,

            configStatic: appConfig.server.statics
        }
    }
})
</script>

<style scoped>
</style>
