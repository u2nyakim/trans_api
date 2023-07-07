<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <edit-form />
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import EditForm from '../components/edit-form.vue';
</script>

<script lang="ts">
  export default {
    name: 'ListBasicAdd'
  };
</script>
