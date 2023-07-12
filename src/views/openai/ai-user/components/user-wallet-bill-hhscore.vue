<template>
  <div>
    <!-- 搜索表单 -->
    <user-wallet-bill-hhscore-search @search="reload" />
    <!-- 表格 -->
    <ele-pro-table
      ref="tableRef"
      row-key="id"
      :columns="columns"
      :datasource="datasource"
      :scroll="{ x: 900 }"
      cache-key="proUserWalletBillHhScoreTable"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <a-tag v-if="record.status === 1" color="green">成功</a-tag>
          <a-tag v-else-if="record.status === 0" color="red"> 失败</a-tag>
        </template>
        <template v-else-if="column.key === 'useFee'">
          <span style="color: #1677ff">{{ record.useFee }}</span>
        </template>
        <template v-else-if="column.key === 'useModel'">
          <a-tag>{{ record.useModel }}</a-tag>
        </template>
        <template v-else-if="column.key === 'tags'">
          <div v-if="record.tags.length > 0">
            <template v-for="(tagName, index) in record.tags" :key="index">
              <a-tag>{{ tagName }}</a-tag>
            </template>
          </div>
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <p style="margin: 0; padding-left: 50px">
          <span><a-tag>扩展属性</a-tag> {{ record.external }}</span>
          <span style="margin-left: 20px">
            <a-tag>api key</a-tag> {{ record.ukey }}
          </span>
        </p>
      </template>
    </ele-pro-table>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import { toDateString } from 'ele-admin-pro/es';
  import type {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import UserWalletBillHhscoreSearch from '@/views/openai/ai-user/components/user-wallet-bill-hhscore-search.vue';
  import { pageAiBill } from '@/api/openai/ai-bill';
  import type { AiBillParam } from '@/api/openai/ai-bill/model';
  import { User } from '@/api/system/user/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '账单ID',
      dataIndex: 'uuid',
      sorter: false,
      showSorterTooltip: false,
      width: 320
    },
    {
      title: '账单标签',
      key: 'tags',
      sorter: false,
      showSorterTooltip: false
    },
    {
      title: '模型',
      key: 'useModel',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 200
    },
    {
      title: '费用',
      key: 'useFee',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 100
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      sorter: false,
      showSorterTooltip: false,
      width: 100
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160,
      customRender: ({ text }) => toDateString(text)
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
    where.userId = props.data.userId;
    return pageAiBill({
      ...where,
      ...orders,
      ...filters,
      page,
      limit
    }).then((res) => {
      res.list = res.list.map((item) => {
        item.external = JSON.parse(item.external);
        item.tags = item.tags
          .toString()
          .split(',')
          .filter((e) => e);
        return item;
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
  const reload = (where?: AiBillParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };
  defineExpose({
    reloadTable: () => {
      reload();
    }
  });
</script>
