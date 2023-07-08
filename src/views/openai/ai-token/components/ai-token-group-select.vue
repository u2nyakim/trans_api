<!-- AiToken分组选择下拉框 -->
<template>
  <a-select
    show-search
    option-filter-prop="label"
    :options="data"
    allow-clear
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { listAiTokenGroups } from '@/api/openai/ai-token-group';
  import type { SelectProps } from 'ant-design-vue/es';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  withDefaults(
    defineProps<{
      value?: number;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择分组'
    }
  );

  // 字典数据
  const data = ref<SelectProps['options']>([]);

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };

  /* 获取字典数据 */
  listAiTokenGroups({ limit: 999 })
    .then((list) => {
      data.value = list.map((d) => {
        return {
          value: d.id,
          label: d.name
        };
      });
    })
    .catch((e) => {
      message.error(e.message);
    });

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
