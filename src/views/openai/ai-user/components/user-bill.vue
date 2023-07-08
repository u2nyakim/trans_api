<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="680"
    :visible="visible"
    title="用户消费记录"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
  >
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <apple-outlined />
            会话账单
          </span>
        </template>
        <user-bill-hhscore />
      </a-tab-pane>
    </a-tabs>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { User } from '@/api/system/user/model';
  import { AppleOutlined } from '@ant-design/icons-vue';
  import UserBillHhscore from './user-bill-hhscore.vue';
  const activeKey = ref('1');

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: User | null;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
</script>
