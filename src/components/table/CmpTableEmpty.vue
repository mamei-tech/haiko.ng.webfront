<template>
    <div style="text-align: center" class="mb-5">
        <i class="tim-icons icon-alert-circle-exc text-primary" style="font-size: 80px"></i>
        <p class="text-primary mt-3">{{ $t( 'data.empty-table' ) }}</p>
    </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'


    export default defineComponent({
        name: 'CmpTableEmpty',
        props: {},
    })
</script>
