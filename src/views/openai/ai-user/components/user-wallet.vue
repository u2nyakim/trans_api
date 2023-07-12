<!-- 用户钱包弹窗 -->
<template>
  <ele-modal
    style="width: 100%"
    wrap-class-name="full-modal"
    :visible="visible"
    title="钱包管理"
    :body-style="{ paddingBottom: '1px' }"
    @update:visible="updateVisible"
  >
    <template #footer></template>
    <div style="position: relative">
      <a-tabs v-model:activeKey="activeKey">
        <a-tab-pane key="1">
          <template #tab>
            <span>
              <solution-outlined />
              余额变动记录
            </span>
          </template>
          <div style="position: relative">
            <user-wallet-bill ref="userWalletBillRef" :data="props.data" />
          </div>
        </a-tab-pane>
        <a-tab-pane key="2">
          <template #tab>
            <span>
              <solution-outlined />
              会话账单记录
            </span>
          </template>
          <user-wallet-bill-hhscore
            ref="userWalletBillHhscoreRef"
            :data="props.data"
          />
        </a-tab-pane>
        <a-tab-pane key="3">
          <template #tab>
            <span>
              <wallet-outlined />
              余额管理
            </span>
          </template>
          <div>
            <a-alert
              message="操作无法撤销，请注意核对金额。"
              type="info"
              show-icon
            />
            <div style="margin-top: 10px">
              <a-form
                :rules="rules"
                :label-col="
                  styleResponsive ? { md: 4, sm: 4, xs: 24 } : { flex: '90px' }
                "
                :wrapper-col="
                  styleResponsive ? { md: 20, sm: 20, xs: 24 } : { flex: '1' }
                "
              >
                <a-row :gutter="16">
                  <a-col
                    v-bind="
                      styleResponsive ? { md: 8, sm: 24, xs: 24 } : { span: 12 }
                    "
                  >
                    <div style="background-color: #ececec; padding: 6px">
                      <a-row :gutter="3">
                        <a-col :span="8">
                          <a-card title="余额(RMB)" :bordered="false">
                            <span style="font-size: 18px">{{
                              user?.wallet?.balance || 0
                            }}</span>
                          </a-card>
                        </a-col>
                        <a-col :span="8">
                          <a-card title="余额(美金账户)" :bordered="false">
                            <span style="font-size: 18px">{{
                              user?.wallet?.dollar || 0
                            }}</span>
                          </a-card>
                        </a-col>
                        <a-col :span="8">
                          <a-card title="会话积分(HHScore)" :bordered="false">
                            <span style="font-size: 18px">{{
                              user?.wallet?.points || 0
                            }}</span>
                          </a-card>
                        </a-col>
                      </a-row>
                    </div>
                  </a-col>
                  <a-col
                    v-bind="
                      styleResponsive ? { md: 8, sm: 24, xs: 24 } : { span: 12 }
                    "
                  >
                    <a-form-item label="资产操作" name="walletOper.Quota">
                      <a-input-number
                        v-model:value="walletOper.Quota"
                        :min="0"
                        :max="9999999999"
                        placeholder="请输入额度"
                        style="width: 100%"
                      >
                        <template #addonBefore>
                          <a-select
                            v-model:value="walletOper.Operate"
                            style="width: 90px"
                          >
                            <a-select-option :value="1">增加</a-select-option>
                            <a-select-option :value="0">减少</a-select-option>
                          </a-select>
                        </template>
                        <template #addonAfter>
                          <a-select
                            v-model:value="walletOper.AssetType"
                            style="width: 140px"
                          >
                            <a-select-option value="balance">
                              RMB余额
                            </a-select-option>
                            <a-select-option value="points">
                              会话积分
                            </a-select-option>
                            <a-select-option value="dollar">
                              美金账户
                            </a-select-option>
                          </a-select>
                        </template>
                      </a-input-number>
                    </a-form-item>
                    <a-form-item label="操作备注" name="walletOper.Comments">
                      <a-textarea
                        :rows="4"
                        :maxlength="200"
                        placeholder="请输入备注 (为何原因充值或扣款,备注原因用户可见)"
                        v-model:value="walletOper.Comments"
                      />
                    </a-form-item>
                    <a-form-item
                      :wrapper-col="
                        styleResponsive ? { sm: { offset: 4 } } : { offset: 3 }
                      "
                    >
                      <a-space size="middle">
                        <a-button
                          type="primary"
                          :loading="walletOperLoading"
                          @click="walletOperSubmit"
                        >
                          提交操作
                        </a-button>
                      </a-space>
                    </a-form-item>
                  </a-col>
                </a-row>
              </a-form>
            </div>
            <a-alert message="余额操作记录(仅显示最新的10条)" type="success" v-if="false" />
            <div style="margin-top: 10px" v-if="false">
              <a-table
                :columns="logColumns"
                :data-source="logData"
                size="small"
                :pagination="false"
              >
                <template #bodyCell="{ column, record }">
                  <template v-if="column.key === 'fundType'">
                    <a-tag v-if="record.fundType === 10" color="green">
                      RMB余额
                    </a-tag>
                    <a-tag v-else-if="record.fundType === 20" color="orange">
                      会话积分
                    </a-tag>
                  </template>
                  <template v-else-if="column.key === 'changeType'">
                    <a-tag v-if="record.changeType === 'i'" color="cyan">
                      增加
                    </a-tag>
                    <a-tag v-else-if="record.changeType === 'd'" color="purple">
                      减少
                    </a-tag>
                  </template>
                </template>
              </a-table>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import type { User } from '@/api/system/user/model';
  import { SolutionOutlined, WalletOutlined } from '@ant-design/icons-vue';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { Rule } from 'ant-design-vue/es/form';
  import UserWalletBill from '@/views/openai/ai-user/components/user-wallet-bill.vue';
  import UserWalletBillHhscore from '@/views/openai/ai-user/components/user-wallet-bill-hhscore.vue';
  import { getUser, updateUserWallet } from '@/api/system/user';
  import { message } from 'ant-design-vue/es';
  import { toDateString } from 'ele-admin-pro';
  const logData = ref([]);
  const queryLogData = () => {
    // pageUserFundChanges({
    //   userId: user.value.userId,
    //   limit: 10,
    //   source: '后台操作'
    // }).then((res) => {
    //   logData.value = res.list;
    // });
  };
  const userWalletBillRef = ref<UserWalletBill | null>(null);
  const userWalletBillHhscoreRef = ref<UserWalletBillHhscore | null>(null);
  const logColumns = ref([
    {
      title: '资产类型',
      key: 'fundType',
      sorter: true,
      showSorterTooltip: false,
      width: 100,
      align: 'left'
    },

    {
      title: '操作前余额',
      dataIndex: 'beforeMoney',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160
    },
    {
      title: '操作后余额',
      dataIndex: 'afterMoney',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160
    },
    {
      title: '操作金额',
      dataIndex: 'money',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 160
    },
    {
      title: '操作类型',
      key: 'changeType',
      sorter: false,
      showSorterTooltip: false,
      width: 100,
      align: 'center'
    },
    {
      title: '来源',
      dataIndex: 'source',
      sorter: false,
      showSorterTooltip: false,
      ellipsis: true,
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'reason',
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
      customRender: ({ text }) => toDateString(text),
      width: 160
    }
  ]);
  const activeKey = ref('1');
  const walletOperLoading = ref(false);
  const walletOperSubmit = () => {
    if (walletOper.value.Quota <= 0) {
      message.error('金额必须大于0');
      return false;
    }
    if(!walletOper.value.Comments){
      message.error('后台操作资产必须填写备注');
      return false;
    }
    updateUserWallet({
      userId: props.data.userId,
      assetType: walletOper.value.AssetType,
      quota: walletOper.value.Quota,
      comments: walletOper.value.Comments,
      operate: walletOper.value.Operate
    }).then((msg) => {
      message.success(msg);
      emit('done');
      if (props.data.userId) {
        // 重新查询余额(确保一致性)
        getUser(props.data.userId).then((u) => {
          user.value = u;
        });
        // 查询最新操作记录
        queryLogData();
      }
      walletOper.value.Quota = 0;
      walletOper.value.Comments = '';
    });
  };
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const walletOper = ref({
    Operate: 1,
    AssetType: 'points',
    Quota: 0,
    Comments: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    'walletOper.Quota': [
      {
        required: true,
        type: 'string',
        validator: async (_rule: Rule) => {
          if (!walletOper.value.Quota) {
            return Promise.reject('金额必须大于0');
          }
          if (walletOper.value.Quota < 0) {
            return Promise.reject('金额不能为负数');
          }
          return Promise.resolve();
        },
        trigger: 'blur'
      }
    ],
    'walletOper.Comments': [
      {
        required: true,
        type: 'string',
        validator: async (_rule: Rule) => {
          if (!walletOper.value.Comments) {
            return Promise.reject('备注不能为空');
          }
          return Promise.resolve();
        },
        trigger: 'blur'
      }
    ]
  });

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = withDefaults(
    defineProps<{
      // 弹窗是否打开
      visible: boolean;
      // 修改回显的数据
      data: User;
    }>(),
    {
      visible: false
    }
  );

  const user = ref<User>({
    userId: undefined,
    username: '',
    nickname: '',
    sexName: '',
    phone: '',
    roles: [],
    createTime: undefined,
    status: undefined,
    wallet: {
      points: 0,
      balance: 0,
      dollar: 0
    }
  });
  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        user.value = props.data;
      }
      if (visible && props.data.userId) {
        getUser(props.data.userId).then((user) => {
          user.value = user;
        });
      }
    }
  );

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
  watch(
    () => activeKey.value,
    (val) => {
      if (val == '3') {
        queryLogData();
      }
      if (val == '1' && userWalletBillRef.value) {
        userWalletBillRef.value?.reloadTable();
      }
      if (val == '2' && userWalletBillHhscoreRef.value) {
        userWalletBillHhscoreRef.value?.reloadTable();
      }
    }
  );
</script>

<style lang="less">
  .full-modal {
    .ant-modal {
      max-width: 100%;
      top: 0;
      padding-bottom: 0;
      margin: 0;
    }
    .ant-modal-content {
      display: flex;
      flex-direction: column;
      min-height: calc(100vh);
      height: auto;
    }
    .ant-modal-body {
      flex: 1;
    }
  }
</style>
