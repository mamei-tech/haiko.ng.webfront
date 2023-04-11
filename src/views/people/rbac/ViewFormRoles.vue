<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">

                <CmpCard :hasFormBackBtn="true" v-on:doClick="h_back">

                    <!-- FORM -->
                    <form class="form">
                        <div class="row">

                            <div class="col-xm-12 col-md-6">
                                <!-- id -->
                                <div class="row">
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                disabled
                                                placeholder="###########"
                                                name="id"
                                                type="hidden"
                                                v-model="iniFormData.id"
                                        />
                                    </div>
                                </div>

                                <!-- role name -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t("entities.role.name") }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.role-rname')"
                                                name="rName"
                                                type="text"
                                                v-model="iniFormData.rName"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="col-xm-12 col-md-6">

                                <!-- ust for padding 'cause the hidden id field -->
                                <div class="row">
                                    <div class="form-group"></div>
                                </div>

                                <!-- description -->
                                <div class="row">
                                    <label class="text-sm-left text-md-right col-md-3 col-form-label">
                                        {{ $t("data.Description") }}
                                    </label>
                                    <div class="col-md-9">
                                        <CmpBasicInput
                                                :placeholder="$t('form.placeholders.role-description')"
                                                name="description"
                                                type="text"
                                                v-model="iniFormData.description"
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
                                :show-delete="cmptdFmode === 'edit'"
                                v-on:saveIntent="h_beforeSubmit"
                                v-on:deleteIntent=""
                                v-on:cancelIntent="h_cancel"
                        />
                    </template>
                </CmpCard>

            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { onMounted, defineComponent } from 'vue'
import { useToast } from 'vue-toastification'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useSt_Rbac } from '@/stores/rbac'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton } from '@/components'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import { ApiRbac } from '@/services/api/api-rbac'
import {
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
        const { tfyCRUDSuccess, tfyBasicRqError } = useToastify(toast)
        const { fmode, id } = route.params                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions
        const { mkRole } = useFactory()

        const iniFormData = ref<IDtoRole>(mkRole())                     // initial form data

        const permsByGroup = ref<IGroupPermsDict>({})              // permission list grouped by perm group from server data
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

            // getting the perm ~ roles association
            ApiRbac.getGetPermsRoleMapAssoc(+id).then(( data ) => {
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
            if (cmptdFmode.value === FMODE.EDIT as TFormMode) {
                const role = st_rbac.entityPage.filter(r => r.id === +id)[0]        // getting the role from store

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
                // iniFormData.value = {... role}                                   // this is an alternative, but vee-validate will see the form as dirty
                // setValues(role)                                                  // this is an alternative, but vee-validate will see the form as dirty
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

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS =============================================

        /**
         * Handles the update of the roles data and its permissions association
         *
         * @param formData data fo the roles and the perms selection coming from the from
         * @param isFormDirty tells is form is dirty (has change in the vee-validate controlled inputs)
         * @param doWeNeedToStay Tell us where to go after the successfully creation of the entity
         */
        const a_Edit = async ( formData: IDtoRole, isFormDirty: boolean, doWeNeedToStay: boolean ): Promise<void> => {

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
                if(!doWeNeedToStay) h_back()
                return
            }

            // ---- making the request | we have data that has changed
            // we normally call a store method, bet we don't be using the replied data for anything in the store, so
            // we call the method in the api class directly
            ApiRbac.updateRolePerms(+id, formData).then(() => {

                // ---- ok that was good, so now what ?
                tfyCRUDSuccess(ENTITY_NAMES.ROLE, OPS_KIND_STR.UPDATE, formData.rName)
                if(!doWeNeedToStay) h_back()                                  // so we are going back to the data table

                // cleaning the storage / records of the permission to update. Comes in handy when the user click the save / apply btn again
                withAggregationMode = false
                perms2mod.value = {}
                resetForm({
                    values: {
                        ...formData,
                        permsToGrant: [],
                        permsToRemove: [],
                    },
                    errors:{},
                })

            }).catch(err => tfyBasicRqError(err))
        }

        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cmptdFmode: ComputedRef<string | string[]> = computed(() => fmode)

        // getting the vee validate method to manipulate the form related actions from the view
        const { handleSubmit, meta, resetForm } = useForm<IDtoRole>({
            validationSchema: VSchemaRole,
            initialValues:    iniFormData,
            initialErrors:    undefined
        })

        //endregion ===========================================================================

        //region ======= HELPERS ==============================================================
        //endregion ===========================================================================

        //region ======== EVENTS HANDLERS & WATCHERS ==========================================

        /**
         * This method tries to accommodate the data before it will send to the server to update the permission of the role
         * Basically, filter the perms2mod record with the data it was actually changed and allocate in 2 groups
         * (remove & grant) the perms that has changed.
         *
         * @param event
         * @param doWeNeedToStay This is a boolean data coming from our Vue UI custom component (CmpFormActionsButton in this case). Tell us where to go after the successfully creation of the entity
         */
        const h_beforeSubmit = (event: Event, doWeNeedToStay: boolean) => {
            event.preventDefault()

            handleSubmit(formData => {
                if (cmptdFmode.value == (FMODE.CREATE as TFormMode))  console.log('to create action')
                if (cmptdFmode.value == (FMODE.EDIT as TFormMode)) a_Edit(formData, meta.value.dirty, doWeNeedToStay)
                // if (cmptdFmode.value == (FMODE.EDIT as TFormMode) && !meta.value.dirty) h_back()
            }).call(this)
        }

        const h_keyboardKeyPress = (event: any) => {
            if(event.key === KEYS.ESCAPE) h_back()                       // going back if SCAPE is pressed
        }

        const h_back = () => {
            // router.back()
            router.push({ name: RoutePathNames.roles });
        }

        const h_cancel = () => {
            router.push({ name: RoutePathNames.roles });
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


        //endregion ===========================================================================

        return {
            cmptdFmode,
            iniFormData,
            permsByGroup,

            // to delete from return
            perms2mod,

            h_back,
            h_cancel,
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