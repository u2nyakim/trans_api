<template>
  <div>
    <a-card :bordered="false">
      <a-form
        :label-col="
          styleResponsive ? { xl: 4, lg: 5, md: 7, sm: 4 } : { flex: '90px' }
        "
        :wrapper-col="
          styleResponsive ? { xl: 20, lg: 19, md: 17, sm: 20 } : { flex: '1' }
        "
      >
        <a-row :gutter="8">
          <a-col
            v-bind="
              styleResponsive
                ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
                : { span: 8 }
            "
          >
            <a-form-item label="账单ID">
              <a-input
                v-model:value.trim="defaultWhere.uuid"
                placeholder="请输入账单ID"
                allow-clear
              />
            </a-form-item>
          </a-col>

          <a-col
            v-bind="
              styleResponsive
                ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
                : { span: 8 }
            "
          >
            <a-form-item label="状态">
              <a-select
                v-model:value="defaultWhere.status"
                placeholder="请选择"
                allow-clear
              >
                <a-select-option :value="0">成功</a-select-option>
                <a-select-option :value="1">失败</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col
            v-bind="
              styleResponsive
                ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
                : { span: 8 }
            "
          >
            <a-form-item class="ele-text-right" :wrapper-col="{ span: 24 }">
              <a-space>
                <a-button type="primary" @click="reload">查询</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="userId"
        :columns="columns"
        :datasource="datasource"
        v-model:selection="selection"
        :scroll="{ x: 1000 }"
        :where="defaultWhere"
        cache-key="proAiUserTable"
      >
        <template #bodyCell="{ column, record }">
          <!-- 账单ID -->
          <template v-if="column.key === 'uuid'">
            <router-link :to="'/openai/ai-user/details?id=' + record.uuid">
              {{ record.uuid }}
            </router-link>
          </template>
          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <a-badge
              :status="(['processing', 'error'][record.status] as any)"
              :text="['成功', '失败'][record.status]"
            />
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { toDateString } from 'ele-admin-pro/es';
  import { pageUsers } from '@/api/system/user';
  import type { User, UserParam } from '@/api/system/user/model';
  import { useI18n } from 'vue-i18n';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  const { t } = useI18n();
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

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
      width: 80,
      title: t('list.basic.table.avatar'),
      key: 'avatar',
      dataIndex: 'avatar',
      ellipsis: true,
      align: 'center'
    },
    {
      title: '账单ID',
      dataIndex: 'uuid',
      sorter: false,
      showSorterTooltip: false
    },
    {
      title: '账单费用',
      dataIndex: 'fee',
      sorter: false,
      showSorterTooltip: false
    },
    {
      title: '账单Tags',
      dataIndex: 'tags',
      sorter: false,
      width: 130,
      showSorterTooltip: false
    },
    {
      title: '账单属性',
      dataIndex: 'external',
      sorter: true,
      width: 130,
      showSorterTooltip: false
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160,
      customRender: ({ text }) => toDateString(text)
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      sorter: true,
      showSorterTooltip: false,
      width: 90,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 350,
      align: 'center'
    }
  ]);

  // 表格选中数据
  const selection = ref<User[]>([]);

  // 当前编辑数据
  const current = ref<User | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 默认搜索条件
  const defaultWhere = reactive({
    uuid: '',
    status: ''
  });

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageUsers({ ...where, ...orders, page, limit });
  };

  /* 搜索 */
  const reload = (where?: UserParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: User) => {
    current.value = row ?? null;
    showEdit.value = true;
  };
  const showBill = ref(false);

  const openBill = (row?: User) => {
    current.value = row ?? null;
    showBill.value = true;
  };
</script>
