<template>
  <div class="ele-body ele-body-card">
    <a-card title="滚动数字" :bordered="false">
      <h1 style="padding-left: 10px; margin-bottom: 15px">
        <ele-count-up
          :delay="0"
          :end-val="demoNum"
          :options="option"
          @ready="onReady"
        />
      </h1>
      <a-space>
        <a-button class="ele-btn-icon" @click="restart">重新开始</a-button>
        <a-button class="ele-btn-icon" @click="update">更新数字</a-button>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import type { CountUp } from 'countup.js';

  // 值
  const demoNum = ref(6317);

  // 配置
  const option = reactive({
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.',
    prefix: '',
    suffix: ''
  });

  let instance: CountUp;

  /* 渲染完成 */
  const onReady = (ins: CountUp) => {
    instance = ins;
  };

  /* 重新开始 */
  const restart = () => {
    if (!instance) {
      return;
    }
    instance.reset();
    instance.start();
  };

  /* 更新 */
  const update = () => {
    demoNum.value += 100 + Math.round(Math.random() * 300);
  };
</script>

<script lang="ts">
  export default {
    name: 'ExtensionCountUp'
  };
</script>
