<!--suppress CssUnknownTarget -->
<template>
    <component :is="this.$route.meta.layout || 'div'">
        <router-view></router-view>
        <!--<router-view :key="$route.fullPath"></router-view>-->
    </component>
</template>


<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
    name:       'Application',
})
</script>

<style lang="scss">
@import "assets/sass/black-dashboard";
@import "assets/css/font-awesome.css";
@import "assets/css/nucleo-icons.css";

// from node_modules libs
@import "vue-toastification/dist/index.css";
@import "nprogress/nprogress.css";

/*@import '../node_modules/bootstrap/scss/bootstrap.scss';*/
</style>

