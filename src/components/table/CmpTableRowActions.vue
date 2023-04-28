<template>
    <div style="text-align: right">

        <!-- DEFAULT -->
        <template v-if="mode ===  DT_ACTION_BUTTON_MODE.DEFAULT">

            <!-- btn details -->
            <button @click.prevent="$emit('detailsIntent', identifier)"
                    type="button"
                    :title="$t('btn.val-details')"
                    class="btn like btn-link btn-icon btn-fab btn-info btn-sm"
            >
                <i class="tim-icons icon-heart-2"></i>
            </button>

            <!-- btn edit -->
            <button @click.prevent="$emit('editIntent', identifier)"
                    type="button"
                    :title="$t('btn.val-edit')"
                    class="btn edit btn-link btn-icon btn-fab btn-warning btn-sm"
            >
                <i class="tim-icons icon-pencil"></i>
            </button>

            <!-- btn delete -->
            <button @click.prevent="$emit('deleteIntent', identifier)"
                    type="button"
                    :title="$t('btn.val-del')"
                    class="btn remove btn-link btn-icon btn-fab btn-danger btn-sm"
            >
                <i class="tim-icons icon-trash-simple"></i>
            </button>
        </template>

        <!-- JUST EDIT AND DELETE  -->
        <template v-else-if="mode === DT_ACTION_BUTTON_MODE.JEDINDEL">

            <!-- btn edit -->
            <button @click.prevent="$emit('editIntent', identifier)"
                    type="button"
                    :title="$t('btn.val-edit')"
                    class="btn edit btn-link btn-icon btn-fab btn-warning btn-sm"
            >
                <i class="tim-icons icon-pencil"></i>
            </button>

            <!-- btn delete -->
            <button @click.prevent="$emit('deleteIntent', identifier)"
                    type="button"
                    :title="$t('btn.val-del')"
                    class="btn remove btn-link btn-icon btn-fab btn-danger btn-sm"
            >
                <i class="tim-icons icon-trash-simple"></i>
            </button>
        </template>

        <!-- JUST DELETE  -->
        <template v-else-if="mode === DT_ACTION_BUTTON_MODE.JDEL">

            <!-- btn delete -->
            <button @click.prevent="$emit('deleteIntent', identifier)"
                    type="button"
                    :title="$t('btn.val-del')"
                    class="btn remove btn-link btn-icon btn-fab btn-danger btn-sm"
            >
                <i class="tim-icons icon-trash-simple"></i>
            </button>
        </template>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { DT_ACTION_BUTTON_MODE } from '@/services/definitions'

import type { SetupContext } from 'vue'

export default defineComponent({
    name: 'CmpTableRowActions',
    props: {

        identifier: {
            type: Number,
            description: "Row object identifier / id",
        },

        mode: {
            type: Number,
            description: "The mode (sets of buttons) to show in actions buttons according to the specified entity type",
        },

    },

    emits: ["detailsIntent", "editIntent", "deleteIntent"],

    setup( _: any, __: SetupContext ) {
        return {
            DT_ACTION_BUTTON_MODE
        }
    }
});
</script>
