<template>
  <div class="ele-body ele-body-card">
    <demo-list />
    <demo-grid />
    <demo-table />
  </div>
</template>

<script lang="ts" setup>
  import DemoList from './components/demo-list.vue';
  import DemoGrid from './components/demo-grid.vue';
  import DemoTable from './components/demo-table.vue';
</script>

<script lang="ts">
  export default {
    name: 'ExtensionDragsort'
  };
</script>
