<!-- 模型编辑弹窗 -->
<template>
  <ele-modal
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改模型' : '新建模型'"
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
          <a-form-item label="模型分组" name="groupId">
            <ai-model-group-select v-model:value="form.groupId" />
          </a-form-item>
          <a-form-item label="模型名称" name="name">
            <a-input
              allow-clear
              :maxlength="20"
              placeholder="请输入模型名称"
              v-model:value="form.name"
            />
          </a-form-item>
          <a-form-item label="收费模式" name="feeType">
            <a-select ref="select" v-model:value="form.feeType">
              <a-select-option :value="0">免费</a-select-option>
              <a-select-option :value="1">次数计费</a-select-option>
              <a-select-option :value="2">Token计费</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item
            :label="form.feeType === 1 ? '收费金额' : '换算比例'"
            name="fee"
            v-if="form.feeType > 0"
          >
            <a-input-number
              allow-clear
              :min="0"
              :max="100000"
              placeholder="请输入收费金额"
              v-model:value="form.fee"
              style="width: 100%"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-bind="styleResponsive ? { md: 12, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="状态" name="status">
            <a-switch
              v-model:checked="form.status"
              checked-children="启用"
              un-checked-children="禁用"
            />
          </a-form-item>
          <a-form-item label="禁用原因" name="statusMsg" v-if="!form.status">
            <a-textarea
              v-model:value="form.statusMsg"
              placeholder="请输入禁用原因，如：(维护/下线/迁移/调整)"
              :auto-size="{ minRows: 4, maxRows: 5 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import {
    addAiModel,
    checkExistence,
    updateAiModel
  } from '@/api/openai/ai-model';
  import type { AiModel } from '@/api/openai/ai-model/model';
  import AiModelGroupSelect from '@/views/openai/ai-model/components/ai-model-group-select.vue';

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
    data?: AiModel | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<AiModel>({
    id: undefined,
    groupId: undefined,
    fee: 0,
    feeType: 0,
    name: '',
    status: true,
    statusMsg: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    name: [
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入模型名称');
            }
            checkExistence('name', value, props.data?.id)
              .then(() => {
                reject('模型已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    groupId: [
      {
        required: true,
        message: '请选择分组',
        type: 'string',
        trigger: 'blur'
      }
    ],
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
        const saveOrUpdate = isUpdate.value ? updateAiModel : addAiModel;
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
            ...props.data
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
