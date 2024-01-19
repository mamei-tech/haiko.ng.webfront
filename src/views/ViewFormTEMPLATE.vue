<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">

        <CmpCard :hasFormBackBtn="true" v-on:doClick="nav_back">

          <!-- FORM -->
          <form class="form">
            <div class="row">
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
import { computed, defineComponent, onBeforeUnmount, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { KEYS, RoutePathNames } from '@/services/definitions'
import { useToast } from 'vue-toastification'
import useFactory from '@/services/composables/useFactory'
import useToastify from '@/services/composables/useToastify'
import { CmpCard, CmpFormActionsButton, CmpBasicInput, CmpCollapseItem, CmpBasicCheckbox, CmpBaseButton } from '@/components'

import type { ComputedRef } from 'vue'

export default defineComponent({
    name: 'ViewFormSuppCategories',
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

        const route = useRoute()
        const toast = useToast()                                       // The toast lib interface
        const router = useRouter()

        const { fmode, id } = route.params                              // remember, fmode (form mode) property denotes the mode this form view was called | checkout the type TFormMode in types definitions

        // html references
        // ...

        // helpers & flags
        const {  } = useFactory()
        const { tfyCRUDSuccess, tfyCRUDFail } = useToastify(toast)

        // form data
        // ...

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
        //#endregion ==========================================================================

        //region ======= COMPUTATIONS & GETTERS ===============================================

        // compute the form mode: creation mode or edition mode
        const cpt_fMode: ComputedRef<string | string[]> = computed(() => fmode)

        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
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
            console.error('submit')
        }

        const h_delete = async ( evt: any ) => {
            console.error('delete')
        }

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_back()                       // going back if SCAPE is pressed
        }

        //#endregion ==========================================================================

        //region ======== NAVIGATION ==========================================================

        const nav_back = () => {
            // router.back()
            // fill below
            // router.push({ name: RoutePathNames.roles });
        }

        //endregion ===========================================================================

        return {
            cpt_fMode,

            nav_back,
            h_delete,
            h_beforeSubmit,
            h_keyboardKeyPress
        }
    }

})
</script>

<style scoped>
</style>
