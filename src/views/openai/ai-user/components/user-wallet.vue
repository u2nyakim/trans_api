<!-- 用户钱包弹窗 -->
<template>
  <ele-modal
    width="100%"
    wrap-class-name="full-modal"
    :visible="visible"
    title="钱包管理"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
  >
    <template #footer></template>
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1">
        <template #tab>
          <span>
            <solution-outlined />
            余额变动记录
          </span>
        </template>
        <user-wallet-bill />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #tab>
          <span>
            <wallet-outlined />
            余额管理
          </span>
        </template>
        <div>
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
                  styleResponsive ? { md: 6, sm: 24, xs: 24 } : { span: 12 }
                "
              >
                <div style="background-color: #ececec; padding: 6px">
                  <a-row :gutter="16">
                    <a-col :span="12">
                      <a-card title="余额" :bordered="false">
                        <span style="font-size: 18px">{{ data.money }}</span>
                      </a-card>
                    </a-col>
                    <a-col :span="12">
                      <a-card title="会话积分" :bordered="false">
                        <span style="font-size: 18px">{{ data.score }}</span>
                      </a-card>
                    </a-col>
                  </a-row>
                </div>
              </a-col>
              <a-col
                v-bind="
                  styleResponsive ? { md: 10, sm: 24, xs: 24 } : { span: 12 }
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
                        v-model:value="walletOper.Pperate"
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
                        <a-select-option value="money">余额</a-select-option>
                        <a-select-option value="score">
                          会话积分
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
      </a-tab-pane>
    </a-tabs>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import type { User } from '@/api/system/user/model';
  import { SolutionOutlined, WalletOutlined } from '@ant-design/icons-vue';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { Rule } from 'ant-design-vue/es/form';
  import UserWalletBill from '@/views/openai/ai-user/components/user-wallet-bill.vue';

  const activeKey = ref('1');
  const walletOperLoading = ref(false);
  const walletOperSubmit = () => {};
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  const walletOper = ref({
    Pperate: 1,
    AssetType: 'money',
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

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data: User;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
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
      height: calc(100vh);
    }
    .ant-modal-body {
      flex: 1;
    }
  }
</style>
