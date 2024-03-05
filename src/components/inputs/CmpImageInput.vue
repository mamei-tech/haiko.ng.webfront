<template>

  <!-- btn to remove the image -->
  <!--<div v-if="(previewImg !== null && previewImg !== undefined) || cmp_image !== RELPATH_DEFAULT_AVATAR_IMG">-->
  <div class="rm-btn-avatar-container" v-if="shallWeShowRmBtn">
    <button type="button" class="btn btn-round btn-icon btn-fab btn-default"
            v-on:click="h_removeImage"
            :title="$t('btn.tip-rm-picture')"
    >
      <i class="tim-icons icon-trash-simple"></i>
    </button>
  </div>

  <!-- profile image container -->
  <div class="form-group avatar-profile-container">

    <img v-if="previewImg === undefined" class="avatar-profile" :src="cmp_image" alt="profile avatar"
         :style="!avatarMode ? 'border-radius: 0% !important;' : ''">
    <img v-else class="avatar-profile" :src="previewImg" alt="profile avatar"
         :style="!avatarMode ? 'border-radius: 0% !important;' : ''">

    <!-- INPUT -->
    <!--:v-model.value="value"-->
    <input class="form-control" ref="ref_fileInput" :name="name" type="file" @change="h_fileSelection" />

    <div class="avatar-profile-overlay"
         :class="errorMessage === '' ? 'avatar-profile-overlay-normal' : 'avatar-profile-overlay-fix'"
         :style="!avatarMode ? 'border-radius: 0% !important;' : ''">
      <a href="#" class="a-edit-btn-icon"><i class="tim-icons icon-camera-18" /></a>
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
import { computed, defineComponent, ref, watch } from 'vue'
import { i18n } from '@/services/i18n'
import {
    IMG_ORG_AVATAR_NAME,
    IMG_ORG_PRODUCT_NAM,
    RELPATH_DEFAULT_AVATAR_IMG,
    RELPATH_DEFAULT_PRODUCT_IMG
} from '@/services/definitions'

import type { SetupContext } from 'vue'


export default defineComponent({
    name: "CmpImageInput",
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
        image:  {
            type:        String,
            required:    true,
            description: 'The URL of the image profile image'
        },
        avatarMode: {
            type:        Boolean,
            default:     false,
            description: 'Define that the component should behave and appears as a Profile Avatar image input'
        },
        parentDelIntent: {
            type:        Boolean,
            default:     false,
            description: 'A control props to know if there is any intent of image deletion coming from a parent component'
        }
    },
    setup(props, ctx: SetupContext) {

        //region  ======== DECLARATIONS & LOCAL STATE =============================================

        let ref_fileInput = ref()
        let errorMessage = ref<string>('')                                          // validation error message
        let previewImg = ref<string | ArrayBuffer | null | undefined>(undefined)    // preview image url from FileReader loader event. This are update inside the 'h_fileSelection' handler method
        let shallWeShowRmBtn = ref<boolean>(false)

        // const allowed_extensions = ["jpg", "jpeg", "png", "gif"]
        const allowed_extensions = ["jpg", "jpeg", "png"]
        const { t } = i18n.global

        //endregion ===============================================================================

        //region ======== COMPUTATIONS & GETTERS ==================================================

        const cmp_image = computed(() => {

            if (props.image === '' || props.image == undefined)
                return props.avatarMode ? RELPATH_DEFAULT_AVATAR_IMG : RELPATH_DEFAULT_PRODUCT_IMG

            shallWeShowRmBtn.value = true
            return props.statics?.concat(props.image, props.avatarMode ? IMG_ORG_AVATAR_NAME : IMG_ORG_PRODUCT_NAM)

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

            shallWeShowRmBtn.value = true;                                      // showing the remove img btn
        }

        //#endregion ==============================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===============================================

        /**
         * This method contains the logic for erasing the image
         *
         * @param withEmit a control param so we can run this logic without the emission, if we don't need to tell the parent component
         */
        const h_removeImage = async (withEmit = true) => {

            ref_fileInput.value.files = undefined;
            previewImg.value = props.avatarMode ? RELPATH_DEFAULT_AVATAR_IMG : RELPATH_DEFAULT_PRODUCT_IMG

            shallWeShowRmBtn.value = false                                      // hiding the remove img btn
            if (withEmit) ctx.emit('removePicture')
        }

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

            // rendering the preview
            await a_GetAvatarPreview()

            ctx.emit('fileSelected', _file)
        }

        /**
         * We need to check 'props.parentDelIntent' value changes, so we notice a parent intent to delete the image, and set the default image placeholder on the UI
         */
        watch(() => [ props.parentDelIntent ], () => {
            if (!props.parentDelIntent) return    // if isn't a paren component image deletion intent, we can move no touching nothing, so the logic will be bypassed

            h_removeImage(true)
            ctx.emit('restore')             // with that emission, the paren can restore the prop so it can be used properly next time. That change is going to cause this watch run again, but 'props.parentDelIntent' should be FALSE so there isn't be a any infinite loop
        })

        //endregion ===============================================================================

        return {
            props,
            cmp_image,
            ref_fileInput,
            errorMessage,
            previewImg,

            RELPATH_DEFAULT_AVATAR_IMG,
            shallWeShowRmBtn,

            h_fileSelection,
            h_removeImage
        }
    },
    emits: ['fileSelected', 'removePicture', 'restore']
});
</script>

<style lang="scss">
</style>
