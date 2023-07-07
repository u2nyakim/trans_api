<!-- 快捷方式 -->
<template>
  <a-row :gutter="16" ref="wrapRef">
    <a-col
      v-for="item in data"
      :key="item.url"
      v-bind="styleResponsive ? { lg: 3, md: 6, sm: 12, xs: 12 } : { span: 3 }"
    >
      <a-card :bordered="false" hoverable :body-style="{ padding: 0 }">
        <router-link :to="item.url" class="app-link-block">
          <component
            :is="item.icon"
            class="app-link-icon"
            :style="{ color: item.color }"
          />
          <div class="app-link-title">{{ item.title }}</div>
        </router-link>
      </a-card>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import SortableJs from 'sortablejs';
  import type { Row as ARow } from 'ant-design-vue/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  const CACHE_KEY = 'workplace-links';

  interface LinkItem {
    icon: string;
    title: string;
    url: string;
    color?: string;
  }

  // 默认顺序
  const DEFAULT: LinkItem[] = [
    {
      icon: 'user-outlined',
      title: '用户',
      url: '/system/user'
    },
    {
      icon: 'shopping-cart-outlined',
      title: '分析',
      url: '/dashboard/analysis',
      color: '#95de64'
    },
    {
      icon: 'fund-projection-screen-outlined',
      title: '商品',
      url: '/list/card/project',
      color: '#ff9c6e'
    },
    {
      icon: 'file-search-outlined',
      title: '订单',
      url: '/list/basic',
      color: '#b37feb'
    },
    {
      icon: 'credit-card-outlined',
      title: '票据',
      url: '/list/advanced',
      color: '#ffd666'
    },
    {
      icon: 'mail-outlined',
      title: '消息',
      url: '/user/message',
      color: '#5cdbd3'
    },
    {
      icon: 'tags-outlined',
      title: '标签',
      url: '/extension/tag',
      color: '#ff85c0'
    },
    {
      icon: 'control-outlined',
      title: '配置',
      url: '/user/profile',
      color: '#ffc069'
    }
  ];

  // 获取缓存的顺序
  const cache = (() => {
    const str = localStorage.getItem(CACHE_KEY);
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      return null;
    }
  })();

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const data = ref<LinkItem[]>([...(cache ?? DEFAULT)]);

  const wrapRef = ref<InstanceType<typeof ARow> | null>(null);

  let sortableIns: SortableJs | null = null;

  /* 重置布局 */
  const reset = () => {
    data.value = [...DEFAULT];
    cacheData();
  };

  /* 缓存布局 */
  const cacheData = () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.value));
  };

  onMounted(() => {
    const isTouchDevice = 'ontouchstart' in document.documentElement;
    if (isTouchDevice) {
      return;
    }
    sortableIns = new SortableJs(wrapRef.value?.$el, {
      animation: 300,
      onUpdate: ({ oldIndex, newIndex }) => {
        if (typeof oldIndex === 'number' && typeof newIndex === 'number') {
          const temp = [...data.value];
          temp.splice(newIndex, 0, temp.splice(oldIndex, 1)[0]);
          data.value = temp;
          cacheData();
        }
      },
      setData: () => {}
    });
  });

  onBeforeUnmount(() => {
    if (sortableIns) {
      sortableIns.destroy();
    }
  });

  defineExpose({ reset });
</script>

<script lang="ts">
  import {
    UserOutlined,
    ShoppingCartOutlined,
    FundProjectionScreenOutlined,
    FileSearchOutlined,
    CreditCardOutlined,
    MailOutlined,
    TagsOutlined,
    ControlOutlined
  } from '@ant-design/icons-vue';

  export default {
    components: {
      UserOutlined,
      ShoppingCartOutlined,
      FundProjectionScreenOutlined,
      FileSearchOutlined,
      CreditCardOutlined,
      MailOutlined,
      TagsOutlined,
      ControlOutlined
    }
  };
</script>

<style lang="less" scoped>
  .app-link-block {
    padding: 12px;
    text-align: center;
    display: block;
    color: inherit;

    .app-link-icon {
      color: #69c0ff;
      font-size: 30px;
      margin: 6px 0 10px 0;
    }
  }
</style>
