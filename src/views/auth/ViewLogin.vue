<template>

  <div class="label-container">
    <h1 class="label-justify main-title">HAIKO</h1>
    <h5 class="label-justify main-title-description" style="font-style: italic">Sistema de Administración</h5>
  </div>

  <CmpCard card-type="auto-margin">
    <form>
      <div class="form-group">
        <CmpBasicInput
            id="user"
            name="username"
            type="text"
            :placeholder="$t('form.placeholders.user')"
        />
      </div>
      <div class="form-group has-label">
        <CmpBasicInput
            id="password"
            name="password"
            type="password"
            :placeholder="$t('form.placeholders.pass')"
            v-on:keydown.enter="hLoginIntent"
        />
      </div>
    </form>

    <template v-slot:footer>
      <CmpBaseButton block button-type="primary" @doClick.prevent="hLoginIntent">
        {{ cap( $t( 'btn.val-login' ) ) }}
      </CmpBaseButton>
    </template>
  </CmpCard>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { useToast } from 'vue-toastification'
import { CmpBaseButton, CmpBasicInput, CmpCard } from '@/components'
import { VSchemaAuth } from '@/services/definitions'
import { RoutePathNames } from '@/services/definitions/route-paths'
import { useSt_Auth } from '@/stores/auth'

import type { IAuthFormData } from '@/services/definitions/types-forms'

import useToastify from '@/services/composables/useToastify'
import useCommon from '@/services/composables/useCommon'


export default defineComponent({
    name:       'LoginView',
    components: {
        CmpCard,
        CmpBaseButton,
        CmpBasicInput
    },
    setup() {

        //region ======== DECLARATIONS & LOCAL STATE ============================================

        const st_auth = useSt_Auth()
        const router = useRouter()
        const toast = useToast() // The toast lib interface

        const { tfyAuthFail } = useToastify(toast)
        const { cap } = useCommon()
        const { handleSubmit } = useForm<IAuthFormData>({ validationSchema: VSchemaAuth })

        //endregion =============================================================================

        //#region ======= FETCHING DATA & ACTIONS ===============================================

        const aReqAccess = ( data: IAuthFormData ) => {
            st_auth.reqLogin(data)
            .then(() => { goToModuleHub() })
            .catch(error => { tfyAuthFail(error) })
        }

        //endregion =============================================================================

        //region ======== NAVIGATION ============================================================

        const goToModuleHub = () => {
            router.push({ name: RoutePathNames.hub })
        }

        //endregion =============================================================================

        //region ======= EVENTS HANDLERS & WATCHERS =============================================

        const hLoginIntent = handleSubmit(formData => {
            aReqAccess(formData)
        })

        //endregion =============================================================================

        return {
            hLoginIntent,

            cap
        }
    }
})
</script>

<style scoped lang="scss">
h5 {
    margin-bottom : 26px;
}

.main-title {
    margin-bottom: 12px;
}

.main-title-description {
    margin-bottom: 6%;
}

.label-justify {
    text-align : center;
}

.label-container {
    margin : auto;
    width  : 40%;
}
</style>
