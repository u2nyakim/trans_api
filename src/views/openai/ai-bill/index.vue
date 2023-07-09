<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <ai-bill-search  @search="reload" />
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :scroll="{ x: 1000 }"
        :where="defaultWhere"
        cache-key="proOpenaiBillTable"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="exportData">
              <template #icon>
                <download-outlined />
              </template>
              <span>导出</span>
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
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="red">失败</a-tag>
            <a-tag v-else-if="record.status === 1" color="green">成功</a-tag>
          </template>

          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="openDetail(record)">详情</a>
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
    <!-- 详情弹窗 -->
    <ai-bill-detail v-model:visible="showInfo" :data="current" />
  </div>
</template>

<script  lang="ts" setup>
import {ref} from "vue";
import {messageLoading, toDateString} from "ele-admin-pro";
import type { EleProTable } from 'ele-admin-pro/es';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';


import {utils, writeFile} from "xlsx";
import {message} from "ant-design-vue/es";

import {listAiBill,pageAiBill,removeAiBill} from "@/api/openai/ai-bill";
import type{AiBill,AiBillParam} from "@/api/openai/ai-bill/model";

import AiBillSearch from './components/ai-bill-search.vue';
import AiBillDetail from './components/ai-bill-detail.vue';

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格列配置
const columns = ref<ColumnItem[]>(
  [
    {
      key: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      hideInSetting: true,
      customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    },
    {
      title: '账单uuid',
      dataIndex: 'uuid',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '账单标签',
      dataIndex: 'tags',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '账单费用',
      dataIndex: 'fee',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      sorter: true,
      showSorterTooltip: false,
      width: 100,
      filters: [
        {
          text: '失败',
          value: 0
        },
        {
          text: '成功',
          value: 1
        }
      ],
      filterMultiple: false,
      align: 'center'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text),
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 90,
      align: 'center',
      fixed: 'right'
    }
  ]);

// 当前选中数据
const current = ref<AiBill>({
  uuid: '',
  external: '',
  tags: '',
  fee: '',
  status: 0,
  create_time: '',
  update_time: ''
});
// 是否显示查看弹窗
const showInfo = ref(false);

// 表格数据源
const datasource: DatasourceFunction = ({page, limit, where, orders, filters}) => {
  return pageAiBill({
    ...where,
    ...orders,
    ...filters,
    page,
    limit
  });
};
/* 刷新表格 */
const reload = (where?: AiBillParam) => {
  tableRef?.value?.reload({ page: 1, where });
};

/* 导出数据 */
const exportData = () => {
  const array = [
    [
      '账单uuid',
      '账单标签',
      '账单费用',
      '状态',
      '创建时间',
    ]
  ];
// 请求查询全部(不分页)的接口
const hide = messageLoading('请求中..', 0);
tableRef.value?.doRequest(({ where, orders, filters }) => {
  listAiBill({ ...where, ...orders, ...filters })
    .then((data) => {
      hide();
      data.forEach((d) => {
        console.log('==============',d)
        array.push([
          d.uuid,
          d.tags,
          d.fee,
          ['失败', '成功'][d.status],
          toDateString(d.createTime)
        ]);
      });
      writeFile(
        {
          SheetNames: ['Sheet1'],
          Sheets: {
            Sheet1: utils.aoa_to_sheet(array)
          }
        },
        '账单列表.xlsx'
      );
    })
    .catch((e) => {
      hide();
      message.error(e.message);
    });
  });
};

/* 删除单个 */
const remove = (row: AiBill) => {
  const hide = messageLoading('请求中..', 0);
  removeAiBill(row.id)
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
/* 详情 */
const openDetail = (row: AiBill) => {
  current.value = row;
  showInfo.value = true;
};
</script>

<script lang="ts">
export default {
  name: 'ApiOpenaiAiBill'
};
</script>
