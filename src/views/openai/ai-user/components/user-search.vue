<!-- 搜索表单 -->
<template>
  <a-card :bordered="false" :body-style="{ paddingBottom: 0 }">
    <a-form
      :label-col="
        styleResponsive ? { xl: 6, lg: 5, md: 7, sm: 4 } : { flex: '90px' }
      "
      :wrapper-col="
        styleResponsive ? { xl: 20, lg: 19, md: 17, sm: 20 } : { flex: '1' }
      "
    >
      <a-row :gutter="8">
        <a-col
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 8 }
          "
        >
          <a-form-item label="用户账号">
            <a-input
              v-model:value.trim="form.username"
              placeholder="请输入"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 8 }
          "
        >
          <a-form-item label="用户名">
            <a-input
              v-model:value.trim="form.nickname"
              placeholder="请输入"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 8 }
          "
        >
          <a-form-item label="邮箱号">
            <a-input
              v-model:value.trim="form.email"
              placeholder="请输入"
              allow-clear
            />
          </a-form-item>
        </a-col>

        <a-col
          v-if="searchExpand"
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 8 }
          "
        >
          <a-form-item label="手机号">
            <a-input
              v-model:value.trim="form.phone"
              placeholder="请输入"
              allow-clear
            />
          </a-form-item>
        </a-col>
        <a-col
          v-if="searchExpand"
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 8 }
          "
        >
          <a-form-item label="状态">
            <a-select
              v-model:value="form.status"
              placeholder="请选择"
              allow-clear
            >
              <a-select-option :value="0">正常</a-select-option>
              <a-select-option :value="1">冻结</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col
          v-bind="
            styleResponsive
              ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
              : { span: 8 }
          "
        >
          <a-form-item class="ele-text-right" :wrapper-col="{ span: 24 }">
            <a-space>
              <a-button type="primary" @click="search">查询</a-button>
              <a-button @click="reset">重置</a-button>
              <a @click="toggleExpand">
                <span v-if="searchExpand">
                  收起 <up-outlined class="ele-text-small" />
                </span>
                <span v-else>
                  展开 <down-outlined class="ele-text-small" />
                </span>
              </a>
            </a-space>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { DownOutlined, UpOutlined } from '@ant-design/icons-vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { UserParam } from '@/api/system/user/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'search', where?: UserParam): void;
    (e: 'expand-change', expand: boolean): void;
  }>();

  // 表单数据
  const { form, resetFields } = useFormData<UserParam>({
    username: '',
    nickname: '',
    sex: undefined,
    phone: '',
    status: undefined
  });

  // 搜索表单是否展开
  const searchExpand = ref(false);

  /* 搜索 */
  const search = () => {
    emit('search', form);
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    search();
  };

  /* 搜索展开/收起 */
  const toggleExpand = () => {
    searchExpand.value = !searchExpand.value;
    emit('expand-change', searchExpand.value);
  };
</script>
