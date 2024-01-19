<template>
  <transition appear name="page-fade">
    <div class="row">
      <div class="col-12">
        <h2>This is the production central view, BoM in this case</h2>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { KEYS, RoutePathNames } from '@/services/definitions'


export default defineComponent({
    name: 'ViewBoM',
    components: {},
    setup() {

        //#region ======= DECLARATIONS & LOCAL STATE ==========================================

        const router = useRouter()

        //#endregion ==========================================================================

        //region ======= HOOKS ================================================================

        /**
         * Vue hook before component is mounted in the DOM
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

        //#region ======= COMPUTATIONS & GETTERS ==============================================
        //#endregion ==========================================================================

        //region ======= HELPERS ==============================================================
        //#endregion ==========================================================================

        //region ======== NAVIGATION ==========================================================

        const nav_2Hub = () => {
            // router.back()
            router.push({ name: RoutePathNames.hub });
        }

        //endregion ===========================================================================

        //#region ======= EVENTS HANDLERS & WATCHERS ==========================================

        const h_keyboardKeyPress = ( evt: any ) => {
            if (evt.key === KEYS.ESCAPE) nav_2Hub()
        }

        //#endregion ==========================================================================

        return {}
    }

})
</script>

<style scoped>
</style>
