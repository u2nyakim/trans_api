<!-- 全局页脚 -->
<template>
  <div class="ele-text-center" style="padding: 16px 0">
    <a-space size="large">
      <a class="ele-text-secondary" href="https://nya.kim" target="_blank">
        {{ t('layout.footer.blog') }}
      </a>
    </a-space>
    <div class="ele-text-secondary" style="margin-top: 8px">
      {{ t('layout.footer.copyright') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
</script>
