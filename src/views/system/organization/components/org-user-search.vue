<!-- 搜索表单 -->
<template>
  <a-row :gutter="16">
    <a-col
      v-bind="
        styleResponsive ? { xl: 6, lg: 8, md: 12, sm: 24, xs: 24 } : { span: 6 }
      "
    >
      <a-input
        v-model:value.trim="form.username"
        placeholder="请输入用户账号"
        allow-clear
      />
    </a-col>
    <a-col
      v-bind="
        styleResponsive ? { xl: 6, lg: 8, md: 12, sm: 24, xs: 24 } : { span: 6 }
      "
    >
      <a-input
        v-model:value.trim="form.nickname"
        placeholder="请输入用户名"
        allow-clear
      />
    </a-col>
    <a-col
      v-bind="
        styleResponsive
          ? { xl: 12, lg: 8, md: 24, sm: 24, xs: 24 }
          : { span: 12 }
      "
    >
      <a-space :size="10" style="flex-wrap: wrap">
        <a-button type="primary" class="ele-btn-icon" @click="search">
          <template #icon>
            <search-outlined />
          </template>
          <span>查询</span>
        </a-button>
        <a-button type="primary" class="ele-btn-icon" @click="add">
          <template #icon>
            <plus-outlined />
          </template>
          <span>新建</span>
        </a-button>
      </a-space>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { PlusOutlined, SearchOutlined } from '@ant-design/icons-vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { UserParam } from '@/api/system/user/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'search', where?: UserParam): void;
    (e: 'add'): void;
  }>();

  // 表单数据
  const { form } = useFormData<UserParam>({
    username: '',
    nickname: ''
  });

  /* 搜索 */
  const search = () => {
    emit('search', form);
  };

  /*  添加 */
  const add = () => {
    emit('add');
  };
</script>
