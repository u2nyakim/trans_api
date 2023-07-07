<template>
  <div class="ele-body">
    <a-card :bordered="false" :body-style="{ padding: '16px 16px' }">
      <a-row :gutter="14">
        <a-col
          v-bind="
            styleResponsive ? { lg: 12, md: 24, sm: 24, xs: 24 } : { span: 12 }
          "
        >
          <!-- 未选择的班级数据表格 -->
          <ele-pro-table
            bordered
            size="small"
            :toolkit="[]"
            :columns="columns"
            row-key="classesId"
            sub-title="未选班级:"
            empty-text="已全部选择"
            tools-theme="default"
            :show-size-changer="false"
            :datasource="unChooseClass"
            :scroll="{ x: 400 }"
          >
            <template #toolkit>
              <a-button type="dashed" class="ele-btn-icon" @click="addAll">
                全部添加
              </a-button>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button size="small" type="dashed" @click="addItem(record)">
                  添加
                </a-button>
              </template>
            </template>
          </ele-pro-table>
        </a-col>
        <a-col
          v-bind="
            styleResponsive ? { lg: 12, md: 24, sm: 24, xs: 24 } : { span: 12 }
          "
        >
          <!-- 已选择的班级数据表格 -->
          <ele-pro-table
            bordered
            size="small"
            :toolkit="[]"
            :columns="columns"
            row-key="classesId"
            sub-title="已选班级:"
            emptyText="未选择班级"
            tools-theme="default"
            :show-size-changer="false"
            :datasource="chooseClasses"
            :scroll="{ x: 400 }"
          >
            <template #toolkit>
              <a-button
                danger
                type="dashed"
                class="ele-btn-icon"
                @click="removeAll"
              >
                全部移除
              </a-button>
            </template>
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <a-button
                  danger
                  size="small"
                  type="dashed"
                  @click="removeItem(record)"
                >
                  移除
                </a-button>
              </template>
            </template>
          </ele-pro-table>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import { getAllClasses } from '@/api/example/choose';
  import type { Classes } from '@/api/example/choose/model';
  import type { ColumnItem } from 'ele-admin-pro/es/ele-pro-table/types';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  // 全部班级
  const classes = ref<Classes[]>([]);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      width: 90,
      title: '操作',
      key: 'action',
      align: 'center',
      fixed: 'left'
    },
    {
      title: '班级名称',
      dataIndex: 'classesName',
      ellipsis: true,
      sorter: true
    },
    {
      title: '专业',
      dataIndex: 'major',
      ellipsis: true,
      sorter: true
    },
    {
      title: '学院',
      dataIndex: 'college',
      ellipsis: true,
      sorter: true
    }
  ]);

  // 已选择的班级数据
  const chooseClasses = ref<Classes[]>([]);

  // 未选择的班级数据
  const unChooseClass = computed(() =>
    classes.value.filter((d) => chooseClasses.value.indexOf(d) === -1)
  );

  /* 获取全部班级 */
  const query = () => {
    getAllClasses()
      .then((data) => {
        classes.value = data;
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  query();

  /* 添加 */
  const addItem = (row: Classes) => {
    chooseClasses.value = [...chooseClasses.value, row];
  };

  /* 移除 */
  const removeItem = (row: Classes) => {
    const index = chooseClasses.value.indexOf(row);
    chooseClasses.value = chooseClasses.value.filter((_d, i) => i !== index);
  };

  /* 添加全部 */
  const addAll = () => {
    chooseClasses.value = [...classes.value];
  };

  /* 移除所有 */
  const removeAll = () => {
    chooseClasses.value = [];
  };
</script>

<script lang="ts">
  export default {
    name: 'ExampleChoose'
  };
</script>
