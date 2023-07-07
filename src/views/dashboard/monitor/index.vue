<template>
  <div class="ele-body ele-body-card">
    <statistics-card />
    <a-row :gutter="16">
      <a-col
        v-bind="
          styleResponsive ? { lg: 18, md: 24, sm: 24, xs: 24 } : { span: 18 }
        "
      >
        <map-card />
      </a-col>
      <a-col
        v-bind="
          styleResponsive ? { lg: 6, md: 24, sm: 24, xs: 24 } : { span: 6 }
        "
      >
        <a-row :gutter="16">
          <a-col
            v-bind="
              styleResponsive
                ? { lg: 24, md: 12, sm: 12, xs: 24 }
                : { span: 24 }
            "
          >
            <online-num />
          </a-col>
          <a-col
            v-bind="
              styleResponsive
                ? { lg: 24, md: 12, sm: 12, xs: 24 }
                : { span: 24 }
            "
          >
            <browser-card />
          </a-col>
        </a-row>
      </a-col>
    </a-row>
    <a-row :gutter="16">
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 12, lg: 24, md: 24, sm: 24, xs: 24 }
            : { span: 12 }
        "
      >
        <user-rate />
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 12, xs: 24 }
            : { span: 6 }
        "
      >
        <user-satisfaction />
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 12, xs: 24 }
            : { span: 6 }
        "
      >
        <user-liveness />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import StatisticsCard from './components/statistics-card.vue';
  import MapCard from './components/map-card.vue';
  import OnlineNum from './components/online-num.vue';
  import BrowserCard from './components/browser-card.vue';
  import UserRate from './components/user-rate.vue';
  import UserSatisfaction from './components/user-satisfaction.vue';
  import UserLiveness from './components/user-liveness.vue';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
</script>

<script lang="ts">
  export default {
    name: 'DashboardMonitor'
  };
</script>
