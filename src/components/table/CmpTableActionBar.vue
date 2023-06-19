<template>
    <div class="table-action-bars col-12 d-flex" style="margin-bottom: 12px;">
        <!-- we are going to adapt the action bar buttons according to the entity given in entityMode props -->

        <!-- DEFAULT MODE -->
        <template v-if="mode === DT_ACTIONBAR_MODE.DEFAULT">
            <div class="col-1 p-0" style="text-align: end">
                <CmpBaseButton
                        icon
                        buttonType="primary"
                        :title="$t('btn.tip-create-new')"
                        @doClick="$emit('navCreateIntent')">
                    <i class="tim-icons icon-simple-add"></i>
                </CmpBaseButton>
            </div>
        </template>

        <!--<template v-else-if="entityMode === DT_ACTIONBAR_MODE.Store || DT_ACTIONBAR_MODE.Menu">-->
        <template v-else-if="mode === DT_ACTIONBAR_MODE.COMMON">
            <div class="col-11 p-0">
                <transition name="slide-fade">
                    <div v-show="chkCount > 1" >
                    <CmpBaseButton
                            icon
                            class="mr-1"
                            buttonType="success"
                            :title="$t('btn.tip-enable-sel', {subject:  pSubject})"
                            @doClick="$emit('enableChkCollIntent')">
                        <i class="tim-icons icon-check-2"></i>
                    </CmpBaseButton>
                    <CmpBaseButton
                            icon
                            class="ml-1 mr-1"
                            buttonType="warning"
                            :title="$t('btn.tip-disable-sel', {subject:  pSubject})"
                            @doClick="$emit('disableChkCollIntent')">
                        <i class="tim-icons icon-simple-remove"></i>
                    </CmpBaseButton>
                    <CmpBaseButton
                            icon
                            class="ml-1"
                            buttonType="danger"
                            :title="$t('btn.tip-remove-sel', {subject:  pSubject})"
                            @doClick="$emit('removeChkCollIntent')">
                        <i class="tim-icons icon-trash-simple"></i>
                    </CmpBaseButton>
                    </div>
                </transition>
            </div>

            <!-- ALWAYS SHOWED -->
            <div class="col-1 p-0" style="text-align: end">
                <CmpBaseButton
                        icon
                        buttonType="primary"
                        :title="$t('btn.tip-create-new')"
                        @doClick="$emit('navCreateIntent')">
                    <i class="tim-icons icon-simple-add"></i>
                </CmpBaseButton>
            </div>
        </template>

        <!-- JUST TOGGLE STATUS -->
        <template v-else-if="mode === DT_ACTIONBAR_MODE.TOGSTATUS">
            <div class="col-11 p-0">
                <transition name="slide-fade">
                    <div v-show="chkCount > 1" >
                        <CmpBaseButton
                                icon
                                class="mr-1"
                                buttonType="success"
                                :title="$t('btn.tip-enable-sel', {subject:  pSubject})"
                                @doClick="$emit('enableChkCollIntent')">
                            <i class="tim-icons icon-check-2"></i>
                        </CmpBaseButton>
                        <CmpBaseButton
                                icon
                                class="ml-1 mr-1"
                                buttonType="warning"
                                :title="$t('btn.tip-disable-sel', {subject:  pSubject})"
                                @doClick="$emit('disableChkCollIntent')">
                            <i class="tim-icons icon-simple-remove"></i>
                        </CmpBaseButton>
                    </div>
                </transition>
            </div>

            <!-- ALWAYS SHOWED -->
            <div class="col-1 p-0" style="text-align: end">
                <CmpBaseButton
                        icon
                        buttonType="primary"
                        :title="$t('btn.tip-create-new')"
                        @doClick="$emit('navCreateIntent')">
                    <i class="tim-icons icon-simple-add"></i>
                </CmpBaseButton>
            </div>
        </template>

        <!-- Action bar with only the create btn -->
        <template v-else-if="mode === DT_ACTIONBAR_MODE.NOEJC">
            <div class="col-11 p-0">
                <!-- nothing here in this mode -->
            </div>

            <!-- ALWAYS SHOWED -->
            <div class="col-1 p-0" style="text-align: end">
                <CmpBaseButton
                        icon
                        buttonType="primary"
                        :title="$t('btn.tip-create-new')"
                        @doClick="$emit('navCreateIntent')">
                    <i class="tim-icons icon-simple-add"></i>
                </CmpBaseButton>
            </div>
        </template>

    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { CmpBaseButton } from '@/components'
import { DT_ACTIONBAR_MODE } from '@/services/definitions'
import { i18n } from '@/services/i18n'


import type { SetupContext } from 'vue'

    export default defineComponent({
        name: 'CmpTableActionBar',
        components: { CmpBaseButton },
        props: {

            subject:    {
                type:        String,
                description: 'This should be the translation (❗means the translated string) value string for a specific entity of the business. This value could be used for contextualization in the actions button bar.',
                required:    false
            },
            mode: {
                type:        Number,
                default:     0,
                description: 'The mode (sets of buttons) to show in the table top action bar according to the specified entity type'
                // see more comments in enums-entities.ts file
            },
            chkCount:   {
                type:        Number,
                default:     0,
                description: 'The count of the selected/checked items to show the action bar buttons'
            }
        },
        emits: ['navCreateIntent', 'enableChkCollIntent', 'disableChkCollIntent', 'removeChkCollIntent'],

        setup( props: any, __: SetupContext ) {

            const { t } = i18n.global

            return {

                pSubject: props.subject === '' || props.subject === undefined ? t('entities.default') : props.subject,                        // processed subject
                DT_ACTIONBAR_MODE
            }
        }
    })
</script>

<style scoped>
</style>
