<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <operation-record-search @search="reload" />
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :scroll="{ x: 1000 }"
        cache-key="proSystemOperationRecordTable"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="exportData">
              <template #icon>
                <download-outlined />
              </template>
              <span>导出</span>
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, info }">
          <template v-if="column.key === 'status'">
            <a-tag v-if="info.status === 0" color="green">失败</a-tag>
            <a-tag v-else-if="info.status === 1" color="red">成功</a-tag>
          </template>
<!--          <template v-else-if="column.key === 'action'">-->
<!--            <a @click="openDetail(info)">详情</a>-->
<!--          </template>-->
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 详情弹窗 -->
    <operation-record-detail v-model:visible="showInfo" :data="current" />
  </div>
</template>

<script  lang="ts" setup>
import {ref} from "vue";
// import {ColumnItem} from "ele-admin-pro/es/ele-pro-table/types";
import {messageLoading, toDateString} from "ele-admin-pro";
import type { EleProTable } from 'ele-admin-pro/es';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';


import {utils, writeFile} from "xlsx";
import {message} from "ant-design-vue/es";

import {listAiBill,pageAiBill} from "@/api/openai/ai-bill";
import type{AiBill,AiBillParam} from "@/api/openai/ai-bill/model";


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
  tags: '',
  fee: '',
  status: 0,
  createTime: ''
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
      '账单uuid111',
      '账单标签',
      '账单费用',
      '状态',
      '创建时间',
      '操作'
    ]
  ];
// 请求查询全部(不分页)的接口
const hide = messageLoading('请求中..', 0);
tableRef.value?.doRequest(({ where, orders, filters }) => {
  listAiBill({ ...where, ...orders, ...filters })
    .then((data) => {
      hide();
      data.forEach((d) => {
        array.push([
          d.uuid,
          d.tags,
          d.fee,
          // d.requestMethod,
          ['失败', '成功'][d.status],
          // d.spendTime / 1000 + 's',
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

</script>

<script lang="ts">
export default {
  name: 'ApiOpenaiAiBill'
};
</script>
