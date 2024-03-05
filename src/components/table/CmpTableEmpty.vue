<template>
  <div style="text-align: center" class="mb-5">
    <i class="tim-icons icon-alert-circle-exc text-default" style="font-size: 60px"></i>
    <p class="text-default mt-3">{{ $t( 'data.empty-table' ) }}</p>
  </div>
</template>

<script lang="ts">
    import { defineComponent } from 'vue'


    export default defineComponent({
        name: 'CmpTableEmpty',
        props: {},
    })
</script>
