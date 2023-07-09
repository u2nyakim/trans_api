<!-- Token编辑弹窗 -->
<template>
  <ele-modal
    :width="680"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改Token' : '新建Token'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 4, sm: 4, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 17, sm: 20, xs: 24 } : { flex: '1' }
      "
    >
      <a-row :gutter="16">
        <a-col
          v-bind="styleResponsive ? { md: 24, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-form-item label="分组" name="groupId">
            <ai-token-group-select v-model:value="form.groupId" />
          </a-form-item>
          <a-form-item label="Host" name="host">
            <a-input
              allow-clear
              :maxlength="200"
              placeholder="请输入Host"
              v-model:value="form.host"
            />
          </a-form-item>
          <a-form-item label="Sk" name="sk">
            <a-input
              allow-clear
              :maxlength="200"
              placeholder="请输入Sk"
              v-model:value="form.sk"
            />
          </a-form-item>
          <a-form-item label="支持模型" name="models">
            <ai-token-models-select
              v-model:value="form.models"
              v-model:data="models"
            />
          </a-form-item>
          <a-form-item label="检测支持模型" name="models">
            <a-button :loading="checkLoading" @click="checkModels"
              >检测支持的模型</a-button
            >
          </a-form-item>
          <a-form-item label="优先级" name="priority">
            <a-input-number
              allow-clear
              :min="0"
              :max="1000"
              placeholder="请输入优先级(数值越大越优先消耗)"
              v-model:value="form.priority"
              style="width: 100%"
            />
          </a-form-item>
          <a-form-item label="启用" name="disable">
            <a-switch
              :checked="!form.disable"
              checked-children="是"
              un-checked-children="否"
              @change="(checked: boolean) =>form.disable = !checked"
            />
          </a-form-item>
        </a-col>
        <a-col
          v-bind="styleResponsive ? { md: 24, sm: 24, xs: 24 } : { span: 12 }"
        >
          <a-divider
            style="border-color: #d0d0ce; margin-bottom: 20px"
            dashed
          />
          <a-form-item
            label="备注"
            name="comments"
            :label-col="{ md: 4, sm: 4, xs: 24 }"
          >
            <a-textarea
              v-model:value="form.comments"
              placeholder="请输入备注"
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
  import { addAiToken, updateAiToken } from '@/api/openai/ai-token';
  import type { AiToken } from '@/api/openai/ai-token/model';
  import AiTokenGroupSelect from '@/views/openai/ai-token/components/ai-token-group-select.vue';
  import AiTokenModelsSelect from '@/views/openai/ai-token/components/ai-token-models-select.vue';
  import { modelsCheck } from '@/api/openai/ai-model';

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
    data?: AiToken | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<AiToken>({
    comments: '',
    createTime: '',
    disable: false,
    groupName: '',
    host: '',
    models: '',
    priority: '',
    sk: '',
    ulimit: '',
    usage: '',
    id: undefined,
    groupId: undefined,
    status: 0,
    statusMsg: ''
  });
  const models = ref([]);
  const checkLoading = ref(false);
  const checkModels = () => {
    if (!form.host) {
      message.error('Host不能为空');
      return false;
    }
    if (!form.sk) {
      message.error('Sk不能为空');
      return false;
    }
    checkLoading.value = true;
    modelsCheck(form.host, form.sk)
      .then((res) => {
        if (res.data) {
          models.value = res.data
            .filter((e) => e.object === 'model')
            .map((item) => {
              return {
                value: item.id,
                label: item.id
              };
            });
          models.value.push({ value: 'dall-e', label: 'dall-e' });
        }
        checkLoading.value = false;
        message.success('检测成功');
      })
      .catch(() => {
        checkLoading.value = false;
        message.error('检测失败');
      });
  };
  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    host: [
      {
        required: true,
        message: '请输入Host',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sk: [
      {
        required: true,
        message: '请输入Sk',
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
        const saveOrUpdate = isUpdate.value ? updateAiToken : addAiToken;
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
