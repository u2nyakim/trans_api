<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改用户' : '新建用户'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 7, sm: 4, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 17, sm: 20, xs: 24 } : { flex: '1' }
      "
    >
      <a-row :gutter="16">
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="用户名" name="nickname">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入用户名"
              v-model:value="form.nickname"
            />
          </a-form-item>
          <a-form-item label="邮箱" name="email">
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="请输入邮箱"
              v-model:value="form.email"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="手机号" name="phone">
            <a-input
              allow-clear
              :maxlength="11"
              placeholder="请输入手机号"
              v-model:value="form.phone"
            />
          </a-form-item>
          <a-form-item label="个人简介">
            <a-textarea
              :rows="4"
              :maxlength="200"
              placeholder="请输入个人简介"
              v-model:value="form.introduction"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { emailReg, phoneReg } from 'ele-admin-pro/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import { addUser, updateUser } from '@/api/system/user';
  import type { User } from '@/api/system/user/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: User | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<User>({
    userId: undefined,
    username: '',
    nickname: '',
    sex: undefined,
    roles: [],
    email: '',
    phone: '',
    password: '',
    introduction: '',
    birthday: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    nickname: [
      {
        required: true,
        message: '请输入用户名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    email: [
      {
        pattern: emailReg,
        message: '邮箱格式不正确',
        type: 'string',
        trigger: 'blur'
      }
    ],
    phone: [
      {
        pattern: phoneReg,
        message: '手机号格式不正确',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      ?.validate()
      .then(() => {
        loading.value = true;
        const saveOrUpdate = isUpdate.value ? updateUser : addUser;
        saveOrUpdate(form)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          assignFields({
            ...props.data,
            password: ''
          });
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>
