<template>
  <div class="ele-body ele-body-card">
    <statistics-card />
    <sale-card />
    <a-row :gutter="16">
      <a-col
        v-bind="
          styleResponsive ? { lg: 24, md: 24, sm: 24, xs: 24 } : { span: 16 }
        "
      >
        <visit-hour />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import StatisticsCard from './components/statistics-card.vue';
  import SaleCard from './components/sale-card.vue';
  import VisitHour from './components/visit-hour.vue';


  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
</script>

<script lang="ts">
  export default {
    name: 'DashboardAnalysis'
  };
</script>
