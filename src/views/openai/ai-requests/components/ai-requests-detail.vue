<template>
  <ele-modal
    title="详情"
    :width="640"
    :footer="null"
    :visible="visible"
    @update:visible="updateVisible"
  >
    <a-form
      class="ele-form-detail"
      :label-col="{ sm: { span: 8 }, xs: { span: 6 } }"
      :wrapper-col="{ sm: { span: 16 }, xs: { span: 18 } }"
    >
      <a-row :gutter="16">
        <a-col :sm="12" :xs="24">
          <a-form-item label="账单uuid">
            <div class="ele-text-secondary">
              {{ data.billUuid }}
            </div>
          </a-form-item>
          <a-form-item label="请求状态码">
            <div class="ele-text-secondary">
              {{ data.statusCode }}
            </div>
          </a-form-item>
          <a-form-item label="请求接口">
            <div class="ele-text-secondary">
              {{ data.action }}
            </div>
          </a-form-item>
        </a-col>

        <a-col :sm="12" :xs="24">

          <a-form-item label="用户">
            <div class="ele-text-secondary">
              {{ data.userId }}
            </div>
          </a-form-item>

          <a-form-item label="创建时间">
            <div class="ele-text-secondary">
              {{ toDateString(data.createTime) }}
            </div>
          </a-form-item>

        </a-col>
      </a-row>
      <div style="margin: 12px 0">
        <a-divider />
      </div>

      <a-form-item label="请求结果">
        <div class="ele-text-secondary">
          {{ data.data }}
        </div>
      </a-form-item>
      <div style="margin: 12px 0">
        <a-divider />
      </div>
      <a-form-item label="请求内容">
        <div class="ele-text-secondary">
          {{ data.result }}
        </div>
      </a-form-item>

    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import { toDateString } from 'ele-admin-pro/es';
import type { AiRequests } from '@/api/openai/ai-requests/model';
// import TextEllipsis from './text-ellipsis.vue';

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
}>();
//
defineProps<{
  // 弹窗是否打开
  visible?: boolean;
  // 修改回显的数据
  data: AiRequests;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};
</script>

