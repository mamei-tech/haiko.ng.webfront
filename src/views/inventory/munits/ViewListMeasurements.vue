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
                        :has-search="false"
                        :has-page-size-selector="false"

                        @editIntent="nav_2Form"
                        @navCreateIntent="nav_2Form"
                        @deleteIntent="h_intentRowDelete"
          >
          </CmpDataTable>
        </CmpCard>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue'
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
    DT_ACTION_BUTTON_MODE, KEYS,
} from '@/services/definitions'
import { CmpCard, CmpDataTable } from '@/components'

import type { IColumnHeader, TFormMode, IIndexable } from '@/services/definitions'


export default defineComponent({
    name: 'ViewListUoMCat',
    components: { CmpCard, CmpDataTable },
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const { t } = i18n.global

        const toast = useToast()                                                            // The toast lib interface
        const st_uom = useSt_UoM()                                                          // Pinia store for uom
        const router = useRouter()

        const abar_mode: DT_ACTIONBAR_MODE = DT_ACTIONBAR_MODE.JC                        // datatable action bar mode
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
            st_uom.reqUoMCatPages().catch(err => tfyCRUDFail(err, ENTITY_NAMES.STAFF, OPS_KIND_STR.REQUEST))    // getting the uom categories list data for populating the datatable (side effect)
            window.addEventListener('keydown', h_keyboardKeyPress)                                        // keyboard keys event handler, we need to clean this kind of event when the component are destroyed
        })

        /**
         * Vue hook before component is unmounted from the DOM
         */
        onBeforeUnmount(() => {
            window.removeEventListener('keydown', h_keyboardKeyPress)            // cleaning the event manually added before to the document. Wee need to keep the things as clean as posible
        })

        //endregion ===========================================================================

        //#region ======= FETCHING DATA & ACTIONS ===============================================

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

        //region ======= NAVIGATION ===========================================================

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        /**
         * Navigation handler method to jump to the entity formulary view
         *
         * @param mode To setting up the formulary view of the entity. Could be CREATION mode or EDITION mode
         * @param rowData
         */
        const nav_2Form = (mode: TFormMode = FMODE.CREATE, rowData: IIndexable | undefined = undefined ) => {

            const params = mode == FMODE.CREATE
                ? { fmode: mode }
                : { fmode: mode, id: rowData?.id }

            router.push({
                name:   RoutePathNames.muForm,
                params: params
            })
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        const h_intentRowDelete = async ( entityId: number ): Promise<void> => {
            // we don't allow to delete the default categories, so we proceed only for above the 6th uom category
            if (entityId > 6) {
                const entityReference = st_uom.getCatByIdFromLocalStorage(entityId)!.ucName

                const wasConfirmed = await dfyConfirmation(ACTION_KIND_STR.DELETE, ENTITY_NAMES.UOMCATEGORY, entityReference, t('dialogs.uomcat-del-confirmation'))
                if (wasConfirmed) a_reqDelete( entityId , entityReference)
            }
            else dfyShowAlert(t('dialogs.title-alert-not-allowed'),  t('dialogs.cant-delete-default'))          // telling the user
        }

        //#endregion ==========================================================================

        return {
            abar_mode,
            abutton_mode,

            st_uom,
            columns,

            nav_2Form,

            h_intentRowDelete
        }
    }

})
</script>

<style scoped>
</style>
