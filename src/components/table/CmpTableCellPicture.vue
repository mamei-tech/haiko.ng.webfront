<template>
    <div class="picture-table-cell" :style="style">
        <img class="cell-picture" :src="picture" alt="">
    </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { RELPATH_DEFAULT_AVATAR_IMG, PICTURE_TYPE_CELL, RELPATH_DEFAULT_PRODUCT_IMG, IMG_AVATAR_SMALL_THUMBNAIL, IMG_ORG_PRODUCT_NAM } from '@/services/definitions'

import type { SetupContext } from 'vue'


export default defineComponent({
    name:  'CmpTableCellPicture',
    props: {
        picture: {
            type:        String,
            required:    true,
            description: 'Scr value of the picture to be displayed'
        },
        statics: {
            type:        String,
            required:    true,
            description: 'Server root URL for the statics files folder'
        },
        type:    {
            type:        Number,
            required:    true,
            description: 'The type of the picture need to be displayed. This value is used as an indicator for the default image to use. Check PICTURE_TYPE_CELL',

            validator( value: PICTURE_TYPE_CELL ): boolean {
                const acceptedValues = [ 1, 2 ]
                return acceptedValues.indexOf(value) !== -1
            }
        },
        size: {
            type:        Number,
            description: 'The size (px) of the picture',
            default: 40,
        }
    },
    setup( props, ctx: SetupContext ) {

        //region  ======== DECLARATIONS & LOCAL STATE =============================================
        //endregion ===============================================================================

        //region ======== COMPUTATIONS & GETTERS ==================================================

        const picture = computed(() => {

            let default_pic = ''

            if (props.type === PICTURE_TYPE_CELL.USER) default_pic = RELPATH_DEFAULT_AVATAR_IMG
            else if (props.type === PICTURE_TYPE_CELL.PRODUCT) default_pic = RELPATH_DEFAULT_PRODUCT_IMG

            if (props.picture === '' || props.picture == undefined) return default_pic
            else if (props.type === PICTURE_TYPE_CELL.USER ) return props.statics?.concat(props.picture, IMG_AVATAR_SMALL_THUMBNAIL)
            else if (props.type === PICTURE_TYPE_CELL.PRODUCT) return props.statics?.concat(props.picture, IMG_ORG_PRODUCT_NAM)

            else return  default_pic
        })

        const style = computed(() => {
            let round_value = 50

            if(props.type === PICTURE_TYPE_CELL.PRODUCT) round_value = 10

            return 'width: ' + props.size + 'px; height: ' + props.size + 'px; border-radius: ' + round_value + '%'
        })

        //endregion ===============================================================================

        //#region ======= FETCHING DATA & ACTIONS =================================================
        //#endregion ==============================================================================

        //region ======= EVENTS HANDLERS & WATCHERS ===============================================
        //endregion ===============================================================================

        return {
            picture,
            style,
        }
    }
})
</script>

<style lang="scss">
</style>


