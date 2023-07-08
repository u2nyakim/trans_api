<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <ai-model-search :where="defaultWhere" @search="reload" />
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        v-model:selection="selection"
        :columns="columns"
        :datasource="datasource"
        :scroll="{ x: 1000 }"
        :where="defaultWhere"
        cache-key="proOpenaiModelTable"
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
            <a-button class="ele-btn-icon" @click="editGroup">
              <template #icon>
                <group-outlined />
              </template>
              <span>分组管理</span>
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-tag>{{ record.groupCode }}</a-tag> {{ record.name }}
          </template>
          <template v-else-if="column.key === 'status'">
            <template v-if="record.status">
              <a-tag color="blue">启用</a-tag>
            </template>
            <template v-else>
              <a-tag color="pink">禁用</a-tag>
            </template>
          </template>
          <template v-else-if="column.key === 'feeType'">
            <span v-if="record.feeType === 0"> 免费 </span>
            <span v-if="record.feeType === 1"> 按次数计费 </span>
            <span v-if="record.feeType === 2"> 按Token计费 </span>
          </template>
          <template v-else-if="column.key === 'fee'">
            <span v-if="record.feeType === 0"> - </span>
            <span v-if="record.feeType === 1"> {{ record.fee }} 积分 </span>
            <span v-if="record.feeType === 2">
              1Token / {{ record.fee }}积分
            </span>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                placement="topRight"
                title="确定要删除此模型吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <ai-model-edit v-model:visible="showEdit" :data="current" @done="reload" />
    <!-- 分组管理弹窗 -->
    <ai-model-group v-model:visible="showGroup" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, reactive, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    GroupOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import { messageLoading, toDateString } from 'ele-admin-pro/es';
  import type {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import AiModelSearch from './components/ai-model-search.vue';
  import AiModelEdit from './components/ai-model-edit.vue';
  import AiModelGroup from './components/ai-model-group.vue';
  import {
    pageAiModels,
    removeAiModel,
    removeAiModels
  } from '@/api/openai/ai-model';
  import type { AiModel, AiModelParam } from '@/api/openai/ai-model/model';

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
      title: '模型名称',
      key: 'name',
      showSorterTooltip: false,
      width: 300
    },
    {
      title: '费用',
      key: 'fee',
      showSorterTooltip: false,
      maxWidth: 280
    },
    {
      title: '收费方式',
      key: 'feeType',
      showSorterTooltip: false,
      maxWidth: 200
    },
    {
      title: '状态',
      key: 'status',
      showSorterTooltip: false,
      width: 60
    },
    {
      title: '状态描述',
      dataIndex: 'statusMsg',
      showSorterTooltip: false
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text),
      width: 160
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center'
    }
  ]);

  // 表格选中数据
  const selection = ref<AiModel[]>([]);

  // 当前编辑数据
  const current = ref<AiModel | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 默认搜索条件
  const defaultWhere = reactive({
    name: '',
    status: undefined,
    feeType: undefined
  });

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageAiModels({ ...where, ...orders, page, limit });
  };

  /* 搜索 */
  const reload = (where?: AiModelParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: AiModel) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row: AiModel) => {
    const hide = messageLoading('请求中..', 0);
    removeAiModel(row.id)
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
      content: '确定要删除选中的模型吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = messageLoading('请求中..', 0);
        removeAiModels(selection.value.map((d) => d.id))
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
  const showGroup = ref(false);
  /* 打开组管理弹窗 */
  const editGroup = () => {
    showGroup.value = true;
  };
</script>

<script lang="ts">
  export default {
    name: 'OpenaiAiModel'
  };
</script>
