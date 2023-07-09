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
        <template v-else-if="column.key === 'fee'">
          <span style="color: #1677ff" v-if="record.fee">{{ record.fee }}</span>
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
      showSorterTooltip: false
      // width: 320
    },
    {
      title: '账单标签',
      key: 'tags',
      sorter: false,
      showSorterTooltip: false
    },

    {
      title: '费用',
      key: 'fee',
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
      width: 100,
      filters: [
        {
          text: '成功',
          value: 1
        },
        {
          text: '失败',
          value: 0
        }
      ],
      filterMultiple: false
    },
    {
      title: '请求时间',
      dataIndex: 'ip',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160,
      customRender: ({ record }) => toDateString(record.external.time)
    },
    {
      title: '结束时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160,
      customRender: ({ text }) => toDateString(text)
    },
    {
      title: '耗时',
      dataIndex: 'timeer',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160,
      customRender: ({ record }) => {
        const t = (
          (Date.parse(record.createTime) - record.external.time) /
          1000
        ).toFixed(3);
        if (isNaN(Number(t))) {
          return '超时';
        } else {
          return t + 's';
        }
      }
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
