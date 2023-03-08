<template>
    <div class="form-group avatar-profile-container">

        <img v-if="previewImg === undefined" class="avatar-profile" :src="avatar" alt="profile avatar">
        <img v-else class="avatar-profile" :src="previewImg" alt="profile avatar">

        <!-- INPUT -->
        <!--:v-model.value="value"-->
        <input class="form-control" ref="ref_fileInput" :name="name" type="file" @change="h_fileSelection"/>

        <div class="avatar-profile-overlay"
             :class="errorMessage === '' ? 'avatar-profile-overlay-normal' : 'avatar-profile-overlay-fix'">
            <a href="#" class="a-edit-btn-icon"><i class="tim-icons icon-camera-18"/></a>
        </div>

        <div class="">
            <label v-show="errorMessage" class="error">{{ errorMessage }}</label>
        </div>
    </div>

</template>

<script lang="ts">
// https://blog.openreplay.com/building-a-custom-file-upload-component-for-vue/
// https://therichpost.com/vuejs-vue-3-image-upload-preview-working-functionality/
// https://www.vuescript.com/file-uploader-agent/
import { computed, defineComponent, ref } from 'vue'
import { i18n } from '@/services/i18n'
import { IMG_AVATAR_NAME, RELPATH_DEFAULT_AVATAR_IMG } from '@/services/definitions'

import type { SetupContext } from 'vue'


export default defineComponent({
    name: "CmpAvatarInput",
    props: {
        name:    {
            type:        String,
            description: 'The name of the input, should be the same name using in the model / dto'
        },
        maxSize: {
            type:        Number,
            default:     5,
            required:    true,
            description: 'Maximum allowed size to be uploaded in megabytes'
        },
        statics: {
            type:        String,
            required:    true,
            description: 'Server root URL for the statics files folder'
        },
        avatar:  {
            type:        String,
            required:    true,
            description: 'The URL of the avatar profile image'
        }
    },
    setup(props, ctx: SetupContext) {

        //region  ======== DECLARATIONS & LOCAL STATE =============================================

        let ref_fileInput = ref()
        let errorMessage = ref<string>('')                                          // validation error message
        let previewImg = ref<string | ArrayBuffer | null | undefined>(undefined)    // preview image url from FileReader loader event. This are update inside the 'h_fileSelection' handler method

        const allowed_extensions = ["jpg", "jpeg", "png", "gif"]
        const { t } = i18n.global

        //endregion ===============================================================================

        //region ======== COMPUTATIONS & GETTERS ==================================================

        const avatar = computed(() => {

            if (props.avatar === '' || props.avatar == undefined) return RELPATH_DEFAULT_AVATAR_IMG
            return props.statics?.concat(props.avatar, IMG_AVATAR_NAME)

            // something like
            // http://localhost:7000/statics/media/staff/avatars/1953288944/profile_avatar.jpg
        })

        //endregion ===============================================================================

        //#region ======= FETCHING DATA & ACTIONS =================================================

        /**
         * Tries to get the BLOB / Buffer for the file / image uploaded in the file input
         */
        const a_GetAvatarPreview = async () => {

            let reader = new FileReader

            reader.onload = e => { previewImg.value = e.target?.result }        // registering the onload event on the FileReader so we can run the inner code next line when wi trigger the 'onload' event
            reader.readAsDataURL(ref_fileInput.value?.files[ 0 ])               // triggering the just register (onload) event, so we can actually get the blob of the file and saving it int the reactive variable
        }

        //#endregion ==============================================================================

        //region ======== EVENTS HANDLERS =========================================================

        const h_fileSelection = async () => {
            const _file = ref_fileInput.value?.files[0]

            // ----  validation section
            // gathering data
            let size = Math.round((_file.size / 1024 / 1024) * 100) / 100              // converting the file size to megabytes
            let extension = _file.name.split(".").pop()                                   // getting the extension

            errorMessage.value = ''                                                       // wiping the error message

            // checking the data
            if (size > props.maxSize) {
                errorMessage.value = errorMessage.value.concat(t('validation.upload-file-max-size', { size: props.maxSize }))
                return
            }

            if (!allowed_extensions.includes(extension)) {
                errorMessage.value = errorMessage.value.concat(t('validation.avatar-invalid-extension'))
                return
            }

            await a_GetAvatarPreview()

            ctx.emit('fileSelected', _file)
        }

        //endregion ===============================================================================

        return {
            props,
            avatar,
            ref_fileInput,
            errorMessage,
            previewImg,

            h_fileSelection
        }
    },
    emits: ['fileSelected']
});
</script>

<style lang="scss">
</style>


