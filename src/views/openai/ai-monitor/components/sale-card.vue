<template>
  <a-card :bordered="false" :body-style="{ padding: 0 }">
    <a-tabs
      size="large"
      v-model:activeKey="saleSearch.type"
      class="monitor-card-tabs"
      @change="onSaleTypeChange"
    >
      <a-tab-pane tab="key-money token使用情况Bar" key="saleroom" />
      <a-tab-pane tab="用户会话积分消费使用情况Bar" key="visits" />
      <template #rightExtra>
        <a-space
          size="middle"
          :class="[
            'analysis-tabs-extra',
            { 'hidden-lg-and-down': styleResponsive }
          ]"
        >
          <a-radio-group v-model:value="saleSearch.dateType">
            <a-radio-button value="1">今天</a-radio-button>
            <a-radio-button value="2">本周</a-radio-button>
            <a-radio-button value="3">本月</a-radio-button>
            <a-radio-button value="4">本年</a-radio-button>
          </a-radio-group>
        </a-space>
      </template>
    </a-tabs>
    <div style="padding-bottom: 10px">
      <a-row :gutter="16">
        <a-col
          v-bind="
            styleResponsive ? { lg: 24, md: 24, sm: 24, xs: 24 } : { span: 17 }
          "
        >
          <div v-if="saleSearch.type === 'saleroom'" class="demo-monitor-title">
            消耗Token数
          </div>
          <div v-else class="demo-monitor-title">消费积分数</div>
          <v-chart
            ref="saleChartRef"
            :option="saleChartOption"
            style="height: 320px"
          />
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { use } from 'echarts/core';
  import type { EChartsCoreOption } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { BarChart } from 'echarts/charts';
  import { GridComponent, TooltipComponent } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import { getSaleroomList } from '@/api/dashboard/analysis';
  import type { SaleroomData } from '@/api/dashboard/analysis/model';
  import useEcharts from '@/utils/use-echarts';
  import {
    totalUseFee24hour,
    totalUseToken24hour
  } from '@/api/openai/ai-dashboard';
  import axios from 'axios';

  use([CanvasRenderer, BarChart, GridComponent, TooltipComponent]);

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  //
  const saleChartRef = ref<InstanceType<typeof VChart> | null>(null);

  useEcharts([saleChartRef]);

  // 销售额柱状图配置
  const saleChartOption: EChartsCoreOption = reactive({});


  // 销售量趋势数据
  const saleroomData1 = ref<SaleroomData[]>([]);

  // 访问量趋势数据
  const saleroomData2 = ref<SaleroomData[]>([]);

  interface SaleSearchType {
    type: string;
    dateType: string;
  }

  // 销售量搜索参数
  const saleSearch = reactive<SaleSearchType>({
    type: 'saleroom',
    dateType: '1'
  });
  watch(
    () => saleSearch.dateType,
    () => {
      getSaleroomData();
    }
  );
  const stat24hour = (data) => {
    // 获取当前时间
    const currentTime = new Date();
    // 倒推24小时的时间
    const twentyFourHoursAgo = new Date(currentTime.getTime());
    // 整理数据
    const formattedData = [];
    for (let i = 24; i > 0; i--) {
      const hour = twentyFourHoursAgo.getHours() - i + 1;
      const datetimeHour = new Date(
        twentyFourHoursAgo.getFullYear(),
        twentyFourHoursAgo.getMonth(),
        twentyFourHoursAgo.getDate(),
        hour,
        0,
        0
      );
      const item = data.find((item) => new Date(item.key).getHours() === hour);

      formattedData.push({
        key:
          (datetimeHour.getDate() < twentyFourHoursAgo.getDate()
            ? twentyFourHoursAgo.getDate() + '日'
            : '') + `${datetimeHour.getHours()}时`,
        value: item ? item.value : 0
      });
    }
    return formattedData;
  };
  const stat7days = (data) => {
    // 获取当前时间
    const currentTime = new Date();
    // 倒推7天的时间
    const sevenDaysAgo = new Date(
      currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    // 整理数据
    const formattedData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(
        sevenDaysAgo.getFullYear(),
        sevenDaysAgo.getMonth(),
        sevenDaysAgo.getDate() + i + 1
      );
      const item = data.find(
        (item) => new Date(item.key).getDate() === date.getDate()
      );
      formattedData.push({
        key: date.toLocaleDateString(),
        value: item ? item.value : 0
      });
    }
    return formattedData;
  };
  const stat30days = (data) => {
    // 获取当前时间
    const currentTime = new Date();
    // 倒推7天的时间
    const sevenDaysAgo = new Date(
      currentTime.getTime() - 7 * 24 * 60 * 60 * 1000
    );
    // 整理数据
    const formattedData = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date(
        sevenDaysAgo.getFullYear(),
        sevenDaysAgo.getMonth(),
        sevenDaysAgo.getDate() + i
      );
      const item = data.find(
        (item) => new Date(item.key).getDate() === date.getDate()
      );

      formattedData.push({
        key: date.toLocaleDateString(),
        value: item ? item.value : 0
      });
    }
    return formattedData;
  };
  const stat12months = (data) => {
    // 获取当前时间
    const currentTime = new Date();
    // 倒推12个月的时间
    const twelveMonthsAgo = new Date(
      currentTime.getFullYear(),
      currentTime.getMonth() - 11,
      currentTime.getDate()
    );
    // 整理数据
    const formattedData = [];
    for (let i = 0; i < 12; i++) {
      const month = new Date(
        twelveMonthsAgo.getFullYear(),
        twelveMonthsAgo.getMonth() + i,
        1
      );
      const item = data.find(
        (item) => new Date(item.key).getMonth() === month.getMonth()
      );

      formattedData.push({
        key: month.toLocaleString('default', { month: 'long' }),
        value: item ? item.value : 0
      });
    }
    return formattedData;
  };
  /* 获取销售量数据 */
  const getSaleroomData = () => {
    axios
      .all([
        totalUseToken24hour({ dateType: saleSearch.dateType }),
        totalUseFee24hour({ dateType: saleSearch.dateType })
      ])
      .then(
        axios.spread(function (useToken, useFee) {
          useToken = useToken.map((item) => {
            return {
              key: item['d'],
              value: item['t']
            };
          });
          useFee = useFee.map((item) => {
            return {
              key: item['d'],
              value: item['t']
            };
          });
          if (saleSearch.dateType == 1) {
            saleroomData1.value = stat24hour(useToken);
            saleroomData2.value = stat24hour(useFee);
          } else if (saleSearch.dateType == 2) {
            saleroomData1.value = stat7days(useToken);
            saleroomData2.value = stat7days(useFee);
          } else if (saleSearch.dateType == 3) {
            saleroomData1.value = stat30days(useToken);
            saleroomData2.value = stat30days(useFee);
          } else if (saleSearch.dateType == 4) {
            saleroomData1.value = stat12months(useToken);
            saleroomData2.value = stat12months(useFee);
          }
          console.log("[EA]", saleroomData1.value)
          console.log("[EB]", saleroomData2.value)
          onSaleTypeChange();
        })
      );
    return;
    getSaleroomList()
      .then((data) => {
        saleroomData1.value = data.list1;
        saleroomData2.value = data.list2;
        onSaleTypeChange();
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  /* 销售量tab选择改变事件 */
  const onSaleTypeChange = () => {
    if (saleSearch.type === 'saleroom') {
      Object.assign(saleChartOption, {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: saleroomData1.value.map((d) => d.key)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            data: saleroomData1.value.map((d) => d.value)
          }
        ]
      });
    } else {
      Object.assign(saleChartOption, {
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [
          {
            type: 'category',
            data: saleroomData2.value.map((d) => d.key)
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            type: 'bar',
            data: saleroomData2.value.map((d) => d.value)
          }
        ]
      });
    }
  };

  getSaleroomData();
</script>

<style lang="less" scoped>
  .monitor-card-tabs :deep(.ant-tabs-nav) {
    padding: 0 16px;
  }

  .demo-monitor-title {
    padding: 6px 20px;
  }

  .demo-monitor-rank-item {
    padding: 0 20px;
    margin-top: 18px;
  }
</style>
