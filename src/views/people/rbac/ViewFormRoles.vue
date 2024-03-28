<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="n_back">

          <!-- FORM -->
          <form class="form">

            <!-- id -->
            <CmpBasicInput
                disabled
                placeholder="###########"
                name="id"
                type="hidden"
            />

            <div class="row">

              <div class="col-xm-12 col-md-6">
                <!-- role name -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'entities.role.name' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.role-rname')"
                        name="rName"
                        type="text"
                    />
                  </div>
                </div>
              </div>

              <div class="col-xm-12 col-md-6">
                <!-- description -->
                <div class="row">
                  <label class="text-sm-left text-md-right col-md-3 col-form-label">
                    {{ $t( 'data.description' ) }}
                  </label>
                  <div class="col-md-9">
                    <CmpBasicInput
                        :placeholder="$t('form.placeholders.role-description')"
                        name="description"
                        type="text"
                    />
                  </div>
                </div>
              </div>

              <div class="col-xm-12 col-md-6">
                <CmpBaseButton
                    icon
                    class="mr-1"
                    buttonType="success"
                    :title="$t('btn.tip-grant-all')"
                    @doClick="h_aggregationMode(true)">
                  <i class="tim-icons icon-check-2"></i>
                </CmpBaseButton>
                <CmpBaseButton
                    icon
                    class="ml-1"
                    buttonType="danger"
                    :title="$t('btn.tip-revoke-all')"
                    @doClick="h_aggregationMode(false)">
                  <i class="tim-icons icon-simple-delete"></i>
                </CmpBaseButton>
              </div>

              <!-- permission list grouped with collapsable items -->
              <div class="col-xm-12 col-md-12">
                <CmpCollapseItem v-for="(permsDict, group) in permsByGroup" :key="group" :title="group">
                  <div v-for="(perm, permId) in permsDict" class="row" :key="permId">
                    <label class="text-sm-left text-md-right col-md-4 col-form-label">
                      <p style="font-weight: 900">{{ perm.pName }} | </p> {{ perm.description }}
                    </label>
                    <div class="col-md-8">
                      <CmpBasicCheckbox :checked="perm.isAssociated"
                                        :name="perm.pName"
                                        :identifier_a="permId + ''"
                                        :identifier_b="perm.group"
                                        :labels="[$t('others.granted'), $t('others.ungranted')]"
                                        v-on:statusChanged="h_permMod"
                      />
                    </div>
                  </div>
                </CmpCollapseItem>
              </div>

            </div>
          </form>

          <!-- FORM ACTION BUTTONS -->
          <template v-slot:footer>
            <CmpFormActionsButton
                :show-delete="cpt_fMode === 'edit'"
                v-on:saveIntent="h_beforeSubmit"
                v-on:deleteIntent="h_delete"
                v-on:cancelIntent="n_back"
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
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useSt_Rbac } from '@/stores/rbac'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton } from '@/components'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { ApiRbac } from '@/services/api/people/api-rbac'
import {
    ACTION_KIND_STR,
    ENTITY_NAMES,
    FMODE,
    KEYS, OPS_KIND_STR,
    RoutePathNames,
    VSchemaRole
} from '@/services/definitions'

import type { ComputedRef } from 'vue'
import type { TFormMode, IDtoRole, IPermAssocId, IGroupPermsDict, IPermAssoc } from '@/services/definitions'


export default defineComponent({
    name: 'ViewFormRoles',

    components: {
        CmpCard,
        CmpBasicInput,
        CmpBaseButton,
        CmpCollapseItem,
        CmpBasicCheckbox,
        CmpFormActionsButton
    },

    setup() {

        //region ======= DECLARATIONS & LOCAL STATE ===========================================

        const st_rbac = useSt_Rbac()                                    // Pinia store for rbac / roles

        const route = useRoute()
        const router = useRouter()

        const toast = useToast()                                        // the toast lib interface
        const { tfyCRUDSuccess, tfyBasicRqError, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation } = useDialogfy()

        const { fmode, id } = route.params                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions
        const { mkRole } = useFactory()

        const permsByGroup = ref<IGroupPermsDict>({})             // permission list grouped by perm group from server data
        const perms2mod = ref<{ [ key: number ]: { status: boolean, group: string } }>({})          // a register of permission to modify on the server. This is a dict using the database perm identifier as keys

        let withAggregationMode = false                                 // allow to know if either of the two aggregation buttons were clicked, comes in handy in the edition flow to prepare the data

        // !!!! we are not using reactivity for `permsToGrant` and `permsToRemove` fields for IDtoRole object.
        // The reactivity for the UI resides with `perms2mod` ref object handled by `h_permMod` method. The
        // fields mentioned above, will be filled just before submit the DTO to the backend in the CREATE or EDIT flow

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

            const roleId = cpt_fMode.value === FMODE.EDIT ? +id : 0

            // getting the perm ~ roles association
            ApiRbac.getGetPermsRoleMapAssoc(roleId).then(( data ) => {
                // group the perm list retrieved from server by 'obj.group' name in the perm list
                // so it should be easier to represent in the UI as we want to group by the server permission group field
                permsByGroup.value = data.reduce(( accumulator: IGroupPermsDict, obj: IPermAssocId ) => {
                    const key = obj.group
                    if (!accumulator[ key ]) accumulator[ key ] = {}

                    accumulator[ key ][ obj.id + '' ] = {
                        pName:        obj.pName,
                        group:        obj.group,
                        description:  obj.description,
                        isAssociated: obj.isAssociated
                        // all but the id 'cause we are using the perm id as the id
                    }
                    return accumulator
                }, {})
            })

            // normally in edition mode we get the data from the server, but as we are speaking about ROLE here, all the
            // data **should** be in the store by now, so we pull the data form the store instead.
            // ❗❗ we do this as a exploit, regarding to the fact possibly there is no more than 10 roles defined
            // in the system
            if (cpt_fMode.value === FMODE.EDIT as TFormMode) {
                const role = st_rbac.entityPage.find(r => r.id === roleId)        // getting the role from pinia store

                if(role != undefined) {
                    // this is so the form does not appear as dirty
                    // https://vee-validate.logaretm.com/v4/guide/components/handling-forms/ | resetting the form
                    resetForm({
                        values: {
                            ...role,
                            permsToGrant: [],                                           // we don't fill this data at this moment, we handle it apart with the permByGroup and perm2mod refs
                            permsToRemove: [],                                          // we don't fill this data at this moment, we handle it apart with the permByGroup and perm2mod refs
                        },
                        errors:{},
                    })
                }
            }

            window.addEventListener('keydown', h_keyboardKeyPress)                                  // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
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
         * Handles the update of the roles data and its permissions association
         *
         * @param formData data fo the roles and the perms selection coming from the from
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_edit = async ( formData: IDtoRole, isFormDirty: boolean, doWeNeedToStay: boolean ): Promise<void> => {

            // ---- preparing the data
            // I think that if we separate the perms to REMOVE off the role and the perms that need to be GRANT to the role
            // the backend do his job in a easier way so ...
            Object.entries(perms2mod.value).forEach(( [ permId, updatedPerm ] ) => {

                if (withAggregationMode) {
                    updatedPerm.status                                                                              // selecting the proper group for the perm to update
                            ? formData.permsToGrant.push(+permId)
                            : formData.permsToRemove.push(+permId)
                    // in aggregation mode, the two perm group will be synced, so there is no need to compare
                    // checking if the data change, we just iterate over the perms2mod group and use that data
                }
                else {
                    // filtering the perms that actually have not being modify, 'because
                    // it current status is the same as the initial (permsByGroup) status of the data
                    if (permsByGroup.value[ updatedPerm.group ][ permId ].isAssociated !== updatedPerm.status)      // if values are not the same as initial, then this perm actually changed so we saved in the form that that becomes the payload of the request
                    {
                        updatedPerm.status                                                                          // selecting the proper group for the perm to update
                                ? formData.permsToGrant.push(+permId)
                                : formData.permsToRemove.push(+permId)
                    }
                }

                // with this, we will have the both group synced when the iteration finished
                permsByGroup.value[ updatedPerm.group ][ permId ].isAssociated = updatedPerm.status                 // syncing permByGroup so when the form are submitted the UI (perms checked/unchecked) will properly match to the user actions in the perms
            })

            // check if we really is data to submit the data comparing if the user really change the data
            // in other words: checking the 'dirtiness' of the form
            if (formData.permsToGrant.length == 0 && formData.permsToRemove.length == 0 && !isFormDirty) {
                // nothing change, so there is nothing to submit
                if(!doWeNeedToStay) n_back()
                return
            }

            // ---- making the request | we have data that has changed
            // we normally call a store method, bet we don't be using the replied data for anything in the store, so
            // we call the method in the api class directly
            ApiRbac.updateRolePerms(+id, formData).then(() => {

                // ---- ok that was good, so now what ?
                tfyCRUDSuccess(ENTITY_NAMES.ROLE, OPS_KIND_STR.UPDATE, formData.rName)

                // so now what ?
                if(!doWeNeedToStay) n_back()                // so we are going back to the data table
                else hpr_cleanForm(formData)                //

            }).catch(err => tfyBasicRqError(err))
        }

        /**
         * Store action for the creating (request) the new entity on the backend system.
         * doWeNeedToStay => This value is related to the * type of save button in the CmpFormActionsButton:
         * APPLY or SAVE (and exit) normally
         *
         * @param formData data fo the roles and the perms selection coming from the from
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_create = async ( formData: IDtoRole, isFormDirty: boolean, doWeNeedToStay: boolean): Promise<void> => {

            // in this CREATE case, doesn't matter if the aggregation mode was clicked. As we don't have any initial
            // data other than no association, in other words: all perms association with the nonexistent role yet,
            // will be false
            Object.entries(perms2mod.value).forEach(( [ permId, updatedPerm ] ) => {
                updatedPerm.status                                                                              // selecting the proper group for the perm to update
                        ? formData.permsToGrant.push(+permId)
                        : formData.permsToRemove.push(+permId)

            })

            st_rbac.reqInsertRolePerms(formData).then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.ROLE, OPS_KIND_STR.ADDITION, formData.rName)

                // so now what ?
                if (!doWeNeedToStay) n_back()                                 // so we are going back to the data table
                else hpr_cleanForm()                                          // so wee need to clean the entire form and stay in it

            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.ADDITION))
        }

        const a_delete = ( staffId: number, entityReference: undefined | string = undefined ): void => {
            st_rbac.reqRoleDeletion({ ids: [ staffId ] })
            .then(() => {
                tfyCRUDSuccess(ENTITY_NAMES.ROLE, OPS_KIND_STR.DELETION, entityReference)
                n_back()
            }).catch(err => tfyCRUDFail(err, ENTITY_NAMES.ROLE, OPS_KIND_STR.DELETION))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, resetForm, values, setFieldValue } = useForm<IDtoRole>({
            validationSchema: VSchemaRole,
            initialValues:    mkRole(),
            initialErrors:    undefined
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================

        /**
         * Tiny helper method to clean the form and local state data, cleaning the storage / records of
         * the permission to update. Comes in handy when the user click the save / apply btn again
         *
         * @param useThisData Objet that we can use to use this data in the form after cleaning
         */
        const hpr_cleanForm = ( useThisData: IDtoRole | undefined = undefined ) => {

            withAggregationMode = false
            perms2mod.value = {}
            resetForm({
                values: {
                    ...useThisData ?? mkRole(),
                    permsToGrant: [],
                    permsToRemove: [],
                },
                errors:{},
            })
        }

        //endregion ===========================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===========================================

        /**
         * This method tries to accommodate the data before it will send to the server to update the permission of the role
         * Basically, filter the perms2mod record with the data it was actually changed and allocate in 2 groups
         * (remove & grant) the perms that has changed.
         *
         * @param evt
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = (evt: Event, doWeNeedToStay: boolean) => {
            evt.preventDefault()

            handleSubmit(formData => {
                if (cpt_fMode.value == (FMODE.CREATE as TFormMode)) a_create(formData, meta.value.dirty, doWeNeedToStay)
                if (cpt_fMode.value == (FMODE.EDIT as TFormMode)) a_edit(formData, meta.value.dirty, doWeNeedToStay)
                // if (cpt_fMode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) n_back()
            }).call(this)
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) n_back()                       // going back if SCAPE is pressed
        }

        /**
         * Update the the register of permission to be modified on the server. This is the method that
         * handles the callback when the the 'statusChanged' event of CmpBasicCheckbox if fired.
         *
         * @param permName The name of the permission. This name can serve as unique key as it is unique on the database
         * @param isCheck The estatus fo the checkbox component, saying if the perm need to be active or not
         * @param permId Permission identifier
         * @param permGroup The group the perm belong to
         */
        const h_permMod = (permName:string | undefined, isCheck: boolean, permId: string | undefined, permGroup:string | undefined) => {

            if (permId !== undefined && permGroup !== undefined)
                perms2mod.value[ +permId ] = { status: isCheck, group: permGroup as string }
        }

        /**
         * Handles the manipulation of the data when the aggregation button ara used, so the UI can
         * represents the changes (mark all / remove all) in a properly manner
         *
         * @param toGrant boolean value coming from the event, which btn was clicked so we kno if we need to mark all or remove all
         */
        const h_aggregationMode = ( toGrant: boolean ) => {
            withAggregationMode = true

            Object.entries(permsByGroup.value as IGroupPermsDict).forEach(( [ group, permsDict ] ) => {
                Object.entries(permsDict as { [ key: string ]: IPermAssoc }).forEach(( [ permId, perm ] ) => {
                    perms2mod.value[ +permId ] = { status: toGrant, group: group }
                    permsByGroup.value[group][permId].isAssociated = toGrant
                })
            })
        }

        const h_delete = async ( evt: any ) => {
            if (fmode as TFormMode == FMODE.EDIT) {                                     // 'cause we can deleted something isn't created yet ... (remember we reuse this view for edition too, so we need to check which mode we currently are)

                const roleName = st_rbac.getRoleByIdFromLocalStorage(+id)?.rName ?? ''

                const isOk = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.ROLE, roleName)
                if (isOk) a_delete(+id, roleName)                                       // The 'id' comes from url params (vue router we mean)
            }
        }

        //endregion ===========================================================================

        //region ======= NAVIGATION ===========================================================

        const n_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.roles });
        }

        //endregion ===========================================================================

        return {
            cpt_fMode,

            permsByGroup,

            // to delete from return
            perms2mod,

            n_back,
            h_delete,
            h_permMod,
            h_beforeSubmit,
            h_aggregationMode,
            h_keyboardKeyPress
        }
    }
})
</script>

<style scoped>
</style>
