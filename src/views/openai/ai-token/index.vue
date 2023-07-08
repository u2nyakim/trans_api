<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <ai-token-search :where="defaultWhere" @search="reload" />
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        v-model:selection="selection"
        :columns="columns"
        :datasource="datasource"
        :scroll="{ x: 1000 }"
        :where="defaultWhere"
        cache-key="proOpenAiTokenTable"
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
            <a-button class="ele-btn-icon" @click="updateUsage">
              <template #icon>
                <security-scan-outlined />
              </template>
              <span>更新余额</span>
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
          <template v-if="column.key === 'groupName'">
            <a-tag v-if="record.groupName">{{ record.groupName }}</a-tag>
          </template>
          <template v-if="column.key === 'usage'">
            {{ record.usage.toFixed(10) }}
          </template>

          <template v-else-if="column.key === 'status'">
            <template v-if="record.status">
              <a-tag color="blue">正常</a-tag>
            </template>
            <template v-else>
              <a-tag color="pink">异常</a-tag>
            </template>
          </template>
          <template v-else-if="column.key === 'disable'">
            <a-switch
              :checked="!record.disable"
              checked-children="是"
              un-checked-children="否"
              @change="(checked: boolean) => editDisable(!checked, record)"
            />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                placement="topRight"
                title="确定要删除此AiToken吗？"
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
    <ai-token-edit v-model:visible="showEdit" :data="current" @done="reload" />
    <!-- 分组管理弹窗 -->
    <ai-token-group v-model:visible="showGroup" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, reactive, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import {
    DeleteOutlined,
    ExclamationCircleOutlined,
    PlusOutlined,
    GroupOutlined,
    SecurityScanOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import { messageLoading, toDateString } from 'ele-admin-pro/es';
  import type {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import AiTokenSearch from './components/ai-token-search.vue';
  import AiTokenEdit from './components/ai-token-edit.vue';
  import AiTokenGroup from './components/ai-token-group.vue';
  import {
    pageAiTokens,
    removeAiToken,
    removeAiTokens,
    updateAiTokenDisable,
    queryUsageAiTokens
  } from '@/api/openai/ai-token';
  import type { AiToken, AiTokenParam } from '@/api/openai/ai-token/model';

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
      title: '分组',
      key: 'groupName',
      showSorterTooltip: false
    },
    {
      title: 'Host',
      dataIndex: 'host',
      showSorterTooltip: false
    },
    {
      title: 'Sk',
      dataIndex: 'sk',
      showSorterTooltip: false
    },
    {
      title: '支持AiToken',
      dataIndex: 'models',
      showSorterTooltip: false,
      maxWidth: 200
    },
    {
      title: '限制额度',
      dataIndex: 'ulimit',
      showSorterTooltip: false,
      maxWidth: 200
    },
    {
      title: '已使用额度',
      key: 'usage',
      showSorterTooltip: false,
      maxWidth: 200
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      showSorterTooltip: false,
      sorter: true,
      width: 80
    },
    {
      title: '是否启用',
      key: 'disable',
      showSorterTooltip: false,
      width: 80
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
      width: 100,
      align: 'center'
    }
  ]);

  // 表格选中数据
  const selection = ref<AiToken[]>([]);

  // 当前编辑数据
  const current = ref<AiToken | null>(null);

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
    return pageAiTokens({ ...where, ...orders, page, limit });
  };

  /* 搜索 */
  const reload = (where?: AiTokenParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: AiToken) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row: AiToken) => {
    const hide = messageLoading('请求中..', 0);
    removeAiToken(row.id)
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
  /* 更新余额 */
  const updateUsage = () => {
    const doUpdateUsage = (ids = [], all = false) => {
      const hide = messageLoading('请求中..', 0);
      queryUsageAiTokens(ids, all)
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
    if (!selection.value.length) {
      Modal.confirm({
        title: '操作提示',
        icon: createVNode(ExclamationCircleOutlined),
        content: createVNode(
          'div',
          { style: 'color:red;' },
          '需要更新池中的全部数据? 执行时间会比较长! '
        ),
        onOk() {
          doUpdateUsage([], true);
        }
      });
    } else {
      doUpdateUsage(selection.value.map((d) => d.id));
    }
  };
  /* 批量删除 */
  const removeBatch = () => {
    if (!selection.value.length) {
      message.error('请至少选择一条数据');
      return;
    }
    Modal.confirm({
      title: '提示',
      content: '确定要删除选中的AiToken吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = messageLoading('请求中..', 0);
        removeAiTokens(selection.value.map((d) => d.id))
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

  /* 禁用状态 */
  const editDisable = (checked: boolean, row: AiToken) => {
    updateAiTokenDisable(row.id, checked)
      .then((msg) => {
        row.disable = checked;
        message.success(msg);
      })
      .catch((e) => {
        message.error(e.message);
      });
  };
</script>

<script lang="ts">
  export default {
    name: 'OpenaiAiToken'
  };
</script>
