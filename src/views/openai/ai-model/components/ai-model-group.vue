<!-- 分组编辑弹窗 -->
<template>
  <div>
    <ele-modal
      :width="680"
      :visible="visible"
      title="分组管理"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateVisible"
    >
      <template #footer>
        <span style="color: #bdbdbd">北菜菜: u2nyakim@gmail.com</span>
      </template>
      <div>
        <ele-pro-table
          ref="tableRef"
          v-model:selection="selection"
          :columns="columns"
          :datasource="datasource"
          :scroll="{ x: 580 }"
          :height="400"
          :where="defaultWhere"
          cache-key="proOpenaiModelGroupTable"
          row-key="id"
        >
          <template #toolbar>
            <a-space>
              <a-button class="ele-btn-icon" type="primary" @click="openEdit()">
                <template #icon>
                  <plus-outlined />
                </template>
                <span>新建</span>
              </a-button>
              <a-button
                class="ele-btn-icon"
                danger
                type="primary"
                @click="removeBatch"
              >
                <template #icon>
                  <delete-outlined />
                </template>
                <span>删除</span>
              </a-button>
            </a-space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
                <a-popconfirm
                  placement="topRight"
                  title="确定要删除此分组吗？"
                  @confirm="remove(record)"
                >
                  <a class="ele-text-danger">删除</a>
                </a-popconfirm>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </div>
    </ele-modal>
    <ele-modal
      :width="380"
      :visible="showEdit"
      :confirm-loading="loading"
      :title="isUpdate ? '修改分组' : '新建分组'"
      :body-style="{ paddingBottom: '8px' }"
      @update:visible="updateFormVisible"
      @ok="save"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="
          styleResponsive ? { md: 7, sm: 4, xs: 24 } : { flex: '90px' }
        "
        :wrapper-col="
          styleResponsive ? { md: 17, sm: 24, xs: 24 } : { flex: '1' }
        "
      >
        <a-row :gutter="16">
          <a-col
            v-bind="styleResponsive ? { md: 24, sm: 24, xs: 24 } : { span: 12 }"
          >
            <a-form-item label="分组名称" name="name">
              <a-input
                allow-clear
                :maxlength="20"
                placeholder="请输入分组名称"
                v-model:value="form.name"
              />
            </a-form-item>
            <a-form-item label="分组标识" name="code">
              <a-input
                :maxlength="20"
                placeholder="请输入分组标识"
                v-model:value="form.code"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </ele-modal>
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, reactive, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined
  } from '@ant-design/icons-vue';
  import {
    addAiModelGroup,
    checkExistence,
    pageAiModelGroups,
    removeAiModelGroup,
    removeAiModelGroups,
    updateAiModelGroup
  } from '@/api/openai/ai-model-group';
  import type {
    AiModelGroup,
    AiModelGroupParam
  } from '@/api/openai/ai-model-group/model';
  import {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { EleProTable, messageLoading, toDateString } from 'ele-admin-pro';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<AiModelGroup>({
    id: undefined,
    name: '',
    code: ''
  });
  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      key: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      hideInSetting: true,
      customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    },
    {
      title: '分组名称',
      dataIndex: 'name',
      showSorterTooltip: false
    },
    {
      title: '标识',
      dataIndex: 'code',
      showSorterTooltip: false
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text),
      width: 160,
      hideInTable: true
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center'
    }
  ]);
  // 表格选中数据
  const selection = ref<AiModelGroup[]>([]);

  // 默认搜索条件
  const defaultWhere = reactive({
    name: ''
  });

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageAiModelGroups({ ...where, ...orders, page, limit });
  };

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    name: [
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入分组名称');
            }
            checkExistence('name', value, form?.id)
              .then(() => {
                reject('分组已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
        trigger: 'blur'
      }
    ],
    code: [
      {
        required: true,
        type: 'string',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!value) {
              return reject('请输入分组标识');
            }
            checkExistence('code', value, form?.id)
              .then(() => {
                reject('标识已经存在');
              })
              .catch(() => {
                resolve();
              });
          });
        },
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
        const saveOrUpdate = isUpdate.value
          ? updateAiModelGroup
          : addAiModelGroup;
        saveOrUpdate(form)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateFormVisible(false);
            reload();
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          })
          .finally(() => {
            resetFields();
            formRef.value?.clearValidate();
          });
      })
      .catch(() => {});
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: AiModelGroup) => {
    if (row) {
      assignFields({
        ...row
      });
      isUpdate.value = true;
    } else {
      isUpdate.value = false;
    }
    showEdit.value = true;
  };
  /* 删除单个 */
  const remove = (row: AiModelGroup) => {
    const hide = messageLoading('请求中..', 0);
    removeAiModelGroup(row.id)
      .then((msg) => {
        hide();
        message.success(msg);
        reload();
      })
      .catch((e) => {
        hide();
        message.error(e.message);
      });
  };
  /* 批量删除 */
  const removeBatch = () => {
    if (!selection.value.length) {
      message.error('请至少选择一条数据');
      return;
    }
    Modal.confirm({
      title: '提示',
      content: '确定要删除选中的分组吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = messageLoading('请求中..', 0);
        removeAiModelGroups(selection.value.map((d) => d.id))
          .then((msg) => {
            hide();
            message.success(msg);
            reload();
          })
          .catch((e) => {
            hide();
            message.error(e.message);
          });
      }
    });
  };
  /* 搜索 */
  const reload = (where?: AiModelGroupParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };
  /* 更新visible */
  const updateFormVisible = (value: boolean) => {
    showEdit.value = value;
  };

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
</script>
