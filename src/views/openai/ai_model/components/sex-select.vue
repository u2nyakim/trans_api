<!-- 性别选择下拉框 -->
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
  import { listDictionaryData } from '@/api/system/dictionary-data';
  import type { SelectProps } from 'ant-design-vue/es';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择性别'
    }
  );

  // 字典数据
  const data = ref<SelectProps['options']>([]);

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };

  /* 获取字典数据 */
  listDictionaryData({
    dictCode: 'sex'
  })
    .then((list) => {
      data.value = list.map((d) => {
        return {
          value: d.dictDataCode,
          label: d.dictDataName
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
