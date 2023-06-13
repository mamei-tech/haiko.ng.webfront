<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.uomcatetgory.name')"

                                  :action-bar-mode="abar_mode"
                                  :action-btn-mode="abutton_mode"

                                  :columns="columns"
                                  :data="st_uom.entityPage"
                                  :has-actions="true"

                                  @navCreateIntent="h_navCreateUoMCatIntent"
                                  @editIntent="h_navEditUoMCatIntent"
                                  @deleteIntent="h_intentRowDelete"
                    >
                    </CmpDataTable>
                </CmpCard>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { i18n } from '@/services/i18n'
import { useRouter } from 'vue-router'
import { useSt_UoM } from '@/stores/uom'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import {
    ACTION_KIND_STR,
    ENTITY_NAMES,
    DT_ACTIONBAR_MODE,
    FMODE,
    OPS_KIND_STR,
    HUoMCatTable,
    RoutePathNames,
    DT_ACTION_BUTTON_MODE,
} from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'

import type { IColumnHeader, TFormMode, IDtoUoMCategory } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListUoMCat',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const toast = useToast()                                                            // The toast lib interface
        const st_uom = useSt_UoM()                                                          // Pinia store for uom
        const router = useRouter()

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.NOEJC                        // datatable action bar mode
        const abutton_mode: DT_ACTION_BUTTON_MODE = DT_ACTION_BUTTON_MODE.JEDINDEL          // datatable button mode
        const columns = ref<Partial<IColumnHeader>[]>(HUoMCatTable)                         // entity customized datatable header | As here the data for the filter is dynamically (side-effect) obtained, we need to use ref so we can fill the datas

        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)
        const { dfyConfirmation, dfyShowAlert } = useDialogfy()

        //#endregion ==========================================================================

        //region ======= HOOKS ================================================================

        /**
         * setup is called before component creation, so the onMounted hook is a good time / place to
         * invoke data population method through web API request.
         *
         * Manually setting the needed values is way cleaner than the other way around. This is needed mainly because api call is asynchronous.
         */
        onMounted(() => {

            // getting the uom categories list data for populating the datatable (side effect)
            st_uom.reqUoMCatPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA ACTIONS ===============================================
        //#endregion ==========================================================================

        //#region ======= ACTIONS =============================================================

        /**
         * Request the deletion (from server) of an entity according with the given identifier
         *
         * @param id UoM category identifier
         * @param ref Subject Entity reference e.g identifier, name or something like that
         */
        const a_reqDelete = async ( id: number, ref: undefined | string = undefined ): Promise<void> => {

            st_uom.reqUoMCatDeletion(id)
            .then(() => {tfyCRUDSuccess(ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.DELETION, ref)})
            .catch(err => tfyCRUDFail(err, ENTITY_NAMES.UOMCATEGORY, OPS_KIND_STR.DELETION, ref))
        }

        //#endregion ==========================================================================

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //#region ======= EVENTS HANDLERS =====================================================

        const h_intentRowDelete = async ( objectId: number ): Promise<void> => {
            // we don't allow to delete the default categories, so we proceed only for above the 6th uom category
            if (objectId > 6) {
                const entityReference = st_uom.getCatByIdFromLocalStorage(objectId)!.ucName

                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.UOMCATEGORY, entityReference, t('dialogs.uomcat-del-confirmation'))
                if (wasConfirmed) a_reqDelete( objectId , entityReference)
            }
            else dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-default'))          // telling the user
        }

        const h_navCreateUoMCatIntent = (): void => {
            router.push({
                name:   RoutePathNames.muCreate,
                params: {
                    fmode: FMODE.CREATE as TFormMode
                    // id   : '', no need for passing ID on creation mode
                }
            })
        }

        /**
         * Handler for the intent of edit a record from the table
         * @param rowData data of the row
         */
        const h_navEditUoMCatIntent = ( rowData: IDtoUoMCategory ): void => {
            router.push({
                name:   RoutePathNames.muEdit,
                params: {
                    fmode: FMODE.EDIT as TFormMode,
                    id:    rowData.id
                }
            })
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            st_uom,
            columns,

            h_intentRowDelete,
            h_navEditUoMCatIntent,
            h_navCreateUoMCatIntent
        }
    }

})
</script>

<style scoped>
</style>
