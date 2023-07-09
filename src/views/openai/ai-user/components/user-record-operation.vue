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
        cache-key="proUserRecordOperationTable"
        size="small"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">正常</a-tag>
            <a-tag v-else-if="record.status === 1" color="red">异常</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a @click="openDetail(record)">详情</a>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 详情弹窗 -->
    <operation-record-detail v-model:visible="showInfo" :data="current" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type { DatasourceFunction } from 'ele-admin-pro/es/ele-pro-table/types';
  import { toDateString } from 'ele-admin-pro/es';
  import OperationRecordSearch from './user-record-operation-search.vue';
  import OperationRecordDetail from './user-record-operation-detail.vue';
  import {
    pageOperationRecords
  } from '@/api/system/operation-record';
  import type {
    OperationRecord,
    OperationRecordParam
  } from '@/api/system/operation-record/model';
  import { User } from '@/api/system/user/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<any[]>([
    {
      key: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      hideInSetting: true,
      customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    },
    {
      title: '操作模块',
      dataIndex: 'module',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '操作功能',
      dataIndex: 'description',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '请求地址',
      dataIndex: 'url',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '请求方式',
      dataIndex: 'requestMethod',
      sorter: true,
      showSorterTooltip: false,
      width: 100,
      align: 'center'
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
          text: '正常',
          value: 0
        },
        {
          text: '异常',
          value: 1
        }
      ],
      filterMultiple: false,
      align: 'center'
    },
    {
      title: '耗时',
      dataIndex: 'spendTime',
      sorter: true,
      showSorterTooltip: false,
      width: 100,
      customRender: ({ text }) => text / 1000 + 's'
    },
    {
      title: '操作时间',
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
  const current = ref<OperationRecord>({
    contentType: '',
    requestContentType: '',
    module: '',
    description: '',
    url: '',
    requestMethod: '',
    method: '',
    params: '',
    result: '',
    error: '',
    spendTime: 0,
    os: '',
    device: '',
    browser: '',
    ip: '',
    status: 0,
    createTime: '',
    nickname: '',
    username: ''
  });

  // 是否显示查看弹窗
  const showInfo = ref(false);

  // 表格数据源
  const datasource: DatasourceFunction = ({
    page,
    limit,
    where,
    orders,
    filters
  }) => {
    where.userId = props.data.userId;
    return pageOperationRecords({
      ...where,
      ...orders,
      ...filters,
      page,
      limit
    });
  };

  /* 刷新表格 */
  const reload = (where?: OperationRecordParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 详情 */
  const openDetail = (row: OperationRecord) => {
    current.value = row;
    showInfo.value = true;
  };

  const props = withDefaults(
    defineProps<{
      // 修改回显的数据
      data: User;
    }>(),
    {}
  );
  defineExpose({
    reloadTable: () => {
      reload();
    }
  });
</script>
