<template>
    <div class="label-container">
        <h1 class="label-justify">HAIKO</h1>
        <h5 class="label-justify" style="font-style: italic">others.adm-system</h5>
    </div>

    <CmpCard card-type="auto-margin">
        <form>
            <div class="form-group">
                <CmpBasicInput
                        id="user"
                        name="username"
                        type="text"
                        :placeholder="'data.ph-user'"
                />
            </div>
            <div class="form-group has-label">
                <CmpBasicInput
                        id="password"
                        name="password"
                        type="password"
                        :placeholder="'data.ph-pass'"
                        v-on:keydown.enter="hLoginIntent"
                />
            </div>
        </form>

        <template v-slot:footer>
            <CmpBaseButton block button-type="primary" @doClick.prevent="hLoginIntent">
                btn.val-login
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
import { VSCHEMA } from '@/views/auth/validation'
import { RoutePathNames } from '@/services/definitions/route-paths'
import { useAuthStore } from '@/stores/auth'

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

        const authStore = useAuthStore()
        const router = useRouter()
        const toast = useToast() // The toast lib interface

        const { tfyAuthFail } = useToastify(toast)
        const { cap } = useCommon()
        const { handleSubmit } = useForm<IAuthFormData>({ validationSchema: VSCHEMA })

        //endregion =============================================================================

        //region ======== ACTIONS ===============================================================

        const aReqAccess = ( data: IAuthFormData ) => {
            authStore.reqLogin(data)
            .then(() => { goToDashboard() })
            .catch(error => { tfyAuthFail(error) })
        }

        //endregion =============================================================================

        //region ======== NAVIGATION ============================================================

        const goToDashboard = () => {
            router.push({ name: RoutePathNames.dashboard })
        }

        //endregion =============================================================================

        //region ======== EVENTS HANDLERS =======================================================

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

.label-justify {
    text-align : center;
}

.label-container {
    margin : auto;
    width  : 40%;
}
</style>
