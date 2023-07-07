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
      :label-col="styleResponsive ? { md: 7, sm: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 17, sm: 24 } : { flex: '1' }"
    >
      <a-row :gutter="16">
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="所属机构">
            <org-select
              :data="organizationList"
              placeholder="请选择所属机构"
              v-model:value="form.organizationId"
            />
          </a-form-item>
          <a-form-item label="用户账号" name="username">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入用户账号"
              v-model:value="form.username"
            />
          </a-form-item>
          <a-form-item label="用户名" name="nickname">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入用户名"
              v-model:value="form.nickname"
            />
          </a-form-item>
          <a-form-item label="性别" name="sex">
            <sex-select v-model:value="form.sex" />
          </a-form-item>
          <a-form-item label="角色" name="roleIds">
            <role-select v-model:value="form.roles" />
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
          <a-form-item label="邮箱" name="email">
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="请输入邮箱"
              v-model:value="form.email"
            />
          </a-form-item>
          <a-form-item v-if="!isUpdate" label="登录密码" name="password">
            <a-input-password
              :maxlength="20"
              v-model:value="form.password"
              placeholder="请输入登录密码"
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
  import OrgSelect from './org-select.vue';
  import RoleSelect from '../../user/components/role-select.vue';
  import SexSelect from '../../user/components/sex-select.vue';
  import { addUser, updateUser, checkExistence } from '@/api/system/user';
  import type { User } from '@/api/system/user/model';
  import type { Organization } from '@/api/system/organization/model';

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
    // 全部机构
    organizationList: Organization[];
    // 机构id
    organizationId?: number;
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
    organizationId: undefined,
    username: '',
    nickname: '',
    sex: undefined,
    roles: [],
    email: '',
    phone: '',
    password: '',
    introduction: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    username: [
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入用户账号');
            }
            checkExistence('username', value, props.data?.userId)
              .then(() => {
                reject('账号已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    nickname: [
      {
        required: true,
        message: '请输入用户名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sex: [
      {
        required: true,
        message: '请选择性别',
        type: 'string',
        trigger: 'blur'
      }
    ],
    roleIds: [
      {
        required: true,
        message: '请选择角色',
        type: 'array',
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
    password: [
      {
        required: true,
        type: 'string',
        validator: async (_rule: Rule, value: string) => {
          if (isUpdate.value || /^[\S]{5,18}$/.test(value)) {
            return Promise.resolve();
          }
          return Promise.reject('密码必须为5-18位非空白字符');
        },
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
      .validate()
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
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          form.organizationId = props.organizationId;
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>
