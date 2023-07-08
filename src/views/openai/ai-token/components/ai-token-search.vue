<!-- 搜索表单 -->
<template>
  <a-form
    :label-col="
      styleResponsive ? { xl: 7, lg: 5, md: 7, sm: 4 } : { flex: '90px' }
    "
    :wrapper-col="
      styleResponsive ? { xl: 17, lg: 19, md: 17, sm: 20 } : { flex: '1' }
    "
  >
    <a-row :gutter="8">
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-form-item label="关键字">
          <a-input
            v-model:value.trim="form.keyword"
            placeholder="请输入"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 4, lg: 12, md: 12, sm: 12, xs: 12 }
            : { span: 6 }
        "
      >
        <a-form-item label="禁用">
          <a-select
            v-model:value="form.disable"
            placeholder="请选择"
            allow-clear
          >
            <a-select-option :value="0">否</a-select-option>
            <a-select-option :value="1">是</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 4, lg: 12, md: 12, sm: 12, xs: 12 }
            : { span: 6 }
        "
      >
        <a-form-item label="状态">
          <a-select
            v-model:value="form.status"
            placeholder="请选择"
            allow-clear
          >
            <a-select-option :value="0">异常</a-select-option>
            <a-select-option :value="1">正常</a-select-option>
          </a-select>
        </a-form-item>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 2, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-form-item class="ele-text-right" :wrapper-col="{ span: 24 }">
          <a-space>
            <a-button type="primary" @click="search">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { AiTokenParam } from '@/api/openai/ai-token/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 默认搜索条件
    where?: AiTokenParam;
  }>();

  const emit = defineEmits<{
    (e: 'search', where?: AiTokenParam): void;
  }>();

  // 表单数据
  const { form, resetFields } = useFormData<AiTokenParam>({
    keyword: '',
    status: undefined,
    disable: undefined,
    ...props.where
  });

  /* 搜索 */
  const search = () => {
    emit('search', form);
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    search();
  };
</script>
