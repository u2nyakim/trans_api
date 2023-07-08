<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <user-search :where="defaultWhere" @search="reload" />
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
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
              <template #icon>
                <plus-outlined />
              </template>
              <span>新建</span>
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <!-- 头像列 -->
          <template v-if="column.key === 'avatar'">
            <a-avatar
              v-if="record.avatar"
              :src="record.avatar"
              :size="32"
              @click.stop=""
            />
            <a-avatar v-else class="ele-bg-primary" :size="32" @click.stop="">
              {{
                record.nickname && record.nickname.length > 2
                  ? record.nickname.substring(record.nickname.length - 2)
                  : record.nickname
              }}
            </a-avatar>
          </template>
          <!-- 用户名列 -->
          <template v-else-if="column.key === 'nickname'">
            <router-link :to="'/openai/ai-user/details?id=' + record.userId">
              {{ record.nickname }}
            </router-link>
          </template>
          <!-- 状态列 -->
          <template v-else-if="column.key === 'status'">
            <a-badge
              :status="(['processing', 'error'][record.status] as any)"
              :text="['正常', '冻结'][record.status]"
            />
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="openWallet(record)">用户钱包</a>
              <a-divider type="vertical" />
              <a @click="openEdit(record)">白名单管理</a>
              <a-divider type="vertical" />
              <a @click="openEdit(record)">修改</a>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <user-edit v-model:visible="showEdit" :data="current" @done="reload" />
    <!-- 用户账单 -->
    <user-bill v-model:visible="showBill" :data="current" @done="reload" />
    <!-- 余额管理 -->
    <user-wallet v-model:visible="showWallet" :data="current" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { toDateString } from 'ele-admin-pro/es';
  import UserSearch from './components/user-search.vue';
  import UserEdit from './components/user-edit.vue';
  import UserBill from './components/user-bill.vue';
  import UserWallet from './components/user-wallet.vue';
  const showWallet = ref(false);

  import { pageUsers } from '@/api/system/user';
  import type { User, UserParam } from '@/api/system/user/model';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();

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
      title: '用户账号',
      dataIndex: 'username',
      sorter: false,
      showSorterTooltip: false
    },
    {
      title: '用户名',
      key: 'nickname',
      dataIndex: 'nickname',
      sorter: false,
      showSorterTooltip: false
    },
    {
      title: '邮箱号',
      dataIndex: 'email',
      width: 150,
      align: 'center',
      sorter: false,
      showSorterTooltip: false
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      sorter: false,
      width: 130,
      showSorterTooltip: false
    },
    {
      title: '账户余额(RMB)',
      dataIndex: 'money',
      sorter: true,
      width: 130,
      showSorterTooltip: false
    },
    {
      title: '会话积分(HhScore)',
      dataIndex: 'score',
      sorter: true,
      width: 160,
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
    username: '',
    nickname: ''
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

  const openWallet = (row: User) => {
    current.value = row;
    showWallet.value = true;
  };
</script>

<script lang="ts">
  export default {
    name: 'AiUser'
  };
</script>
