<!-- AiToken模型选择下拉框 -->
<template>
  <a-select
    show-search
    option-filter-prop="label"
    :options="data"
    allow-clear
    :value="models"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
    mode="multiple"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import type { SelectProps } from 'ant-design-vue/es';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      data?: any;
    }>(),
    {
      placeholder: '请选择分组'
    }
  );
  const models = ref([]);

  // 模型数据
  const data = ref<SelectProps['options']>([]);
  /* 获取模型数据 */
  const list: any = [
    'gpt-3.5-turbo',
    'gpt-3.5-turbo-0301',
    'text-davinci-003',
    'ext-davinci-002',
    'dall-e',
    'gpt-4',
    'gpt-4-0314',
    'gpt-4-32k',
    'gpt-4-32k-0314',
    'code-davinci-002',
    'code-cushman-001',
    'text-moderation-latest',
    'text-moderation-stable'
  ].map(function (name) {
    return {
      value: name,
      label: name
    };
  });
  data.value = list;

  /* 更新选中数据 */
  const updateValue = (value: string[]) => {
    console.log(value);
    emit('update:value', value.join(','));
  };

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
  watch(
    () => props.data,
    (value) => {
      if (value) {
        data.value = value;
      }
    }
  );
  watch(
    () => props.value,
    (value) => {
      models.value = value
        ? value
            .toString()
            .split(',')
            .filter((element) => element)
        : [];
    }
  );
</script>
