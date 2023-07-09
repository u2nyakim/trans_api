<!-- 账号日志弹窗 -->
<template>
  <ele-modal
    style="width: 100%"
    wrap-class-name="full-modal"
    :visible="visible"
    title="账号日志记录"
    :body-style="{ paddingBottom: '1px' }"
    @update:visible="updateVisible"
  >
    <template #footer></template>
    <div style="position: relative">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <solution-outlined />
              登录记录
            </span>
          </template>
          <a-alert
            message="仅保留10000条最新的登录记录"
            type="info"
            show-icon
          />
          <user-record-login ref="userRecordLoginRef" :data="props.data" />
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <solution-outlined />
              接口记录
            </span>
          </template>
          <a-alert message="仅保留2500条最新的接口记录" type="info" show-icon />
          <user-record-operation  ref="userRecordOperationRef" :data="props.data" />
        </a-tab-pane>
      </a-tabs>
    </div>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import type { User } from '@/api/system/user/model';
  import { SolutionOutlined } from '@ant-design/icons-vue';
  import UserRecordLogin from '@/views/openai/ai-user/components/user-record-login.vue';
  import UserRecordOperation from '@/views/openai/ai-user/components/user-record-operation.vue';

  const userRecordLoginRef = ref<UserRecordLogin | null>(null);
  const userRecordOperationRef = ref<UserRecordOperation | null>(null);


  const activeKey = ref('1');

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = withDefaults(
    defineProps<{
      // 弹窗是否打开
      visible: boolean;
      // 修改回显的数据
      data: User;
    }>(),
    {
      visible: false
    }
  );
  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
  watch(
    () => activeKey.value,
    (val) => {
      if (val == '1' && userRecordLoginRef.value) {
        userRecordLoginRef.value?.reloadTable();
      }
      if (val == '2' && userRecordOperationRef.value) {
        userRecordOperationRef.value?.reloadTable();
      }

    }
  );
</script>

<style lang="less">
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh);
      height: auto;
    }
    .ant-modal-body {
      flex: 1;
    }
  }
</style>
