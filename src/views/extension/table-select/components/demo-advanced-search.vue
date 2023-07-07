<template>
  <div style="max-width: 160px">
    <a-input
      allow-clear
      size="small"
      v-model:value="where.keywords"
      placeholder="输入关键字搜索"
      @change="search"
    >
      <template #prefix>
        <search-outlined class="ele-text-placeholder" />
      </template>
    </a-input>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import type { WhereType } from '../types';

  const emit = defineEmits<{
    (e: 'search', where: WhereType): void;
  }>();

  // 搜索表单
  const where = reactive<WhereType>({
    keywords: ''
  });

  /* 搜索 */
  const search = () => {
    emit('search', where);
  };
</script>
