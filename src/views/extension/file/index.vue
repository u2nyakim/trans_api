<template>
  <div class="ele-body">
    <a-card :bordered="false" :body-style="{ padding: 0 }">
      <div style="padding: 16px 16px 12px 16px">
        <file-toolbar
          v-model:grid="grid"
          :checked="checked"
          :parentId="parentId"
          @done="onDone"
        />
        <file-header
          :total="total"
          :directorys="directorys"
          @update:directorys="updateDirectorys"
        />
      </div>
      <a-spin :spinning="loading">
        <file-list
          :grid="grid"
          :data="data"
          :sort="sort"
          :order="order"
          :parentId="parentId"
          v-model:checked="checked"
          @sort-change="onSortChange"
          @go-directory="onGoDirectory"
          @done="onDone"
        />
      </a-spin>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type {
    FileItem,
    SortValue
  } from 'ele-admin-pro/es/ele-file-list/types';
  import FileToolbar from './components/file-toolbar.vue';
  import FileHeader from './components/file-header.vue';
  import FileList from './components/file-list.vue';
  import { listUserFiles } from '@/api/system/user-file';
  import type { UserFile } from '@/api/system/user-file/model';

  // 加载状态
  const loading = ref(true);

  // 文件列表数据
  const data = ref<FileItem[]>([]);

  // 排序字段
  const sort = ref<string>('');

  // 排序方式
  const order = ref<string>('');

  // 选中数据
  const checked = ref<FileItem[]>([]);

  // 文件夹数据
  const directorys = ref<UserFile[]>([]);

  // 总文件数
  const total = ref<number>(0);

  // 是否网格展示
  const grid = ref(true);

  // 父级 id
  const parentId = ref<number>(0);

  /* 查询文件列表 */
  const query = () => {
    data.value = [];
    checked.value = [];
    loading.value = true;
    listUserFiles({
      sort: order.value ? sort.value : '',
      order: order.value,
      parentId: parentId.value
    })
      .then((list) => {
        loading.value = false;
        data.value = list.map((d) => {
          return Object.assign({ name: d.name }, d, {
            isDirectory: d.isDirectory === 1 ? true : false,
            length: formatLength(d.length)
          });
        });
        total.value = list.length;
      })
      .catch((e) => {
        loading.value = false;
        message.error(e.message);
      });
  };

  /* 刷新列表数据 */
  const onDone = () => {
    query();
  };

  /* 文件列表排序方式改变 */
  const onSortChange = (option: SortValue) => {
    order.value = option.order;
    sort.value = option.sort;
    query();
  };

  /* 进入文件夹 */
  const onGoDirectory = (item: UserFile) => {
    updateDirectorys([...directorys.value, item]);
  };

  /* 更新文件夹数据 */
  const updateDirectorys = (values: UserFile[]) => {
    directorys.value = values;
    parentId.value = directorys.value[directorys.value.length - 1]?.id ?? 0;
    query();
  };

  /* 格式化文件大小 */
  const formatLength = (length?: number) => {
    if (length == null) {
      return '-';
    }
    if (length < 1024) {
      return length + 'B';
    } else if (length < 1024 * 1024) {
      return (length / 1024).toFixed(1) + 'KB';
    } else if (length < 1024 * 1024 * 1024) {
      return (length / 1024 / 1024).toFixed(1) + 'M';
    } else {
      return (length / 1024 / 1024 / 1024).toFixed(1) + 'G';
    }
  };

  query();
</script>

<script lang="ts">
  export default {
    name: 'ExtensionFile'
  };
</script>
