<template>
  <a-card :bordered="false" title="用户分布">
    <a-row>
      <a-col v-bind="styleResponsive ? { sm: 18, xs: 24 } : { span: 18 }">
        <v-chart
          ref="userCountMapChartRef"
          :option="userCountMapOption"
          style="height: 469px"
        />
      </a-col>
      <a-col v-bind="styleResponsive ? { sm: 6, xs: 24 } : { span: 6 }">
        <div
          v-for="item in userCountDataRank"
          :key="item.name"
          class="monitor-user-count-item ele-cell"
        >
          <div>{{ item.name }}</div>
          <div class="ele-cell-content">
            <a-progress
              status="normal"
              :show-info="false"
              :percent="item.percent"
            />
          </div>
          <div>{{ item.value }}</div>
        </div>
      </a-col>
    </a-row>
  </a-card>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { use, registerMap } from 'echarts/core';
  import type { EChartsCoreOption } from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { MapChart } from 'echarts/charts';
  import {
    VisualMapComponent,
    GeoComponent,
    TooltipComponent
  } from 'echarts/components';
  import VChart from 'vue-echarts';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import { getChinaMapData, getUserCountList } from '@/api/dashboard/monitor';
  import type { UserCount } from '@/api/dashboard/monitor/model';
  import useEcharts from '@/utils/use-echarts';

  use([
    CanvasRenderer,
    MapChart,
    VisualMapComponent,
    GeoComponent,
    TooltipComponent
  ]);

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  //
  const userCountMapChartRef = ref<InstanceType<typeof VChart> | null>(null);

  useEcharts([userCountMapChartRef]);

  // 用户分布前 10 名
  const userCountDataRank = ref<UserCount[]>([]);

  // 用户分布地图配置
  const userCountMapOption: EChartsCoreOption = reactive({});

  /* 获取中国地图数据并注册地图 */
  const registerChinaMap = () => {
    getChinaMapData()
      .then((data) => {
        registerMap('china', data);
        getUserCountData();
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  /* 获取用户分布数据 */
  const getUserCountData = () => {
    getUserCountList()
      .then((data) => {
        const temp = data.sort((a, b) => b.value - a.value);
        const min = temp[temp.length - 1].value || 0;
        const max = temp[0].value || 1;
        //
        const list = temp.length > 10 ? temp.slice(0, 15) : temp;
        userCountDataRank.value = list.map((d) => {
          return {
            name: d.name,
            value: d.value,
            percent: (d.value / max) * 100
          };
        });
        //
        Object.assign(userCountMapOption, {
          tooltip: {
            trigger: 'item',
            borderWidth: 1
          },
          visualMap: {
            min: min,
            max: max,
            text: ['高', '低'],
            calculable: true
          },
          series: [
            {
              name: '用户数',
              label: {
                show: true
              },
              type: 'map',
              map: 'china',
              data: data
            }
          ]
        });
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  registerChinaMap();
</script>

<style lang="less" scoped>
  .monitor-user-count-item {
    margin-bottom: 8px;

    :deep(.ant-progress-inner) {
      background: none;
    }

    .ele-cell-content {
      padding-right: 10px;
    }
  }
</style>
