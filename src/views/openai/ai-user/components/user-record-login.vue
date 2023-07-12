<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <user-record-login-search @search="reload" />
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
          <template v-if="column.key === 'loginType'">
            <a-tag v-if="record.loginType === 0" color="success">
              登录成功
            </a-tag>
            <a-tag v-else-if="record.loginType === 1" color="error">
              登录失败
            </a-tag>
            <a-tag v-else-if="record.loginType === 2" color="warning">
              退出登录
            </a-tag>
            <a-tag v-else-if="record.loginType === 3" color="default">
              续签token
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
  import UserRecordLoginSearch from '@/views/openai/ai-user/components/user-record-login-search.vue';
  import { pageLoginRecords } from '@/api/system/login-record';
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
      title: '操作系统',
      dataIndex: 'os',
      sorter: false,
      showSorterTooltip: false,
      width: 100,
      align: 'left'
    },

    {
      title: '设备名',
      dataIndex: 'device',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '浏览器类型',
      dataIndex: 'browser',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 100
    },
    {
      title: 'ip地址',
      dataIndex: 'ip',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 120
    },
    {
      title: '操作类型',
      key: 'loginType',
      sorter: false,
      showSorterTooltip: false,
      width: 100,
      align: 'left'
    },
    {
      title: '备注',
      dataIndex: 'reason',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '记录',
      dataIndex: 'createTime',
      sorter: true,
      customRender: ({ text }) =>
        toDateString(text) + '  🚀 (' + timeAgo(text) + ')',
      width: 320
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({
    page,
    limit,
    where,
    orders,
    filters
  }) => {
    where.username = props.data.username;
    return pageLoginRecords({
      ...where,
      ...orders,
      ...filters,
      page,
      limit
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
