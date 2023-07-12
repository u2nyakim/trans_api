<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <user-wallet-bill-search @search="reload" />
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :scroll="{ x: 900 }"
        cache-key="proSystemLoginRecordTable"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag v-if="dataType === 'balance'" color="green">RMB</a-tag>
            <a-tag v-else-if="dataType === 'dollar'" color="orange">美金</a-tag>
            <a-tag v-else-if="dataType === 'points'" color="orange">积分</a-tag>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-tag v-if="record.action === 'inc'" color="cyan">增加</a-tag>
            <a-tag v-else-if="record.action === 'dec'" color="purple">
              减少
            </a-tag>
          </template>
          <template v-else-if="column.key === 'reason'">
            <a-tag v-if="record.reason === 'OP.INC'" color="cyan">
              后台增加
            </a-tag>
            <a-tag v-else-if="record.reason === 'OP.DEC'" color="purple">
              后台减少
            </a-tag>
            <a-tag v-else-if="record.reason === 'AI.CHAT'" color="purple">
              会话聊天
            </a-tag>
            <a-tag v-else>
              {{ record.reason }}
            </a-tag>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { toDateString } from 'ele-admin-pro/es';
  import UserWalletBillSearch from '@/views/openai/ai-user/components/user-wallet-bill-search.vue';
  import {
    pageWalletBalance,
    pageWalletDollar,
    pageWalletPoints
  } from '@/api/system/user-wallet';
  import type { UserWalletAssetLogParam } from '@/api/system/user-wallet/model';
  import { timeAgo } from 'ele-admin-pro/es/utils/core';
  import { User } from '@/api/system/user/model';

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
      title: '资产类型',
      key: 'type',
      sorter: false,
      showSorterTooltip: false,
      width: 100,
      align: 'left'
    },

    {
      title: '操作前余额',
      dataIndex: 'before',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160
    },
    {
      title: '操作后余额',
      dataIndex: 'after',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160,
      customRender: ({ record }) => record.before + record.amount
    },
    {
      title: '金额',
      dataIndex: 'amount',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160
    },
    {
      title: '操作类型',
      key: 'action',
      sorter: true,
      showSorterTooltip: false,
      width: 100,
      align: 'left'
    },
    {
      title: '源',
      key: 'reason',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 120
    },
    {
      title: '备注',
      dataIndex: 'remark',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => timeAgo(text),
      width: 160
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text),
      width: 160
    }
  ]);

  const dataType = ref('balanc');
  // 表格数据源
  const datasource: DatasourceFunction = ({
    page,
    limit,
    where,
    orders,
    filters
  }) => {
    dataType.value = where.type;
    let queryFunction;
    if (where.type === 'dollar') {
      queryFunction = pageWalletDollar;
    } else if (where.type === 'points') {
      queryFunction = pageWalletPoints;
    } else {
      queryFunction = pageWalletBalance;
    }
    where.userId = props.data.userId;
    return queryFunction({
      ...where,
      ...orders,
      ...filters,
      page,
      limit
    }).then((res) => {
      res.list = res.list.map(function (d) {
        if (where.type === 'dollar') {
          d.action = d.dollar > 0 ? 'inc' : 'dec';
          d.before = d['beforeDollar'];
          d.amount = d.dollar;
        } else if (where.type === 'points') {
          d.action = d.points > 0 ? 'inc' : 'dec';
          d.before = d['beforePoints'];
          d.amount = d.points;
        } else {
          d.action = d.amount > 0 ? 'inc' : 'dec';
          d.before = d['beforeBalance'];
        }
        return d;
      });
      return res;
    });
  };

  const props = withDefaults(
    defineProps<{
      // 修改回显的数据
      data: User;
    }>(),
    {}
  );

  /* 刷新表格 */
  const reload = (where?: UserWalletAssetLogParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };
  defineExpose({
    reloadTable: () => {
      reload();
    }
  });
</script>
