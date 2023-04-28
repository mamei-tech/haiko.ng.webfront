<template>
    <transition appear name="page-fade">
        <div class="row">
            <div class="col-12">
                <CmpCard>
                    <CmpDataTable table-type="hover"
                                  :subject="$t('entities.staff.name')"
                                  :entityMode="eMode"
                                  :columns="columns"
                                  :data="st_uom.entityPage"
                                  :has-actions="true"

                                  @navCreateIntent=""
                                  @requestIntent=""

                                  @deleteIntent="h_intentRowDelete"
                                  @editIntent=""

                                  @enableIntent=""
                                  @disableIntent=""
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
import { useSt_UoM } from '@/stores/uom'
import useToastify from '@/services/composables/useToastify'
import useDialogfy from '@/services/composables/useDialogfy'
import { HUoMTable } from '@/services/definitions/data-datatables'
import { ACTION_KIND_STR, ENTITY_NAMES, ENTITY_TYPE, OPS_KIND_STR } from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'
import { i18n } from '@/services/i18n'

import type { IColumnHeader } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListClients',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const st_uom = useSt_UoM()                                          // Pinia store for uom
        const eMode: ENTITY_TYPE = ENTITY_TYPE.COMMON

        const toast = useToast()                                            // The toast lib interface
        const columns = ref<Partial<IColumnHeader>[]>(HUoMTable)          // entity customized datatable header | As here the data for the filter is dynamically (side-effect) obtained, we need to use ref so we can fill the datas

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
            st_uom.reqStaffPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))
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
            if (objectId >= 6) {
                const entityReference = st_uom.getCatByIdFromLocalStorage(objectId)!.ucName

                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.UOMCATEGORY, entityReference, t('dialogs.uomcat-del-confirmation'))
                if (wasConfirmed) a_reqDelete( objectId , entityReference)
            }

            // telling the user
            dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-uomcat'))
        }

        //#endregion ==========================================================================

        return {
            eMode,
            st_uom,
            columns,

            h_intentRowDelete
        }
    }

})
</script>

<style scoped>
</style>
