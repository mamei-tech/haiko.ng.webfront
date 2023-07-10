<template>
    <div class="card" :class="[cardType && `card-${cardType}`]">

        <!-- CARD IMAGE TOP-->
        <div class="card-img-top" v-if="$slots.image">
            <slot name="image"></slot>
        </div>

        <!-- CARD HEADER -->
        <div class="card-header" v-if="$slots.header || title || hasFormBackBtn" :class="headerClasses">
            <slot name="header">
                <div class="row">

                    <!-- card header left -->
                    <div class="col-6">
                        <button v-if="hasFormBackBtn"
                                :title="$t('btn.tip-back')"
                                class="btn btn-icon btn-primary"
                                @click.prevent="h_Click">
                            <i class="tim-icons icon-minimal-left"></i>
                        </button>
                    </div>

                    <!-- card header right | card action bar -->
                    <div class="col-6">
                        <slot name="card-actionbar"></slot>
                    </div>

                </div>

                <h4 class="card-title mt-2">{{title}}</h4>
                <p class="card-category" v-if="subTitle">{{subTitle}}</p>
            </slot>
        </div>

        <!-- CARD BODY -->
        <div class="card-body" v-if="$slots.default" :class="bodyClasses">
            <slot></slot>
        </div>

        <!-- CARD IMAGE BOTTOM-->
        <div class="card-img-bottom" v-if="$slots['image-bottom']">
            <slot name="image-bottom"></slot>
        </div>

        <!-- RAW CONTENT -->
        <slot name="raw-content" v-if="$slots['raw-content']"></slot>

        <!-- CARD FOOTER -->
        <div class="card-footer" :class="footerClasses" v-if="$slots.footer">
            <hr v-if="showFooterLine" />
            <slot name="footer"></slot>
        </div>

    </div>
</template>


<script lang="ts">
    import { defineComponent } from 'vue'


    export default defineComponent({
        name: 'CmpCard',
        props: {
            title: String,
            subTitle: {
                type: String,
                description: "Card subtitle"
            },
            cardType: {
                type: String,
                description: "Card type (e.g user/primary/danger etc)"
            },
            hasFormBackBtn: {
                type: Boolean,
                default: false,
                description: "For a card form, that sow a go-back navigation button"
            },
            showFooterLine: {
                type: Boolean,
                default: false
            },

            // CLASSES PROPS
            headerClasses: {
                type: [String, Object, Array],
                description: 'Card header css classes',
            },
            bodyClasses: {
                type: [String, Object, Array],
                description: 'Card body css classes',
            },
            footerClasses: {
                type: [String, Object, Array],
                description: 'Card footer css classes',
            },
        },
        methods: {

            h_Click (evt: Event) {this.$emit('doClick', evt)

            }
        },
        emits: ['doClick']
    })
</script>
