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
              {{ data.uuid }}({{ data.uuid }})
            </div>
          </a-form-item>
          <a-form-item label="账单标签">
            <div class="ele-text-secondary">
              {{ data.tags }}
            </div>
          </a-form-item>

        </a-col>
        <a-col :sm="12" :xs="24">

          <a-form-item label="账单费用">
            <div class="ele-text-secondary">
              {{ data.fee }}
            </div>
          </a-form-item>

          <a-form-item label="创建时间">
            <div class="ele-text-secondary">
              {{ toDateString(data.createTime) }}
            </div>
          </a-form-item>

          <a-form-item label="状态">
            <a-tag :color="['red', 'green'][data.status]">
              {{ ['失败', '成功'][data.status] }}
            </a-tag>
          </a-form-item>
        </a-col>
      </a-row>
      <div style="margin: 12px 0">
        <a-divider />
      </div>

      <a-form-item
        label="扩展属性"
        :label-col="{ sm: { span: 4 }, xs: { span: 6 } }"
        :wrapper-col="{ sm: { span: 20 }, xs: { span: 18 } }"
      >
        <text-ellipsis :content="data.external" class="ele-text-secondary" />
      </a-form-item>

    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import { toDateString } from 'ele-admin-pro/es';
import type { AiBill } from '@/api/openai/ai-bill/model';
// import TextEllipsis from './text-ellipsis.vue';

const emit = defineEmits<{
  (e: 'update:visible', visible: boolean): void;
}>();
//
defineProps<{
  // 弹窗是否打开
  visible?: boolean;
  // 修改回显的数据
  data: AiBill;
}>();

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};
</script>

