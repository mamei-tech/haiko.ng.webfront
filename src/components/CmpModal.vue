<template>
    <transition name="fade">
        <div class="modal fade"
             :class="[
                 {'show d-block': show},
                 {'d-none': !show},

                 ]"
             v-show="show"
             tabindex="-1"
             role="dialog"
             @click.self="h_closingIntent(false)"
             :aria-hidden="!show">

            <div class="modal-dialog"
                 :class="[
                     {'modal-notice': modalType === 'notice'},
                     {'modal-dialog-centered': centered},
                     {'modal-auto': modalWith === 'auto'},
                     {'modal-ultra-wide': modalWith === 'ultra-wide'},
                     {'modal-wide': modalWith === 'wide'},
                     {'modal-narrow': modalWith === 'narrow'},
                     {'modal-narrow-plus': modalWith === 'narrow-plus'},
                     modalClasses
                     ]">
                <div class="modal-content" :class="[gradient ? `bg-gradient-${gradient}` : '', modalContentClasses]">

                    <!-- MODAL HEADER -->
                    <div class="modal-header" :class="[headerClasses]" v-if="$slots.header">
                        <slot name="header"></slot>
                        <slot name="close-button">
                            <button v-if="showClose"
                                    type="button"
                                    class="close"
                                    @click="h_closingIntent(true)"
                                    data-dismiss="modal"
                                    aria-label="Close">
                                <i class="tim-icons icon-simple-remove"></i>
                            </button>
                        </slot>
                    </div>

                    <!-- MODAL BODY -->
                    <div v-if="$slots.default" class="modal-body" :class="bodyClasses">
                        <slot></slot>
                    </div>

                    <!-- MODAL FOOTER -->
                    <div v-if="$slots.footer" class="modal-footer" :class="footerClasses">
                        <slot name="footer"></slot>
                    </div>

                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'CmpModal',
        props: {
            show: Boolean,
            showClose: {
                type: Boolean,
                default: true
            },
            centered: {
                type: Boolean,
                default: true,
            },
            closeOnBackdropClk: {
                type:    Boolean,
                default: true,
                description: "Determines if the modal should close when a click was made outside of the modal window"
            },
            modalType: {
                type: String,
                default: '',
                description: 'Modal type (notice|mini|"") ',

                validator (value: string): boolean {
                    const acceptedValues = ['', 'notice', 'mini']
                    return acceptedValues.indexOf(value) !== -1
                }
            },
            modalWith: {
                type: String,
                default: 'auto',
                description: 'Available values are: auto | ultra-wide | wide | narrow | narrow-plus',

                validator (value: string): boolean {
                    const acceptedValues = ['auto', 'ultra-wide', 'wide', 'narrow', 'narrow-plus']
                    return acceptedValues.indexOf(value) !== -1
                }
            },
            gradient: {
                type: String,
                description: "Modal gradient type (danger, primary etc)"
            },

            // Classes
            headerClasses: {
                type: [Object, String],
                description: "Modal Header css classes"
            },
            bodyClasses: {
                type: [Object, String],
                description: "Modal Body css classes"
            },
            footerClasses: {
                type: [Object, String],
                description: "Modal Footer css classes"
            },
            modalClasses: {
                type: [Object, String],
                description: "Modal dialog css classes"
            },
            modalContentClasses: {
                type: [Object, String],
                description: "Modal dialog content css classes"
            },
        },
        methods: {
            h_closingIntent( forceClose: boolean = false ) {
                if(!forceClose)
                {
                    if (this.closeOnBackdropClk == false) return
                    else this.close()
                }
                else this.close()                                                           // forcing the modal to close
            },
            close() {
                this.$emit('close')
                this.$emit('update:show', false)
            }
        },
        emits: ['close', 'update:show'],
        watch: {
            show (val, _) {                                                                 // parameters val & oldVal
                let documentClasses = document.body.classList                               // direct document manipulation

                if (val) { documentClasses.add('modal-open') }
                else { documentClasses.remove('modal-open') }
            },
        }
    })
</script>

<style lang="scss" scoped>
    .modal.show {
        background-color: rgba(0, 0, 0, 0.6);
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .8s ease;
    }

    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
</style>
